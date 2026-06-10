// =============================================================================
// Generic page schema generator — maps a Sanity schemaConfig.primarySchemaType
// to the correct schema.org @type and populates standard fields.
//
// Covers: WebPage, AboutPage, ContactPage, FAQPage, CollectionPage,
//         Service, TravelAgency, LocalBusiness, Organization, WebSite,
//         ItemList, and more. Falls back to WebPage when unrecognised.
// =============================================================================

import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * Maps Sanity schemaConfig values to schema.org @type strings.
 * Keep in sync with PRIMARY_SCHEMA_TYPES in schemaConfig.ts.
 */
const TYPE_MAP = {
  // Page types
  webPage: 'WebPage',
  aboutPage: 'AboutPage',
  contactPage: 'ContactPage',
  faqPage: 'FAQPage',
  collectionPage: 'CollectionPage',
  searchResultsPage: 'SearchResultsPage',
  // Article / content
  article: 'Article',
  blogPosting: 'BlogPosting',
  howTo: 'HowTo',
  // Commerce
  product: 'Product',
  review: 'Review',
  itemList: 'ItemList',
  // Organisation / business
  organization: 'Organization',
  localBusiness: 'LocalBusiness',
  service: 'Service',
  travelAgency: 'TravelAgency',
  // Site-level
  webSite: 'WebSite',
}

/**
 * Whether a schema type is an Organisation / LocalBusiness variant.
 * These get a `provider` field rather than being a pure WebPage.
 */
const ORG_TYPES = new Set(['Organization', 'LocalBusiness', 'Service', 'TravelAgency'])

/**
 * Generate the primary JSON-LD entity for a landing page.
 *
 * @param {{
 *   page: any,
 *   url: string,
 *   settings?: any,
 *   type?: string,
 *   faqs?: {question:string, answer:string}[]
 * }} opts
 */
export function generatePageSchema({page, url, settings = {}, type = 'webPage', faqs = []}) {
  const schemaType = TYPE_MAP[type] || 'WebPage'

  const name =
    page?.seo?.metaTitle ||
    page?.title ||
    settings?.name ||
    url

  const description = page?.seo?.metaDescription || settings?.description

  const schema = {
    '@context': CONTEXT,
    '@type': schemaType,
    name,
    url,
  }

  if (description) schema.description = description

  // When the page IS the FAQ page, the primary entity carries the questions so
  // FAQPage is detected as a single, valid node (no empty duplicate).
  if (schemaType === 'FAQPage' && Array.isArray(faqs) && faqs.length) {
    schema.mainEntity = faqs
      .filter((f) => f && f.question && f.answer)
      .map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {'@type': 'Answer', text: f.answer},
      }))
  }

  // Image from SEO share image or org logo
  const img = imageUrl(page?.seo?.ogImage, {width: 1200}) || imageUrl(settings?.logo, {width: 512})
  if (img) schema.image = img

  // Org / business types: add identifier fields
  if (ORG_TYPES.has(schemaType)) {
    if (settings?.name) {
      schema.legalName = settings.legalName || settings.name
    }
    if (settings?.contactEmail) schema.email = settings.contactEmail
    const logo = imageUrl(settings?.logo, {width: 512})
    if (logo) schema.logo = {'@type': 'ImageObject', url: logo}
    // Social sameAs from site settings
    const sameAs = (settings?.socialProfiles || []).map((p) => p?.url).filter(Boolean)
    if (sameAs.length) schema.sameAs = sameAs
  }

  return schema
}
