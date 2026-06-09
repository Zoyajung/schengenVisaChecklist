// =============================================================================
// BlogCard - post card for listing grids (blog listing + category archive).
// Shows cover image, category tag, date, title, excerpt, and a localized
// read-more link. All data comes from the `postCard` GROQ projection.
// =============================================================================

import Image from 'next/image'
import Link from 'next/link'
import {ImageIcon, ChevronRight} from 'lucide-react'
import {imageUrl} from '@/sanity/lib/image'
import {localizedPath} from '@/i18n/routing'
import {formatDate, isoDate} from '@/utils/format'
import {getMessages, t} from '@/messages'

/**
 * Blog listing card. Builds its own locale-prefixed href.
 * @param {{post:any, locale?:string, priority?:boolean}} props
 */
export default function BlogCard({post, locale = 'en', priority = false}) {
  if (!post?.slug) return null

  const messages = getMessages(locale)
  const href = localizedPath(locale, `/blog/${post.slug}`)
  const cover = imageUrl(post.featuredImage, {width: 600, height: 360, fit: 'crop'})

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link
        href={href}
        className="block relative h-44 bg-slate-100 shrink-0"
        aria-label={t(messages, 'blog.readPost', {title: post.title})}
      >
        {cover ? (
          <Image
            src={cover}
            alt={post.featuredImage?.alt || post.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-slate-300" />
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs mb-2">
          {post.category?.name ? (
            <span className="text-primary font-semibold uppercase tracking-wide">{post.category.name}</span>
          ) : null}
          {post.publishedAt ? (
            <time className="text-slate-600" dateTime={isoDate(post.publishedAt)}>
              {formatDate(post.publishedAt)}
            </time>
          ) : null}
        </div>

        <h3 className="font-semibold text-slate-900 text-lg leading-snug line-clamp-2">
          <Link href={href} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? <p className="mt-2 text-sm text-slate-500 line-clamp-3 flex-1">{post.excerpt}</p> : null}

        <Link href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {t(messages, 'blog.readMore')}
          <span className="sr-only"> - {post.title}</span>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  )
}
