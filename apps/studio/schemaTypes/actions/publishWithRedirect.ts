import {useClient, type DocumentActionComponent} from 'sanity'

const API_VERSION = '2025-01-01'

/**
 * Wraps the default Publish action so that, when a document's slug has changed
 * since it was last published, the previous slug is appended to `oldSlugs[]`
 * before publishing. The frontend then 301-redirects old slugs to the current
 * one. Best-effort — failures never block publishing.
 */
export function wrapPublish(originalAction: DocumentActionComponent): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const original = originalAction(props)
    const client = useClient({apiVersion: API_VERSION})
    if (!original) return original

    return {
      ...original,
      onHandle: async () => {
        try {
          const publishedSlug = (props.published as {slug?: {current?: string}} | null)?.slug?.current
          const draft = props.draft as {_id?: string; slug?: {current?: string}; oldSlugs?: string[]} | null
          const draftSlug = draft?.slug?.current
          const existing = draft?.oldSlugs || []

          if (publishedSlug && draftSlug && publishedSlug !== draftSlug && !existing.includes(publishedSlug) && draft?._id) {
            await client
              .patch(draft._id)
              .setIfMissing({oldSlugs: []})
              .append('oldSlugs', [publishedSlug])
              .commit()
          }
        } catch {
          // best-effort: never block publish on redirect bookkeeping
        }
        original.onHandle?.()
      },
    }
  }
  return Wrapped
}
