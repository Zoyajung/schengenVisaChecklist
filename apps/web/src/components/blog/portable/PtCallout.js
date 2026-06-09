// =============================================================================
// Portable Text callout block — renders tone-colored callout boxes (info/success/warning/danger).
// Delegates to the shared <Callout> UI component.
// =============================================================================

import Callout from '@/components/ui/Callout'

export default function PtCallout({value}) {
  if (!value?.content) return null
  return (
    <Callout tone={value.tone} title={value.title}>
      {value.content}
    </Callout>
  )
}

