// =============================================================================
// Product schema — generates a schema.org/Product node. Includes Offer pricing
// and AggregateRating when provided. Use when the landing page primarySchemaType
// is set to "product" in the Sanity schemaConfig field.
// =============================================================================

import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * Product JSON-LD.
 * @param {{name:string, description?:string, image?:any, brand?:string,
 *   offers?:{price:string|number, currency?:string, availability?:string, url?:string},
 *   rating?:{value:number, count:number}}} opts
 */
export function generateProductSchema({name, description, image, brand, offers, rating}) {
  if (!name) return null
  const schema = {'@context': CONTEXT, '@type': 'Product', name}
  if (description) schema.description = description
  const img = imageUrl(image, {width: 1200})
  if (img) schema.image = [img]
  if (brand) schema.brand = {'@type': 'Brand', name: brand}
  if (offers?.price != null) {
    schema.offers = {
      '@type': 'Offer',
      price: String(offers.price),
      priceCurrency: offers.currency || 'USD',
      availability: offers.availability || 'https://schema.org/InStock',
      ...(offers.url ? {url: offers.url} : {}),
    }
  }
  if (rating?.value != null) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count || 1,
    }
  }
  return schema
}
