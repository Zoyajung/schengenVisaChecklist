// =============================================================================
// LocalBusiness schema — extends Organization with physical business fields:
// address (PostalAddress), telephone, and geo coordinates. Reads brand info
// from Site Settings. Pass `extra` with address/telephone/geo to the function.
// Set primarySchemaType to "localBusiness" in Sanity schemaConfig to activate.
// =============================================================================

import {SITE_URL} from '@/constants/site'
import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * LocalBusiness JSON-LD from Site Settings (+ optional address/geo).
 * @param {any} settings
 * @param {{address?:object, telephone?:string, geo?:{lat:number,lng:number}}} [extra]
 */
export function generateLocalBusinessSchema(settings = {}, extra = {}) {
  if (!settings.name) return null
  const schema = {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    name: settings.name,
    url: settings.url || SITE_URL,
  }
  const logo = imageUrl(settings.logo, {width: 512})
  if (logo) schema.image = logo
  if (extra.telephone) schema.telephone = extra.telephone
  if (extra.address) schema.address = {'@type': 'PostalAddress', ...extra.address}
  if (extra.geo) schema.geo = {'@type': 'GeoCoordinates', latitude: extra.geo.lat, longitude: extra.geo.lng}
  return schema
}
