// =============================================================================
// Blog schema generator — builds a schema.org/Blog node for the blog listing
// page, with each visible post listed as a BlogPosting in blogPost[].
// Used only on /blog (and filtered /blog?category=...) — individual post pages
// use generateArticleSchema instead.
// =============================================================================

import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'

const CONTEXT = 'https://schema.org'

/**
 * Generate a Blog + ItemList JSON-LD node for the blog listing page.
 *
 * @param {{
 *   posts: {_id:string, title:string, slug:string, publishedAt?:string, excerpt?:string}[],
 *   url: string,
 *   name?: string,
 *   description?: string,
 *   locale?: string
 * }} opts
 */
export function generateBlogListingSchema({posts = [], url, name = 'Blog', description, locale = 'en'}) {
  return {
    '@context': CONTEXT,
    '@type': 'Blog',
    name,
    ...(description ? {description} : {}),
    url,
    // List each post as a BlogPosting — helps Google understand page structure
    blogPost: posts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}${localizedPath(locale, `/blog/${post.slug}`)}`,
      ...(post.publishedAt ? {datePublished: post.publishedAt} : {}),
      ...(post.excerpt ? {description: post.excerpt} : {}),
    })),
  }
}
