// =============================================================================
// buildMetadata — creates the Next.js Metadata object for every page.
// Runs the full inheritance chain: Site Settings → Category → Document.
// Handles title templates, canonical URLs (locale-aware), Open Graph,
// Twitter cards, hreflang alternates, and robots directives.
// Import and call from every page's generateMetadata() function.
// =============================================================================

import {resolveSeo} from './resolve'
import {buildRobots} from './robots'
import {buildLanguageAlternates} from './hreflang'
import {SITE_URL, SITE_NAME} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {imageUrl} from '@/sanity/lib/image'

/**
 * Build a Next.js Metadata object from CMS data with full inheritance.
 * Used by every generateMetadata() — there is no hardcoded metadata in pages.
 *
 * @param {{
 *   settings?:any, category?:any, doc?:any, languageAlternates?:Record<string,string>,
 *   path?:string, locale?:string, type?:'website'|'article'
 * }} opts
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
  settings = {},
  category = {},
  doc = {},
  languageAlternates,
  path = '/',
  locale = 'en',
  type = 'website',
} = {}) {
  const seo = resolveSeo({settings, category, doc})
  const siteName = settings.name || SITE_NAME
  const template = settings.titleTemplate || '%s'

  const baseTitle = doc.title || siteName
  const title = seo.metaTitle
    ? seo.metaTitle
    : template.includes('%s')
      ? template.replace('%s', baseTitle)
      : baseTitle

  const description = seo.metaDescription || ''
  const canonicalPath = localizedPath(locale, path)
  const canonical = seo.canonicalUrl || `${SITE_URL}${canonicalPath}`

  const ogImg = imageUrl(seo.ogImage, {width: 1200, height: 630, fit: 'crop'})
  const twImg = imageUrl(seo.twitterImage, {width: 1200, height: 630, fit: 'crop'}) || ogImg

  /** @type {import('next').Metadata} */
  const metadata = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {canonical, languages: languageAlternates || buildLanguageAlternates(path)},
    robots: buildRobots(seo.robots),
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName,
      images: ogImg ? [{url: ogImg, width: 1200, height: 630}] : undefined,
      ...(type === 'article'
        ? {
            publishedTime: doc.publishedAt,
            modifiedTime: doc.updatedAt || doc.publishedAt,
            authors: doc.author?.name ? [doc.author.name] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      images: twImg ? [twImg] : undefined,
      site: seo.twitterHandle || undefined,
    },
  }

  if (doc.author?.name) metadata.authors = [{name: doc.author.name}]
  return metadata
}
