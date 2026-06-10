// =============================================================================
// Category queries — listing, single category with inherited defaults, and
// posts filtered by category. The categoryFields projection includes seoDefaults,
// aiSeoDefaults, schemaDefaults, and faqDefaults for the inheritance chain.
// =============================================================================

import {imageFields, categoryFields, liveFilter} from './fragments'

const defaultLocale = 'en'
const localeFilter = `coalesce(language, "${defaultLocale}") == $locale`

const postCard = `{
  _id, _type, title, "slug": slug.current, excerpt,
  "language": coalesce(language, "${defaultLocale}"), translationGroup,
  publishedAt,
  "featuredImage": featuredImage${imageFields},
  "category": category->{_id, name, "slug": slug.current},
  "author": author->{_id, name, "slug": slug.current}
}`

export const ALL_CATEGORIES_QUERY = `*[_type == "category"] | order(name asc){
  _id, name, "slug": slug.current, description, "image": image${imageFields}
}`

export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] ${categoryFields}`

export const POSTS_BY_CATEGORY_QUERY = `*[
  _type == "blogPost" &&
  category._ref in *[_type == "category" && slug.current == $slug]._id &&
  ${localeFilter} &&
  ${liveFilter}
]
  | order(publishedAt desc) ${postCard}`

export const CATEGORY_SLUGS_QUERY = `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`
