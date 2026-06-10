import {useFormValue} from 'sanity'

type Check = {label: string; ok: boolean; hint?: string}

function hasInternalLink(body: unknown): boolean {
  if (!Array.isArray(body)) return false
  return body.some((block) => {
    const defs = (block as {markDefs?: Array<{_type?: string; linkType?: string}>})?.markDefs
    return Array.isArray(defs) && defs.some((d) => d?._type === 'link' && d?.linkType !== 'external')
  })
}

/**
 * SEO quality-assurance panel. Renders pass/fail checks for the current
 * document. Inherited values (from category / site) are not counted here — this
 * is document-level guidance only.
 */
export function SeoChecklist() {
  const seo = (useFormValue(['seo']) as Record<string, unknown>) || {}
  const aiSeo = (useFormValue(['aiSeo']) as Record<string, unknown>) || {}
  const featuredImage = useFormValue(['featuredImage'])
  // blogPost stores inline Q&As in `faq`; landingPageSeo references items in `selectedFaqs`.
  const inlineFaq = useFormValue(['faq']) as unknown[] | undefined
  const selectedFaqs = useFormValue(['selectedFaqs']) as unknown[] | undefined
  const faq = inlineFaq ?? selectedFaqs
  const body = useFormValue(['body'])

  const checks: Check[] = [
    {label: 'Meta title', ok: Boolean(seo.metaTitle)},
    {label: 'Meta description', ok: Boolean(seo.metaDescription)},
    {label: 'Featured image', ok: Boolean(featuredImage || seo.ogImage)},
    {label: 'Canonical URL', ok: Boolean(seo.canonicalUrl), hint: 'optional — inherited if blank'},
    {label: 'Quick Answer (AI)', ok: Boolean(aiSeo.quickAnswer)},
    {label: 'Key Takeaways', ok: Array.isArray(aiSeo.keyTakeaways) && (aiSeo.keyTakeaways as unknown[]).length > 0, hint: 'optional'},
    {label: 'FAQ', ok: Array.isArray(faq) && faq.length > 0, hint: 'optional'},
    {label: 'Internal links in body', ok: hasInternalLink(body)},
  ]

  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)
  const tone = score >= 80 ? 'ok' : score >= 50 ? 'warn' : 'error'

  return (
    <div className="ds-panel ds-checklist">
      <div className="ds-panel__head">
        <span className="ds-panel__title">SEO Checklist</span>
        <span className="ds-score" data-state={tone}>
          {passed}/{checks.length} · {score}%
        </span>
      </div>
      <ul className="ds-checklist__list">
        {checks.map((c) => (
          <li key={c.label} className="ds-checklist__item" data-ok={c.ok}>
            <span className="ds-checklist__mark">{c.ok ? '✓' : '✕'}</span>
            <span className="ds-checklist__label">{c.label}</span>
            {c.hint ? <span className="ds-checklist__hint">{c.hint}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SeoChecklist
