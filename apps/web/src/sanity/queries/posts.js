// =============================================================================
// Blog post queries — listings, single post, slug history.
// postCard: lightweight projection used in listing grids.
// postFull: complete projection for the single-post page (author, body, SEO…).
// =============================================================================

import {
  imageFields,
  seoFields,
  aiSeoFields,
  authorFields,
  categoryFields,
  bodyFields,
  liveFilter,
} from './fragments'

const defaultLocale = 'en'
const localeFilter = `coalesce(language, "${defaultLocale}") == $locale`

/** Card-sized projection for listings. */
export const postCard = `{
  _id, _type, title, "slug": slug.current,
  "language": coalesce(language, "${defaultLocale}"), translationGroup,
  publishedAt, featured,
  "featuredImage": featuredImage${imageFields},
  "category": category->{_id, name, "slug": slug.current},
  "author": author->{_id, name, "slug": slug.current, role, "image": image${imageFields}}
}`

/** Full projection for a single post page. */
const postFull = `{
  _id, _type, title, "slug": slug.current, tags, tocEnabled,
  "language": coalesce(language, "${defaultLocale}"), translationGroup, sourceLanguage,
  publishedAt, "updatedAt": coalesce(updatedAt, _updatedAt), oldSlugs,
  "featuredImage": featuredImage${imageFields},
  "author": author->${authorFields},
  "category": category->${categoryFields},
  ${bodyFields},
  faq,
  "seo": seo${seoFields},
  "aiSeo": aiSeo${aiSeoFields}
}`

export const POSTS_QUERY = `*[_type == "blogPost" && ${localeFilter} && ${liveFilter}]
  | order(featured desc, publishedAt desc) ${postCard}`

export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug && ${localeFilter} && ${liveFilter}][0] ${postFull}`

/** Find the current slug for a post that previously lived at $slug. */
export const POST_BY_OLD_SLUG_QUERY = `*[
  _type == "blogPost" &&
  $slug in oldSlugs &&
  ${localeFilter} &&
  redirectSettings.enabled != false
][0]{
  "slug": slug.current,
  "permanent": coalesce(redirectSettings.permanent, true)
}`

export const POST_SLUGS_QUERY = `*[_type == "blogPost" && ${liveFilter}]{
  "slug": slug.current,
  "locale": coalesce(language, "${defaultLocale}")
}`

export const FEATURED_POSTS_QUERY = `*[_type == "blogPost" && featured == true && ${localeFilter} && ${liveFilter}]
  | order(priority desc, publishedAt desc) ${postCard}`

/** Related posts: latest from the same category, excluding current post. */
export const RELATED_POSTS_QUERY = `*[
  _type == "blogPost" &&
  _id != $id &&
  category._ref == $categoryId &&
  ${localeFilter} &&
  ${liveFilter}
]
  | order(publishedAt desc) [0...3] ${postCard}`

/** Sibling language versions for hreflang and future language switchers. */
export const POST_TRANSLATIONS_QUERY = `*[
  _type == "blogPost" &&
  defined($translationGroup) &&
  translationGroup == $translationGroup &&
  ${liveFilter}
]{
  _id,
  title,
  "slug": slug.current,
  "locale": coalesce(language, "${defaultLocale}")
}`
