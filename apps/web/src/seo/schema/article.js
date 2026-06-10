import {imageUrl} from '@/sanity/lib/image'
import {generatePersonSchema} from './person'

const CONTEXT = 'https://schema.org'

const TYPE_MAP = {
  article: 'Article',
  blogPosting: 'BlogPosting',
  howTo: 'HowTo',
  product: 'Product',
  review: 'Review',
  webPage: 'WebPage',
}

/**
 * Article / BlogPosting JSON-LD with embedded author (Person) and publisher.
 * Description uses metaDescription from SEO, falling back to the post title.
 * @param {{post:any, url:string, settings?:any, type?:string, locale?:string}} opts
 */
export function generateArticleSchema({post, url, settings = {}, type = 'blogPosting', locale = 'en'}) {
  if (!post) return null
  const schemaType = TYPE_MAP[type] || 'Article'

  const schema = {
    '@context': CONTEXT,
    '@type': schemaType,
    headline: post.seo?.metaTitle || post.title,
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    url,
  }

  // Use SEO meta description (entered once, used everywhere)
  const description = post.seo?.metaDescription
  if (description) schema.description = description

  const img = imageUrl(post.featuredImage, {width: 1200})
  if (img) schema.image = [img]

  if (post.publishedAt) schema.datePublished = post.publishedAt
  schema.dateModified = post.updatedAt || post.publishedAt

  const author = generatePersonSchema(post.author, {locale})
  if (author) schema.author = author

  if (settings.name) {
    const publisher = {'@type': 'Organization', name: settings.name}
    const logo = imageUrl(settings.logo, {width: 512})
    if (logo) publisher.logo = {'@type': 'ImageObject', url: logo}
    schema.publisher = publisher
  }

  return schema
}
