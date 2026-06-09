// =============================================================================
// WebSite schema — emitted site-wide from the root layout on every page.
// Includes a SearchAction (potentialAction) so Google can show the Sitelinks
// Search Box beneath the site name in search results. No per-page config
// needed — this is always on.
// =============================================================================

import {SITE_URL, SITE_NAME} from '@/constants/site'

const CONTEXT = 'https://schema.org'

/**
 * WebSite JSON-LD — includes a SearchAction so Google can show the
 * Sitelinks search box beneath the site name in results.
 * Emitted once in the root layout; no per-page work needed.
 * @param {any} settings
 */
export function generateWebsiteSchema(settings = {}) {
  const siteUrl = settings.url || SITE_URL
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: settings.name || SITE_NAME,
    url: siteUrl,
    // Sitelinks search box — tells Google the URL pattern for on-site search.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
