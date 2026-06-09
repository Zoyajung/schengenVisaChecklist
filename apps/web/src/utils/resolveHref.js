// =============================================================================
// resolveHref — converts a Sanity internal reference or link annotation to a
// locale-prefixed URL path. Used by Portable Text link marks, CTA blocks, and
// any component that needs to build a URL from a Sanity reference.
//
// Supported content types: blogPost, category
// External links are returned as-is.
// =============================================================================

import {localizedPath} from '@/i18n/routing'

/**
 * Resolve a Sanity link reference to a locale-prefixed href.
 *
 * Accepts either:
 *  - a link annotation: `{linkType, internal:{_type, slug}, href}`
 *  - a raw dereferenced reference: `{_type, slug}`
 *
 * @param {any} ref
 * @param {string} [locale]
 * @returns {string|null}
 */
export function resolveHref(ref, locale = 'en') {
  if (!ref) return null

  // External link annotation — return URL as-is.
  if (ref.linkType === 'external' || (ref.href && !ref.internal)) {
    return ref.href || null
  }

  const target = ref.internal || ref
  if (!target || !target._type) return ref.href || null

  const slug = target.slug
  let path

  switch (target._type) {
    case 'blogPost':
      path = `/blog/${slug}`
      break
    case 'category':
      path = `/blog/category/${slug}`
      break
    default:
      // Fallback: treat as a root-level slug.
      path = slug ? `/${slug}` : '/'
  }

  return localizedPath(locale, path)
}
