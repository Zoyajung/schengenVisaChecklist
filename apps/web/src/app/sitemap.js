// =============================================================================
// Dynamic XML sitemap — generated from Sanity content across every locale.
// Revalidated automatically via the /api/revalidate webhook on publish.
//
// Landing pages are built in code, so add their routes manually in the
// "Core routes" section below. Blog content comes from Sanity.
// =============================================================================

import {sanityFetch} from '@/sanity/lib/fetch'
import {POST_SLUGS_QUERY, CATEGORY_SLUGS_QUERY, AUTHOR_SLUGS_QUERY} from '@/sanity/queries'
import {SITE_URL} from '@/constants/site'
import {LOCALES} from '@/i18n/config'
import {localizedPath} from '@/i18n/routing'

export default async function sitemap() {
  const [posts, categories, authors] = await Promise.all([
    sanityFetch({query: POST_SLUGS_QUERY, tags: ['blogPost']}),
    sanityFetch({query: CATEGORY_SLUGS_QUERY, tags: ['category']}),
    sanityFetch({query: AUTHOR_SLUGS_QUERY, tags: ['author']}),
  ])

  const entries = []
  const now = new Date()

  /** Add a route for every locale. */
  const add = (path) => {
    for (const locale of LOCALES) {
      entries.push({url: `${SITE_URL}${localizedPath(locale, path)}`, lastModified: now})
    }
  }

  // ── Core routes (always present) ──────────────────────────────────────────
  add('/')
  add('/blog')
  add('/faq')
  // add('/about')
  // add('/contact')

  // ── Dynamic Sanity content ────────────────────────────────────────────────
  for (const p of posts || []) {
    entries.push({
      url: `${SITE_URL}${localizedPath(p.locale, `/blog/${p.slug}`)}`,
      lastModified: now,
    })
  }
  for (const c of categories || []) add(`/blog/category/${c.slug}`)
  for (const a of authors || []) add(`/author/${a.slug}`)

  return entries
}
