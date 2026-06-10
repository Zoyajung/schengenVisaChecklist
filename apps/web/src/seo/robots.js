// =============================================================================
// Robots helpers — converts Sanity `robots` object {noindex, nofollow} to the
// Next.js Metadata `robots` shape. Used by buildMetadata().
// =============================================================================

/**
 * Convert a Sanity robots object to Next.js Metadata `robots`.
 * @param {{noindex?:boolean, nofollow?:boolean}} [robots]
 */
export function buildRobots(robots = {}) {
  const index = !robots.noindex
  const follow = !robots.nofollow
  return {index, follow, googleBot: {index, follow}}
}
