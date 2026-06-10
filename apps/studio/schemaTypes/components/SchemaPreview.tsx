import {useFormValue} from 'sanity'

const DEFAULT_PRIMARY: Record<string, string> = {
  blogPost: 'BlogPosting',
  page: 'WebPage',
}

/**
 * Shows which JSON-LD schemas this document will emit. All schemas for blog
 * posts are auto-detected from content — no manual configuration needed.
 * Organization + WebSite are always emitted site-wide.
 */
export function SchemaPreview() {
  const type = useFormValue(['_type']) as string
  const title = (useFormValue(['title']) as string) || ''
  // blogPost stores inline Q&As in `faq`; landingPageSeo references items in `selectedFaqs`.
  const inlineFaq = useFormValue(['faq']) as unknown[] | undefined
  const selectedFaqs = useFormValue(['selectedFaqs']) as unknown[] | undefined
  const faq = inlineFaq ?? selectedFaqs
  const author = useFormValue(['author'])
  const body = useFormValue(['body']) as Array<{_type?: string; listItem?: string}> | undefined
  const aiSeo = (useFormValue(['aiSeo']) as Record<string, unknown>) || {}

  const primary = DEFAULT_PRIMARY[type] || 'WebPage'
  const hasFaq =
    (Array.isArray(faq) && faq.length > 0) ||
    (Array.isArray(body) && body.some((b) => b?._type === 'faqBlock'))
  const hasVideo = Array.isArray(body) && body.some((b) => b?._type === 'youtube')
  // HowTo: title starts with "How to …" and (optionally) has numbered list steps
  const isHowTo = /^how\s+to\b/i.test(title.trim())
  const hasHowToSteps = isHowTo && Array.isArray(body) && body.some((b) => b?.listItem === 'number')
  // Speakable schema is auto-derived from the Quick Answer text
  const hasSpeakable = Boolean(aiSeo.quickAnswer)

  const schemas: Array<{name: string; on: boolean; note?: string}> = [
    {name: primary, on: true, note: 'primary'},
    {name: 'BreadcrumbList', on: true},
    {name: 'FAQPage', on: hasFaq, note: hasFaq ? 'auto-detected' : undefined},
    {name: 'HowTo', on: isHowTo, note: isHowTo ? (hasHowToSteps ? 'auto-detected (with steps)' : 'auto-detected (add numbered list for steps)') : undefined},
    {name: 'SpeakableSpecification', on: hasSpeakable, note: hasSpeakable ? 'auto-detected' : undefined},
    {name: 'Person (author)', on: Boolean(author)},
    {name: 'VideoObject', on: hasVideo, note: hasVideo ? 'auto-detected' : undefined},
    {name: 'Organization', on: true, note: 'site-wide'},
    {name: 'WebSite', on: true, note: 'site-wide'},
  ]

  return (
    <div className="ds-panel ds-schemapreview">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Schema Output</span>
        <span className="ds-panel__subtitle">All schemas are auto-detected from content</span>
      </div>
      <ul className="ds-schemapreview__list">
        {schemas.map((s) => (
          <li key={s.name} className="ds-schemapreview__item" data-on={s.on}>
            <span className="ds-badge" data-state={s.on ? 'ok' : 'off'}>
              {s.on ? 'JSON-LD' : 'off'}
            </span>
            <span className="ds-schemapreview__name">{s.name}</span>
            {s.note ? <span className="ds-schemapreview__note">{s.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SchemaPreview
