// =============================================================================
// Portable Text FAQ block — renders an inline FAQ section using <FAQSection>.
// The FAQPage JSON-LD is injected by the page, not here.
// =============================================================================

import FAQAccordion from '@/components/shared/FAQAccordion'

export default function PtFaq({value}) {
  const items = value?.items || []
  if (!items.length) return null
  return (
    <div className="my-8">
      {value.title ? <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3> : null}
      <FAQAccordion faqs={items} />
    </div>
  )
}

