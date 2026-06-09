'use client'
// =============================================================================
// BlogCategoryFilter — client component that renders category chip filters on the
// blog listing page. Reads ?category= from the URL and filters the post grid
// client-side (no server round-trip). The parent server component fetches all
// posts + categories at build time so the page stays statically cached.
//
// URL shape: /en/blog             → all posts (no param)
//            /en/blog?category=web-development → filtered
// =============================================================================

import {useSearchParams, useRouter, usePathname} from 'next/navigation'
import BlogCard from './BlogCard'
import BlogEmptyState from './BlogEmptyState'
import {getMessages, t} from '@/messages'

/**
 * @param {{
 *   posts: import('@/sanity/types').Post[],
 *   categories: {_id:string, name:string, slug:string}[],
 *   locale: string
 * }} props
 */
export default function BlogCategoryFilter({posts = [], categories = [], locale}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const messages = getMessages(locale)

  const activeSlug = searchParams.get('category') || null

  /** Filter posts to the active category, or show all. */
  const visible = activeSlug
    ? posts.filter((p) => p.category?.slug === activeSlug)
    : posts

  /** Navigate to ?category=slug or clear the param. */
  function select(slug) {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`, {scroll: false})
  }

  const chipBase =
    'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer whitespace-nowrap'
  const chipActive = 'bg-primary text-white border-primary'
  const chipIdle = 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'

  return (
    <>
      {/* Category chip filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => select(null)}
            className={`${chipBase} ${!activeSlug ? chipActive : chipIdle}`}
            aria-pressed={!activeSlug}
          >
            {t(messages, 'blog.allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => select(cat.slug)}
              className={`${chipBase} ${activeSlug === cat.slug ? chipActive : chipIdle}`}
              aria-pressed={activeSlug === cat.slug}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Post grid — first 3 cards get priority loading (above-the-fold LCP) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.length === 0 ? (
          <BlogEmptyState locale={locale} />
        ) : (
          visible.map((post, i) => (
            <BlogCard key={post._id} post={post} locale={locale} priority={i < 3} />
          ))
        )}
      </div>

      {/* Post count hint when filtered */}
      {activeSlug && visible.length > 0 && (
        <p className="text-center text-sm text-slate-400 mt-8">
          {t(messages, visible.length === 1 ? 'blog.postCountOne' : 'blog.postCountOther', {
            count: visible.length,
            category: categories.find((c) => c.slug === activeSlug)?.name || '',
          })}
        </p>
      )}
    </>
  )
}
