import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * HowTo JSON-LD.
 * @param {{name:string, description?:string, image?:any, steps?:{name:string,text:string}[], url?:string}} opts
 */
export function generateHowToSchema({name, description, image, steps = [], url}) {
  if (!name) return null
  const schema = {
    '@context': CONTEXT,
    '@type': 'HowTo',
    name,
  }
  if (description) schema.description = description
  const img = imageUrl(image, {width: 1200})
  if (img) schema.image = [img]
  if (url) schema.url = url
  if (steps.length) {
    schema.step = steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    }))
  }
  return schema
}
