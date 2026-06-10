// =============================================================================
// BreadcrumbList schema — generates a schema.org/BreadcrumbList node from an
// ordered array of {name, url} items. Auto-emitted on every page that passes
// a breadcrumbs array to buildPostSchemas / buildPageSchemas.
// =============================================================================

const CONTEXT = 'https://schema.org'

/**
 * BreadcrumbList JSON-LD.
 * @param {{name:string,url:string}[]} items
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items.length) return null
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
