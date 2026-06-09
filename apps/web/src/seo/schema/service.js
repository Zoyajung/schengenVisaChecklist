// =============================================================================
// Service + ItemList schema — generated from a landing page's `services` field.
// Each service is provided by the site Organization; all services are also
// aggregated into a single ItemList for rich results.
// =============================================================================

import {SITE_URL, SITE_NAME} from '@/constants/site'

const CONTEXT = 'https://schema.org'

/** Valid service entries (must have a name). */
function validServices(services) {
  return (Array.isArray(services) ? services : []).filter((s) => s && s.name)
}

/**
 * One Service JSON-LD node per service entry. Returns [] when there are none.
 * @param {{services?:any[], settings?:any}} opts
 */
export function generateServiceSchemas({services = [], settings = {}} = {}) {
  const provider = {
    '@type': 'Organization',
    name: settings.name || SITE_NAME,
    url: settings.url || SITE_URL,
  }
  return validServices(services).map((s) => {
    const schema = {
      '@context': CONTEXT,
      '@type': 'Service',
      name: s.name,
      provider,
    }
    if (s.description) schema.description = s.description
    if (s.url) schema.url = s.url
    return schema
  })
}

/**
 * ItemList aggregating the page's services for rich results, or null if none.
 * @param {{services?:any[], name?:string}} opts
 */
export function generateServiceItemList({services = [], name = 'Services'} = {}) {
  const items = validServices(services)
  if (!items.length) return null
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    name,
    itemListElement: items.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      ...(s.url ? {url: s.url} : {}),
    })),
  }
}
