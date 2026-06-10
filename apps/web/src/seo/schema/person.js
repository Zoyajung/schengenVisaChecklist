// =============================================================================
// Person / Organization schema generator.
// Builds a schema.org Person or Organization node depending on the author's
// entityType field. Used for E-E-A-T signals nested inside Article schemas
// and emitted standalone on author pages.
//
// All fields are auto-derived from the Sanity author document — no manual
// schema configuration is required.
// =============================================================================

import {imageUrl} from '@/sanity/lib/image'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {toPlainText} from '@/utils/portable-text'

const CONTEXT = 'https://schema.org'

/**
 * Generate a Person or Organization JSON-LD node for an author.
 *
 * entityType === 'organisation' → '@type': 'Organization' (no jobTitle)
 * entityType === 'person' (default) → '@type': 'Person'
 *
 * `withContext: true` adds @context for use as a standalone root node.
 * Omit withContext when nesting inside an Article.author field.
 *
 * @param {import('@/sanity/types').Author} author
 * @param {{withContext?:boolean, locale?:string}} [opts]
 */
export function generatePersonSchema(author, {withContext = false, locale = 'en'} = {}) {
  if (!author) return null

  const isOrg = author.entityType === 'organisation'
  const schemaType = isOrg ? 'Organization' : 'Person'

  const schema = {
    ...(withContext ? {'@context': CONTEXT} : {}),
    '@type': schemaType,
    name: author.name,
    // Canonical URL: the author's page on this site
    url: `${SITE_URL}${localizedPath(locale, `/author/${author.slug}`)}`,
  }

  // jobTitle + worksFor only apply to Person (E-E-A-T signals)
  if (!isOrg && author.role) schema.jobTitle = author.role
  if (!isOrg && author.worksFor) {
    schema.worksFor = {'@type': 'Organization', name: author.worksFor}
  }

  // Prefer short description; fall back to bio (extract plain text from portableText)
  const bioText = Array.isArray(author.bio) ? toPlainText(author.bio) : (author.bio || null)
  const desc = author.description || bioText
  if (desc) schema.description = desc

  const img = imageUrl(author.image, {width: 400})
  if (img) schema.image = img

  // sameAs: personal/org website + all social profile URLs (E-E-A-T signals)
  const sameAs = [
    author.link,
    ...((author.socials || []).map((s) => s?.url)),
  ].filter(Boolean)
  if (sameAs.length) schema.sameAs = sameAs

  return schema
}
