// =============================================================================
// Blog post — /[locale]/blog/[slug]
// Full article page: quick answer, key takeaways, ToC, body, FAQ, author card,
// and related posts. Old slugs automatically 301-redirect to the current slug.
// Metadata and JSON-LD schema inherit: Site Settings → Category → Post.
// =============================================================================

import {notFound, permanentRedirect, redirect} from 'next/navigation'
import ReactDOM from 'react-dom'
import {sanityFetch} from '@/sanity/lib/fetch'
import {
  POST_BY_SLUG_QUERY,
  POST_BY_OLD_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POST_TRANSLATIONS_QUERY,
  RELATED_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {buildBlogPostAlternates} from '@/seo/hreflang'
import {resolveAiSeo, resolveFaq} from '@/seo/resolve'
import {buildPostSchemas} from '@/seo/schema'
import {imageUrl} from '@/sanity/lib/image'
import {extractHeadings} from '@/utils/portable-text'
import {formatDate, isoDate} from '@/utils/format'
import {localizedPath} from '@/i18n/routing'
import {SITE_URL} from '@/constants/site'
import {getMessages, t} from '@/messages'

import BlogPostBody from '@/components/blog/BlogPostBody'
import BlogTableOfContents from '@/components/blog/BlogTableOfContents'
import BlogQuickAnswer from '@/components/blog/BlogQuickAnswer'
import BlogKeyTakeaways from '@/components/blog/BlogKeyTakeaways'
import BlogRelatedPosts from '@/components/blog/BlogRelatedPosts'
import BlogAuthorCard from '@/components/blog/BlogAuthorCard'
import FAQSection from '@/components/shared/FAQSection'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import JsonLd from '@/components/shared/JsonLd'

export async function generateStaticParams() {
  const slugs = (await sanityFetch({query: POST_SLUGS_QUERY, tags: ['blogPost']})) || []
  return slugs.map((p) => ({locale: p.locale, slug: p.slug}))
}

async function loadPost(slug, locale) {
  const [settings, post] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: POST_BY_SLUG_QUERY, params: {slug, locale}, tags: ['blogPost', 'author', 'category']}),
  ])
  return {settings: settings || {}, post}
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const {settings, post} = await loadPost(slug, locale)
  if (!post) return {}
  const translations = post.translationGroup
    ? (await sanityFetch({
        query: POST_TRANSLATIONS_QUERY,
        params: {translationGroup: post.translationGroup},
        tags: ['blogPost'],
      })) || []
    : [{locale, slug}]

  return buildMetadata({
    settings,
    category: post.category,
    doc: post,
    languageAlternates: buildBlogPostAlternates(translations),
    path: `/blog/${slug}`,
    locale,
    type: 'article',
  })
}

export default async function BlogPostPage({params}) {
  const {locale, slug} = await params
  const {settings, post} = await loadPost(slug, locale)
  const messages = getMessages(locale)

  if (!post) {
    const moved = await sanityFetch({query: POST_BY_OLD_SLUG_QUERY, params: {slug, locale}, tags: ['blogPost']})
    if (moved?.slug) {
      const destination = localizedPath(locale, `/blog/${moved.slug}`)
      if (moved.permanent !== false) permanentRedirect(destination)
      redirect(destination)
    }
    notFound()
  }

  const aiSeo = resolveAiSeo({doc: post})
  const faqs = resolveFaq({doc: post})
  const headings = post.tocEnabled === false ? [] : extractHeadings(post.body, [2, 3])

  let related = post.relatedPosts || []
  if (!related.length && post.category?._id) {
    related =
      (await sanityFetch({
        query: RELATED_POSTS_QUERY,
        params: {id: post._id, categoryId: post.category._id, locale},
        tags: ['blogPost', 'author', 'category'],
      })) || []
  }

  const url = `${SITE_URL}${localizedPath(locale, `/blog/${slug}`)}`
  const breadcrumbs = [
    {name: t(messages, 'breadcrumbs.home'), url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: t(messages, 'breadcrumbs.blog'), url: `${SITE_URL}${localizedPath(locale, '/blog')}`},
    ...(post.category
      ? [{name: post.category.name, url: `${SITE_URL}${localizedPath(locale, `/blog/category/${post.category.slug}`)}`}]
      : []),
    {name: post.title, url},
  ]
  const schemas = buildPostSchemas({post, url, settings, faqs, breadcrumbs, locale})

  const cover = imageUrl(post.featuredImage, {width: 960, height: 540, quality: 70, fit: 'crop'})
  const coverSrcSet = [640, 760, 960, 1200]
    .map((width) => {
      const src = imageUrl(post.featuredImage, {
        width,
        height: Math.round(width * 9 / 16),
        quality: 70,
        fit: 'crop',
      })
      return src ? `${src} ${width}w` : null
    })
    .filter(Boolean)
    .join(', ')
  const coverSizes = '(max-width: 1024px) calc(100vw - 2rem), 760px'
  if (cover && coverSrcSet) {
    ReactDOM.preload(cover, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: coverSrcSet,
      imageSizes: coverSizes,
    })
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
        <article className="min-w-0">
          <Breadcrumbs
            items={[
              {name: t(messages, 'breadcrumbs.home'), href: localizedPath(locale, '/')},
              {name: t(messages, 'breadcrumbs.blog'), href: localizedPath(locale, '/blog')},
              ...(post.category
                ? [{name: post.category.name, href: localizedPath(locale, `/blog/category/${post.category.slug}`)}]
                : []),
              {name: post.title},
            ]}
          />

          {post.category ? (
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">{post.category.name}</span>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-3">{post.title}</h1>

          <div className="flex items-center gap-3 mb-8">
            {post.author ? <BlogAuthorCard author={post.author} compact locale={locale} /> : null}
            {post.publishedAt ? (
              <time className="text-slate-600 text-sm" dateTime={isoDate(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            ) : null}
          </div>

          {cover ? (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                srcSet={coverSrcSet}
                sizes={coverSizes}
                alt={post.featuredImage?.alt || post.title}
                width="960"
                height="540"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {aiSeo.quickAnswer ? <BlogQuickAnswer text={aiSeo.quickAnswer} /> : null}
          {aiSeo.keyTakeaways?.length ? <BlogKeyTakeaways items={aiSeo.keyTakeaways} locale={locale} /> : null}

          <BlogPostBody body={post.body} locale={locale} />

          {faqs.length ? <FAQSection heading={t(messages, 'faq.title')} faqs={faqs} locale={locale} className="!py-10" /> : null}

          <BlogRelatedPosts posts={related} locale={locale} />
        </article>

        {headings.length ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BlogTableOfContents headings={headings} locale={locale} />
            </div>
          </aside>
        ) : null}
      </div>

      <JsonLd data={schemas} />
    </main>
  )
}
