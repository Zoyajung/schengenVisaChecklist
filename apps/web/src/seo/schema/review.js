// =============================================================================
// Review schema — generates a schema.org/Review node with optional star rating.
// Used when a landing page reviews a product, service, or place. Set
// primarySchemaType to "review" in Sanity schemaConfig to activate.
// =============================================================================

const CONTEXT = 'https://schema.org'

/**
 * Review JSON-LD.
 * @param {{itemName:string, reviewBody?:string, author?:string,
 *   rating?:{value:number, best?:number}, url?:string}} opts
 */
export function generateReviewSchema({itemName, reviewBody, author, rating, url}) {
  if (!itemName) return null
  const schema = {
    '@context': CONTEXT,
    '@type': 'Review',
    itemReviewed: {'@type': 'Thing', name: itemName},
  }
  if (reviewBody) schema.reviewBody = reviewBody
  if (author) schema.author = {'@type': 'Person', name: author}
  if (rating?.value != null) {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: rating.value,
      bestRating: rating.best || 5,
    }
  }
  if (url) schema.url = url
  return schema
}
