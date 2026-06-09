// Author profile route.
// Loads the author document, their published posts, and the matching schema
// nodes so the page can render both the visible profile and the SEO payload.

import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/fetch'
import {AUTHOR_BY_SLUG_QUERY, POSTS_BY_AUTHOR_QUERY, AUTHOR_SLUGS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {generateBreadcrumbSchema, generatePersonSchema} from '@/seo/schema'
import BlogCard from '@/components/blog/BlogCard'
import BlogAuthorCard from '@/components/blog/BlogAuthorCard'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import JsonLd from '@/components/shared/JsonLd'
import Container from '@/components/ui/Container'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

export async function generateStaticParams() {
  const slugs = (await sanityFetch({query: AUTHOR_SLUGS_QUERY, tags: ['author']})) || []
  return slugs.map((a) => ({slug: a.slug}))
}

async function loadAuthor(slug, locale) {
  const [settings, author, posts] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: AUTHOR_BY_SLUG_QUERY, params: {slug}, tags: ['author']}),
    sanityFetch({query: POSTS_BY_AUTHOR_QUERY, params: {slug, locale}, tags: ['blogPost', 'author']}),
  ])
  return {settings: settings || {}, author, posts: posts || []}
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const messages = getMessages(locale)
  const {settings, author} = await loadAuthor(slug, locale)
  if (!author) return {}
  return buildMetadata({
    settings,
    doc: {title: author.name, seo: {metaDescription: author.description || t(messages, 'author.articlesBy', {name: author.name})}},
    path: `/author/${slug}`,
    locale,
  })
}

export default async function AuthorPage({params}) {
  const {locale, slug} = await params
  const {author, posts} = await loadAuthor(slug, locale)
  if (!author) notFound()
  const messages = getMessages(locale)

  const url = `${SITE_URL}${localizedPath(locale, `/author/${slug}`)}`
  const crumbs = [
    {name: t(messages, 'breadcrumbs.home'), url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: author.name, url},
  ]
  const schemas = [
    generatePersonSchema(author, {locale, withContext: true}),
    generateBreadcrumbSchema(crumbs),
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-white py-16">
      <Container>
        <Breadcrumbs items={[{name: t(messages, 'breadcrumbs.home'), href: localizedPath(locale, '/')}, {name: author.name}]} />

        <div className="mt-8 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          {/* Profile sidebar */}
          <aside className="mb-12 lg:mb-0">
            <BlogAuthorCard author={author} locale={locale} />
          </aside>

          {/* Recent posts fill the main column */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {posts.length ? t(messages, 'author.articlesBy', {name: author.name}) : null}
            </h2>
            {posts.length ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post._id} post={post} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400">{t(messages, 'author.noPosts')}</p>
            )}
          </div>
        </div>
      </Container>

      <JsonLd data={schemas} />
    </main>
  )
}
