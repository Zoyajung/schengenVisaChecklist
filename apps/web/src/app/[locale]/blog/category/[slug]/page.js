// =============================================================================
// Category archive — /[locale]/blog/category/[slug]
// Lists all published posts in the category. Metadata inherits from the
// category's `seoDefaults` in Sanity. FAQ from `faqDefaults` generates FAQPage
// JSON-LD if present.
// =============================================================================

import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/fetch'
import {
  CATEGORY_BY_SLUG_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {generateBreadcrumbSchema, generateFAQSchema} from '@/seo/schema'
import BlogCard from '@/components/blog/BlogCard'
import BlogEmptyState from '@/components/blog/BlogEmptyState'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import FAQSection from '@/components/shared/FAQSection'
import JsonLd from '@/components/shared/JsonLd'
import Container from '@/components/ui/Container'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

export async function generateStaticParams() {
  const slugs = (await sanityFetch({query: CATEGORY_SLUGS_QUERY, tags: ['category']})) || []
  return slugs.map((c) => ({slug: c.slug}))
}

async function loadCategory(slug, locale) {
  const [settings, category, posts] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: CATEGORY_BY_SLUG_QUERY, params: {slug}, tags: ['category']}),
    sanityFetch({query: POSTS_BY_CATEGORY_QUERY, params: {slug, locale}, tags: ['blogPost', 'category']}),
  ])
  return {settings: settings || {}, category, posts: posts || []}
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const {settings, category} = await loadCategory(slug, locale)
  if (!category) return {}
  return buildMetadata({
    settings,
    doc: {title: category.name, seo: category.seoDefaults, excerpt: category.description},
    path: `/blog/category/${slug}`,
    locale,
  })
}

export default async function CategoryPage({params}) {
  const {locale, slug} = await params
  const {category, posts} = await loadCategory(slug, locale)
  if (!category) notFound()
  const messages = getMessages(locale)

  const url = `${SITE_URL}${localizedPath(locale, `/blog/category/${slug}`)}`
  const crumbs = [
    {name: t(messages, 'breadcrumbs.home'), url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: t(messages, 'breadcrumbs.blog'), url: `${SITE_URL}${localizedPath(locale, '/blog')}`},
    {name: category.name, url},
  ]
  const faqs = category.faqDefaults || []
  const schemas = [generateBreadcrumbSchema(crumbs), faqs.length ? generateFAQSchema(faqs) : null].filter(Boolean)

  return (
    <main className="min-h-screen bg-white py-16">
      <Container>
        <Breadcrumbs
          items={[
            {name: t(messages, 'breadcrumbs.home'), href: localizedPath(locale, '/')},
            {name: t(messages, 'breadcrumbs.blog'), href: localizedPath(locale, '/blog')},
            {name: category.name},
          ]}
        />

        <div className="mb-12 max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">{t(messages, 'category.eyebrow')}</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">{category.name}</h1>
          {category.description ? <p className="mt-3 text-slate-500 text-lg">{category.description}</p> : null}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <BlogEmptyState locale={locale} />
          ) : (
            posts.map((post) => <BlogCard key={post._id} post={post} locale={locale} />)
          )}
        </div>
      </Container>

      {faqs.length ? <FAQSection faqs={faqs} locale={locale} className="bg-slate-50 mt-16" /> : null}

      <JsonLd data={schemas} />
    </main>
  )
}
