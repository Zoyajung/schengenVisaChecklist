import {notFound} from 'next/navigation'
import {CalendarCheck, CheckCircle2, Clock3, ExternalLink, FileCheck2, Landmark, ShieldCheck} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {GENERATED_RESULT_BY_SLUG_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import Container from '@/components/ui/Container'
import ResultActions from '@/components/checklist/ResultActions'
import LocalDate from '@/components/checklist/LocalDate'
import {needsShortStaySchengenVisa} from '@/constants/visa-policy'
import {getMessages, t} from '@/messages'

function parseResult(record) {
  if (!record?.generatedJson) return null
  try {
    return JSON.parse(record.generatedJson)
  } catch {
    return null
  }
}

async function loadResult(slug) {
  return sanityFetch({
    query: GENERATED_RESULT_BY_SLUG_QUERY,
    params: {slug},
    tags: ['generatedResult', `generatedResult:${slug}`],
    revalidate: 30,
  })
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const [settings, record] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    loadResult(slug),
  ])
  const result = parseResult(record)
  const metadata = buildMetadata({
    settings: settings || {},
    doc: {
      title: result?.summary?.title || 'Generated Schengen checklist',
      seo: {metaDescription: result?.summary?.applicantProfile || ''},
    },
    path: `/result/${slug}`,
    locale,
  })
  if (!record?.indexable) metadata.robots = {index: false, follow: false}
  return metadata
}

function documentsByStatus(documents, status) {
  return (documents || []).filter((document) => document.status === status)
}

function DocumentGroup({title, items}) {
  if (!items.length) return null
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
          <FileCheck2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {items.map((document) => (
          <article key={`${document.status}-${document.name}`} className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-primary/40 hover:bg-white">
            <h3 className="font-bold text-slate-900">{document.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{document.explanation}</p>
            {document.appliesWhen ? <p className="mt-3 text-xs font-bold text-primary">{document.appliesWhen}</p> : null}
            {document.commonMistakes?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                {document.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default async function ResultPage({params}) {
  const {locale, slug} = await params
  const messages = getMessages(locale)
  const record = await loadResult(slug)
  const result = parseResult(record)

  if (!record || !result) notFound()

  const visaRequired = needsShortStaySchengenVisa(record.userInputs?.nationality)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-secondary text-white">
        <Container className="py-8 sm:py-10">
          <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
            {!record.indexable ? (
              <p className="mb-3 inline-flex rounded-md bg-tertiary px-3 py-1.5 text-xs font-bold text-secondary">
                {t(messages, 'result.noindex')}
              </p>
            ) : null}
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-tertiary">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {t(messages, 'result.summary')}
                </div>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{result.summary.title}</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/75">{result.summary.applicantProfile}</p>
              </div>
              <ResultActions locale={locale} slug={slug} />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-6 sm:py-8">
        <div className="space-y-5">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-bold text-slate-600">{t(messages, 'result.lastChecked')}</h2>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-950"><LocalDate value={result.summary.lastCheckedDate} /></p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-tertiary text-secondary">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-bold text-slate-600">{t(messages, 'result.visaRequired')}</h2>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-950">
                {visaRequired ? t(messages, 'result.visaRequiredYes') : t(messages, 'result.visaRequiredNo')}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(messages, 'result.visaRequiredNote')}</p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">
                {visaRequired ? t(messages, 'result.whereToApply') : t(messages, 'result.entryGuidance')}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{result.applicationRoute.whereToApply}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-900">{t(messages, 'result.officialPortal')}</h3>
                <a href={result.applicationRoute.officialPortal} target="_blank" rel="noopener noreferrer" className="mt-2 flex break-all text-sm font-semibold text-primary hover:text-secondary">
                  {result.applicationRoute.officialPortal}
                </a>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-900">{t(messages, 'result.appointmentProvider')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{result.applicationRoute.appointmentProvider}</p>
              </div>
            </div>
            {result.applicationRoute.applicationCenters?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.applicationRoute.applicationCenters.map((center) => (
                  <span key={center} className="rounded-md bg-tertiary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {center}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">{t(messages, 'result.steps')}</h2>
            </div>
            <ol className="mt-5 grid gap-3 md:grid-cols-2">
              {result.steps.map((step) => (
                <li key={step.stepNumber} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">{step.stepNumber}</span>
                  <span>
                    <strong className="block text-slate-900">{step.title}</strong>
                    <span className="text-sm leading-6 text-slate-600">{step.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <DocumentGroup title={t(messages, 'result.required')} items={documentsByStatus(result.documents, 'required')} />
          <DocumentGroup title={t(messages, 'result.conditional')} items={documentsByStatus(result.documents, 'conditional')} />
          <DocumentGroup title={t(messages, 'result.optional')} items={documentsByStatus(result.documents, 'optional')} />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">{t(messages, 'result.feesAndTiming')}</h2>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{result.feesAndTiming.visaFeeNotes}</div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{result.feesAndTiming.serviceFeeNotes}</div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{result.feesAndTiming.processingTimeNotes}</div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-slate-950">{t(messages, 'result.officialSources')}</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.officialSources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-primary/40 hover:bg-white"
                >
                  <span className="block text-sm font-bold leading-5 text-slate-900">{source.title}</span>
                  <span className="mt-3 inline-flex rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-500">
                    {source.sourceType}
                  </span>
                </a>
              ))}
            </div>
          </section>

          <p className="rounded-lg border border-tertiary/30 bg-tertiary/10 p-5 text-sm leading-6 text-slate-700">
            {result.disclaimer}
          </p>
        </div>
      </Container>
    </main>
  )
}
