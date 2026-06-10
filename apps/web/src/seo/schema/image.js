// =============================================================================
// ImageObject schema — wraps a Sanity image asset in schema.org/ImageObject.
// Used as a nested object inside BlogPosting, Product, HowTo, etc.
// Call with `withContext: false` when embedding inside another schema node.
// =============================================================================

import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * ImageObject JSON-LD for a featured/cover image.
 * @param {any} image
 * @param {{withContext?:boolean}} [opts]
 */
export function generateImageSchema(image, {withContext = true} = {}) {
  const url = imageUrl(image, {width: 1200})
  if (!url) return null
  const schema = {
    ...(withContext ? {'@context': CONTEXT} : {}),
    '@type': 'ImageObject',
    url,
    contentUrl: url,
  }
  if (image?.caption) schema.caption = image.caption
  if (image?.credit) schema.creditText = image.credit
  if (image?.dimensions) {
    schema.width = image.dimensions.width
    schema.height = image.dimensions.height
  }
  return schema
}
