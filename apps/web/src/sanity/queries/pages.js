// =============================================================================
// Landing page SEO queries
// =============================================================================

import {seoFields, aiSeoFields, schemaConfigFields} from './fragments'

const landingPageSeoFields = `{
  _id, _type, title, "slug": slug.current,
  publishedAt, "updatedAt": coalesce(updatedAt, _updatedAt),
  "faq": selectedFaqs[]->{question, answer},
  "seo": seo${seoFields},
  "aiSeo": aiSeo${aiSeoFields},
  "schemaConfig": schemaConfig${schemaConfigFields}
}`

/** Get landing page SEO by route slug ("/" = home, "faq" = /faq, etc.) */
export const LANDING_PAGE_SEO_QUERY = `*[_type == "landingPageSeo" && slug.current == $slug][0] ${landingPageSeoFields}`

/** All landing pages for sitemap — always indexed. */
export const ALL_LANDING_PAGES_QUERY = `*[_type == "landingPageSeo"]{ "slug": slug.current }`
