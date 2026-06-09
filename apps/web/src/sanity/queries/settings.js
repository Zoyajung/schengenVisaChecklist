// =============================================================================
// Site Settings query — fetches the singleton `siteSettings` document which
// sits at the top of the SEO/schema inheritance chain. Every page fetches this
// to get default metadata, social sharing settings, analytics config, and
// organisation info for JSON-LD. Cached with tag `siteSettings`.
// =============================================================================

import {imageFields, seoFields, schemaConfigFields, socialDefaultsFields} from './fragments'

/** Site Settings singleton — top of the inheritance chain. */
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  name, url, description, legalName, contactEmail, titleTemplate,
  "logo": logo${imageFields},
  "defaultSeo": defaultSeo${seoFields},
  "defaultSchemaConfig": defaultSchemaConfig${schemaConfigFields},
  "socialDefaults": socialDefaults${socialDefaultsFields},
  socialProfiles,
  services[]{name, description, url},
  analytics
}`
