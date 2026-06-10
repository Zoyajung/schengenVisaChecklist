import {sanityFetch} from '@/sanity/lib/fetch'
import {GENERATED_RESULT_BY_SLUG_QUERY} from '@/sanity/queries'
import {clampFutureDateToSiteToday} from '@/utils/date'

export const runtime = 'nodejs'

const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const MARGIN = 48
const LINE_HEIGHT = 14

function parseResult(record) {
  if (!record?.generatedJson) return null
  try {
    return JSON.parse(record.generatedJson)
  } catch {
    return null
  }
}

function cleanText(value) {
  return String(value || '')
    .replace(/\u20ac/g, 'EUR')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .normalize('NFKD')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapePdf(value) {
  return cleanText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function wrapText(value, maxChars) {
  const text = cleanText(value)
  if (!text) return []

  const lines = []
  let current = ''

  for (const word of text.split(/\s+/)) {
    if (word.length > maxChars) {
      if (current) lines.push(current)
      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars))
      }
      current = ''
      continue
    }

    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines
}

function groupDocuments(documents = [], status) {
  return documents.filter((document) => document.status === status)
}

function createPdfRenderer() {
  const pages = []
  let commands = []
  let y = PAGE_HEIGHT - MARGIN

  function newPage() {
    pages.push(commands.join('\n'))
    commands = []
    y = PAGE_HEIGHT - MARGIN
  }

  function ensureSpace(size = LINE_HEIGHT) {
    if (y - size < MARGIN) newPage()
  }

  function addLine(value, {size = 10, bold = false, indent = 0, gapAfter = 0} = {}) {
    ensureSpace(size + gapAfter)
    const font = bold ? 'F2' : 'F1'
    commands.push(`BT /${font} ${size} Tf ${MARGIN + indent} ${y.toFixed(2)} Td (${escapePdf(value)}) Tj ET`)
    y -= size * 1.35 + gapAfter
  }

  function addWrapped(value, options = {}) {
    const size = options.size || 10
    const maxChars = options.maxChars || Math.max(42, Math.floor((PAGE_WIDTH - MARGIN * 2 - (options.indent || 0)) / (size * 0.52)))
    const lines = wrapText(value, maxChars)
    for (const line of lines) addLine(line, options)
  }

  function addGap(height = 8) {
    ensureSpace(height)
    y -= height
  }

  function finish() {
    if (commands.length || !pages.length) pages.push(commands.join('\n'))
    return pages
  }

  return {addLine, addWrapped, addGap, finish}
}

function addDocumentGroup(renderer, title, documents) {
  if (!documents.length) return
  renderer.addLine(title, {size: 13, bold: true, gapAfter: 4})
  for (const document of documents) {
    renderer.addWrapped(`- ${document.name}`, {bold: true, indent: 12})
    renderer.addWrapped(document.explanation, {indent: 24})
    if (document.appliesWhen) renderer.addWrapped(`Applies when: ${document.appliesWhen}`, {indent: 24})
    if (document.commonMistakes?.length) {
      renderer.addWrapped(`Common mistakes: ${document.commonMistakes.join('; ')}`, {indent: 24})
    }
    renderer.addGap(5)
  }
  renderer.addGap(4)
}

function renderChecklistPages(result) {
  const renderer = createPdfRenderer()

  renderer.addWrapped(result.summary?.title || 'Generated Schengen checklist', {size: 18, bold: true, maxChars: 54, gapAfter: 6})
  renderer.addWrapped(result.summary?.applicantProfile || '', {size: 10})
  renderer.addGap(8)
  renderer.addLine(`Confidence: ${result.summary?.confidence || 'n/a'}`)
  renderer.addLine(`Last checked: ${clampFutureDateToSiteToday(result.summary?.lastCheckedDate) || 'n/a'}`)
  renderer.addGap(12)

  renderer.addLine('Where to apply', {size: 13, bold: true, gapAfter: 4})
  renderer.addWrapped(result.applicationRoute?.whereToApply || '')
  renderer.addWrapped(`Official portal: ${result.applicationRoute?.officialPortal || 'Check official source.'}`)
  renderer.addWrapped(`Appointment provider: ${result.applicationRoute?.appointmentProvider || 'Check official source.'}`)
  renderer.addGap(10)

  if (result.steps?.length) {
    renderer.addLine('How to apply', {size: 13, bold: true, gapAfter: 4})
    for (const step of result.steps) {
      renderer.addWrapped(`${step.stepNumber}. ${step.title}`, {bold: true, indent: 12})
      renderer.addWrapped(step.description, {indent: 24})
      renderer.addGap(5)
    }
    renderer.addGap(4)
  }

  addDocumentGroup(renderer, 'Required documents', groupDocuments(result.documents, 'required'))
  addDocumentGroup(renderer, 'Conditional documents', groupDocuments(result.documents, 'conditional'))
  addDocumentGroup(renderer, 'Optional documents', groupDocuments(result.documents, 'optional'))

  renderer.addLine('Fees and timing', {size: 13, bold: true, gapAfter: 4})
  renderer.addWrapped(result.feesAndTiming?.visaFeeNotes || '')
  renderer.addWrapped(result.feesAndTiming?.serviceFeeNotes || '')
  renderer.addWrapped(result.feesAndTiming?.processingTimeNotes || '')
  renderer.addGap(10)

  if (result.officialSources?.length) {
    renderer.addLine('Official sources', {size: 13, bold: true, gapAfter: 4})
    for (const source of result.officialSources) {
      renderer.addWrapped(`- ${source.title}: ${source.url}`, {indent: 12})
    }
    renderer.addGap(10)
  }

  renderer.addLine('Disclaimer', {size: 13, bold: true, gapAfter: 4})
  renderer.addWrapped(result.disclaimer || '')

  return renderer.finish()
}

function buildPdf(pages) {
  const pageIds = pages.map((_, index) => 5 + index * 2)
  const contentIds = pages.map((_, index) => 6 + index * 2)
  const objects = [
    {id: 1, body: '<< /Type /Catalog /Pages 2 0 R >>'},
    {id: 2, body: `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`},
    {id: 3, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'},
    {id: 4, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'},
  ]

  pages.forEach((content, index) => {
    objects.push({
      id: pageIds[index],
      body: [
        '<< /Type /Page',
        '/Parent 2 0 R',
        `/MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}]`,
        '/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >>',
        `/Contents ${contentIds[index]} 0 R`,
        '>>',
      ].join(' '),
    })
    objects.push({
      id: contentIds[index],
      body: `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    })
  })

  objects.sort((a, b) => a.id - b.id)

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const object of objects) {
    offsets[object.id] = pdf.length
    pdf += `${object.id} 0 obj\n${object.body}\nendobj\n`
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let id = 1; id <= objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new TextEncoder().encode(pdf)
}

function filenameFromSlug(slug) {
  return `${cleanText(slug).replace(/[^a-zA-Z0-9-]+/g, '-').replace(/(^-|-$)/g, '') || 'checklist'}.pdf`
}

export async function GET(_request, {params}) {
  const {slug} = await params
  const record = await sanityFetch({
    query: GENERATED_RESULT_BY_SLUG_QUERY,
    params: {slug},
    tags: ['generatedResult', `generatedResult:${slug}`],
    revalidate: 30,
  })
  const result = parseResult(record)

  if (!record || !result) {
    return Response.json({message: 'Checklist result not found.'}, {status: 404})
  }

  const pdf = buildPdf(renderChecklistPages(result))

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filenameFromSlug(slug)}"`,
      'Cache-Control': 'private, max-age=60',
    },
  })
}
