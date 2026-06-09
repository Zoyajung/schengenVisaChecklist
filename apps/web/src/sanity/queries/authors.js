// =============================================================================
// Author queries — single author, author's posts, all slugs for static params.
// =============================================================================

import {authorFields, imageFields, liveFilter} from './fragments'

const defaultLocale = 'en'
const localeFilter = `coalesce(language, "${defaultLocale}") == $locale`

/** Full author document by slug. */
export const AUTHOR_BY_SLUG_QUERY = `*[_type == "author" && slug.current == $slug][0] ${authorFields}`

/** All author slugs for generateStaticParams. */
export const AUTHOR_SLUGS_QUERY = `*[_type == "author" && defined(slug.current)]{"slug": slug.current}`

/** Blog posts written by a given author (for the author profile page). */
export const POSTS_BY_AUTHOR_QUERY = `
  *[
    _type == "blogPost" &&
    author._ref in *[_type == "author" && slug.current == $slug]._id &&
    ${localeFilter} &&
    ${liveFilter}
  ]
  | order(publishedAt desc) {
    _id, _type, title, "slug": slug.current,
    "language": coalesce(language, "${defaultLocale}"), translationGroup,
    publishedAt, featured,
    "featuredImage": featuredImage${imageFields},
    "category": category->{_id, name, "slug": slug.current}
  }
`
