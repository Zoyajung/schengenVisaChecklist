// =============================================================================
// BlogAuthorCard — author byline used inline on blog posts and author pages.
//
// compact=true  → small inline byline (post header): avatar + linked name + role
// compact=false → full bio card (author profile page): photo, rich bio, socials
//
// The author's name is always a clickable link to their author page.
// bio is Portable Text (rich text) and is rendered with BlogPostBody.
// =============================================================================

import Image from 'next/image'
import Link from 'next/link'
import {imageUrl} from '@/sanity/lib/image'
import {localizedPath} from '@/i18n/routing'
import BlogPostBody from './BlogPostBody'

/**
 * @param {{
 *   author: import('@/sanity/types').Author,
 *   compact?: boolean,
 *   locale?: string
 * }} props
 */
export default function BlogAuthorCard({author, compact = false, locale = 'en'}) {
  if (!author) return null

  const avatarSize = compact ? 96 : 320
  const avatar = imageUrl(author.image, {width: avatarSize, height: avatarSize, fit: 'crop'})
  const authorHref = localizedPath(locale, `/author/${author.slug}`)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {avatar ? (
          <Link href={authorHref}>
            <Image
              src={avatar}
              alt={author.image?.alt || author.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </Link>
        ) : null}
        <div className="text-sm leading-tight">
          <Link href={authorHref} className="font-medium text-slate-900 hover:text-primary transition-colors">
            {author.name}
          </Link>
          {author.role ? <div className="text-slate-600 text-xs mt-0.5">{author.role}</div> : null}
        </div>
      </div>
    )
  }

  // Full card — used as the profile sidebar on the author page (vertical layout)
  const hasBio = Array.isArray(author.bio) && author.bio.length > 0

  return (
    <div>
      {avatar ? (
        <Image
          src={avatar}
          alt={author.image?.alt || author.name}
          width={160}
          height={160}
          className="rounded-2xl object-cover h-40 w-40 mb-5"
        />
      ) : null}
      <div className="min-w-0">
        <Link href={authorHref} className="font-bold text-slate-900 hover:text-primary transition-colors text-2xl">
          {author.name}
        </Link>
        {author.role ? <div className="text-sm text-slate-500 mt-1">{author.role}</div> : null}

        {/* Short description (plain text) */}
        {author.description ? (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{author.description}</p>
        ) : null}

        {/* Full bio (Portable Text) */}
        {hasBio ? (
          <div className="mt-3 text-sm [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-slate-600 [&_li]:mb-1">
            <BlogPostBody body={author.bio} locale={locale} />
          </div>
        ) : null}

        {/* Personal website link */}
        {author.link ? (
          <a
            href={author.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            {author.link.replace(/^https?:\/\//, '')}
          </a>
        ) : null}

        {/* Social links */}
        {author.socials?.length ? (
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {author.socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline capitalize"
              >
                {s.platform}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
