// =============================================================================
// BlogQuickAnswer — AI / voice "quick answer" content. NOT shown visually: it exists
// only to feed the Speakable JSON-LD schema (cssSelector `.ds-speakable`) so
// voice assistants and AI search can read it. Rendered screen-reader-only.
// Content comes from the document's `aiSeo.quickAnswer` field in Sanity.
// =============================================================================

/**
 * Screen-reader-only Speakable target. Carries the `ds-speakable` class so the
 * Speakable schema can resolve to it. Produces no visible UI.
 */
export default function BlogQuickAnswer({text}) {
  if (!text) return null
  return (
    <div className="ds-speakable sr-only" data-speakable="quick-answer">
      {text}
    </div>
  )
}
