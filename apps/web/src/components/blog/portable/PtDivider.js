// =============================================================================
// Portable Text divider block — renders a decorative horizontal rule between sections.
// =============================================================================

import Divider from '@/components/ui/Divider'

export default function PtDivider({value}) {
  return <Divider style={value?.style} />
}

