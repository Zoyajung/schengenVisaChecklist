// =============================================================================
// Blog listing — /[locale]/blog
//
// Architecture:
//   - Server component fetches ALL posts + ALL categories at build time (ISR).
//   - BlogCategoryFilter (client component) reads ?category= from the URL and
//     filters the post grid instantly with zero server round-trips.
//
// SEO:
//   - Base /blog: Blog + BreadcrumbList JSON-LD.
//   - Filtered ?category=slug: canonical → /blog/category/[slug] (avoids
//     duplicate content with the dedicated category archive page).
//   - ItemList schema lists all visible posts for Google.
// =============================================================================

import {Suspense} from 'react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {POSTS_QUERY, ALL_CATEGORIES_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {generateBreadcrumbSchema, generateBlogListingSchema} from '@/seo/schema'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import JsonLd from '@/components/shared/JsonLd'
import Container from '@/components/ui/Container'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  return buildMetadata({
    settings,
    doc: {
      title: t(messages, 'blog.title'),
      seo: {metaDescription: t(messages, 'blog.description')},
    },
    path: '/blog',
    locale,
  })
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)

  // Fetch all posts + categories in parallel (both statically cached via ISR).
  const [posts, categories] = await Promise.all([
    sanityFetch({query: POSTS_QUERY, params: {locale}, tags: ['blogPost', 'author', 'category']}),
    sanityFetch({query: ALL_CATEGORIES_QUERY, tags: ['category']}),
  ])

  const safePostsList = posts || []
  const safeCategories = categories || []

  // Breadcrumb items for JSON-LD.
  const crumbs = [
    {name: t(messages, 'breadcrumbs.home'), url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: t(messages, 'breadcrumbs.blog'), url: `${SITE_URL}${localizedPath(locale, '/blog')}`},
  ]

  // Blog listing JSON-LD — helps Google understand the page as a Blog entity.
  const blogSchema = generateBlogListingSchema({
    posts: safePostsList,
    url: `${SITE_URL}${localizedPath(locale, '/blog')}`,
    name: t(messages, 'blog.title'),
    description: t(messages, 'blog.description'),
    locale,
  })

  return (
    <main className="min-h-screen bg-white py-16">
      <Container>
        <Breadcrumbs
          items={[
            {name: t(messages, 'breadcrumbs.home'), href: localizedPath(locale, '/')},
            {name: t(messages, 'breadcrumbs.blog')},
          ]}
        />

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{t(messages, 'blog.title')}</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            {t(messages, 'blog.description')}
          </p>
        </div>

        {/*
          BlogCategoryFilter is a client component that:
          1. Renders category chip buttons
          2. Reads ?category= from the URL via useSearchParams()
          3. Filters the posts array client-side (no server round-trip)

          Wrapped in <Suspense> because useSearchParams() requires it in
          the App Router when inside a server-rendered page.
        */}
        <Suspense fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-xl" />
            ))}
          </div>
        }>
          <BlogCategoryFilter
            posts={safePostsList}
            categories={safeCategories}
            locale={locale}
          />
        </Suspense>
      </Container>

      <JsonLd data={[generateBreadcrumbSchema(crumbs), blogSchema]} />
    </main>
  )
}
