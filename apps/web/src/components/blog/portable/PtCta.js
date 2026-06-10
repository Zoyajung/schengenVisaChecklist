// =============================================================================
// Portable Text CTA block — renders an in-body call-to-action button. Internal links are
// resolved to locale-prefixed URLs via resolveHref().
// =============================================================================

import Button from '@/components/ui/Button'

export default function PtCta({value, locale = 'en'}) {
  if (!value?.label) return null
  return (
    <div className="my-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
      {value.heading ? <h3 className="text-lg font-semibold text-slate-900">{value.heading}</h3> : null}
      {value.text ? <p className="mt-1 text-slate-600">{value.text}</p> : null}
      <div className="mt-4">
        <Button link={value.link} style={value.style} locale={locale}>
          {value.label}
        </Button>
      </div>
    </div>
  )
}

