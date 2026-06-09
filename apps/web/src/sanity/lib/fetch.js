// =============================================================================
// sanityFetch — central data-fetching wrapper for all Sanity queries.
//
// Published mode: ISR with next.tags for on-demand revalidation (via webhook).
// Draft mode:     Uncached read using the token + `perspective: "drafts"` so
//                 the Presentation tool shows unpublished content.
//
// The `$preview` param is injected automatically so GROQ queries can reference
// it to bypass status/schedule filters while an editor is previewing.
// =============================================================================

import {draftMode} from 'next/headers'
import {client} from './client'
import {readToken, studioUrl, isSanityConfigured} from './config'

// A token-bearing client that reads drafts, used only when Draft Mode is on.
// stega encodes studio URLs into content strings so Visual Editing overlays
// know which field to open — studioUrl is required when stega is enabled.
const draftClient =
  isSanityConfigured && readToken
    ? client.withConfig({
        token: readToken,
        useCdn: false,
        perspective: 'drafts',
        stega: {enabled: true, studioUrl},
      })
    : null

/**
 * Central read helper.
 *
 * - Published mode: cached fetch tagged for on-demand revalidation.
 * - Draft Mode (Presentation / preview): uncached read of drafts.
 *
 * `preview` is injected into params automatically so queries can reference
 * `$preview` to bypass status/schedule filters while previewing.
 *
 * @template T
 * @param {{query: string, params?: Record<string, unknown>, tags?: string[], revalidate?: number}} opts
 * @returns {Promise<T | null>}
 */
export async function sanityFetch({query, params = {}, tags = [], revalidate = 60}) {
  if (!isSanityConfigured) return null

  let isDraft = false
  try {
    isDraft = (await draftMode()).isEnabled
  } catch {
    isDraft = false
  }

  const allParams = {...params, preview: isDraft}

  try {
    if (isDraft && draftClient) {
      return await draftClient.fetch(query, allParams, {cache: 'no-store', next: {tags}})
    }
    return await client.fetch(query, allParams, {next: {revalidate, tags}})
  } catch (err) {
    console.error('[sanityFetch] query failed:', err)
    return null
  }
}
