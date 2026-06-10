// =============================================================================
// Redirect query — fetches all enabled `redirect` documents for the middleware
// proxy (proxy.js). Manages editor-controlled 301/302 redirects without a
// redeploy. Slug-history redirects (oldSlugs[]) live in the page routes.
// =============================================================================

/** Enabled standalone redirects, consumed by the proxy. */
export const REDIRECTS_QUERY = `*[_type == "redirect" && enabled == true]{
  source, destination, "permanent": coalesce(permanent, true)
}`
