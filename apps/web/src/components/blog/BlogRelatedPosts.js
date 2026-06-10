// =============================================================================
// BlogRelatedPosts — "Read next" grid shown at the bottom of blog posts.
// Uses explicit `relatedPosts` picks from Sanity, falling back to the latest
// posts in the same category (resolved in the blog post page route).
// =============================================================================

import BlogCard from './BlogCard'
import {getMessages, t} from '@/messages'

export default function BlogRelatedPosts({posts = [], locale = 'en'}) {
  if (!posts?.length) return null
  const messages = getMessages(locale)
  return (
    <section className="mt-16 border-t border-slate-200 pt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t(messages, 'blog.relatedPosts')}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} locale={locale} />
        ))}
      </div>
    </section>
  )
}
