// =============================================================================
// Organization schema — emitted site-wide from the root layout on every page.
// Reads brand name, URL, logo, email, and social profiles from Sanity Site
// Settings so editors never need to touch code to update company details.
// =============================================================================

import {SITE_URL, SITE_NAME} from '@/constants/site'
import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * Organization JSON-LD from Site Settings.
 * @param {any} settings
 */
export function generateOrganizationSchema(settings = {}) {
  const url = settings.url || SITE_URL
  const schema = {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: settings.name || SITE_NAME,
    url,
  }
  if (settings.legalName) schema.legalName = settings.legalName
  if (settings.description) schema.description = settings.description
  const logo = imageUrl(settings.logo, {width: 512})
  if (logo) schema.logo = logo
  if (settings.contactEmail) schema.email = settings.contactEmail
  const sameAs = (settings.socialProfiles || []).map((p) => p?.url).filter(Boolean)
  if (sameAs.length) schema.sameAs = sameAs
  return schema
}
