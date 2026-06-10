import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * VideoObject JSON-LD from a youtube / videoSection block.
 * @param {any} v
 * @param {{withContext?:boolean}} [opts]
 */
export function generateVideoSchema(v, {withContext = true} = {}) {
  if (!v || !v.url) return null
  const schema = {
    ...(withContext ? {'@context': CONTEXT} : {}),
    '@type': 'VideoObject',
    name: v.title || 'Video',
    contentUrl: v.url,
    embedUrl: v.url,
  }
  if (v.description) schema.description = v.description
  const thumb = imageUrl(v.poster, {width: 1280})
  if (thumb) schema.thumbnailUrl = [thumb]
  schema.uploadDate = v.uploadDate || undefined
  return schema
}

/** Scan a Portable Text body for video blocks and emit VideoObject nodes. */
export function videoSchemasFromBody(body) {
  if (!Array.isArray(body)) return []
  return body
    .filter((b) => b && (b._type === 'youtube' || b._type === 'videoSection'))
    .map((b) => generateVideoSchema(b))
    .filter(Boolean)
}
