// =============================================================================
// Sanity image helpers — imageUrl() and imageAlt().
//
// GROQ queries already dereference images to `{ url, lqip, dimensions, alt }`
// via the `imageFields` fragment (see sanity/queries/fragments.js), so we only
// need to append Sanity's CDN transform query params (w, h, q, fit, auto) to
// the already-resolved CDN URL. No @sanity/image-url builder dependency needed.
//
// Usage:
//   imageUrl(post.featuredImage, { width: 1200, height: 630, fit: 'crop' })
//   imageAlt(post.featuredImage) // → alt string or ''
// =============================================================================

/**
 * @typedef {Object} SanityImage
 * @property {string} [url]
 * @property {string} [alt]
 * @property {string} [lqip]
 * @property {{width:number,height:number,aspectRatio:number}} [dimensions]
 */

/**
 * Build a transformed Sanity CDN URL.
 * @param {SanityImage|string|null|undefined} image
 * @param {{width?:number,height?:number,quality?:number,fit?:string}} [opts]
 * @returns {string|null}
 */
export function imageUrl(image, opts = {}) {
  const base = typeof image === 'string' ? image : image?.url
  if (!base) return null
  const {width, height, quality = 75, fit = 'max'} = opts
  try {
    const u = new URL(base)
    if (width) u.searchParams.set('w', String(Math.round(width)))
    if (height) u.searchParams.set('h', String(Math.round(height)))
    u.searchParams.set('q', String(quality))
    u.searchParams.set('fit', fit)
    u.searchParams.set('auto', 'format')
    return u.toString()
  } catch {
    return base
  }
}

/**
 * Convenience accessor for alt text.
 * @param {SanityImage|null|undefined} image
 * @returns {string}
 */
export function imageAlt(image) {
  return image?.alt || ''
}
