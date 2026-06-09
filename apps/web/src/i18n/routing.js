// ============================================================================
// i18n routing helpers
// ----------------------------------------------------------------------------
// Anything that builds a URL inside the app should go through localizedPath()
// so links never bypass the locale segment. That keeps URLs canonical (no
// extra middleware redirects on click) and makes future locale-switcher UIs
// trivial — just call replaceLocale() with the new code.
// ============================================================================

import { DEFAULT_LOCALE } from './config'

/**
 * Build a locale-prefixed href.
 *
 *   localizedPath('en', '/blog')        => '/en/blog'
 *   localizedPath('en', '/')            => '/en'
 *   localizedPath('en', '/#section1')   => '/en#section1'
 *   localizedPath('en', 'blog')         => '/en/blog'      (leading slash optional)
 *
 * Query strings and hashes on `path` are preserved.
 *
 * @param {string} locale
 * @param {string} path
 */
export function localizedPath(locale = DEFAULT_LOCALE, path = '/') {
  if (!path.startsWith('/')) path = `/${path}`

  // Root '/' becomes just '/<locale>' (no trailing slash).
  if (path === '/') return `/${locale}`

  // Hash-only fragments like '/#section1' attach directly to the locale root.
  if (path.startsWith('/#') || path.startsWith('/?')) return `/${locale}${path.slice(1)}`

  return `/${locale}${path}`
}

/**
 * Swap the locale prefix on an existing pathname.
 *
 *   replaceLocale('/en/blog', 'fr')      => '/fr/blog'
 *   replaceLocale('/en',      'fr')      => '/fr'
 *
 * Used by locale-switcher UIs once additional locales are enabled.
 *
 * @param {string} pathname
 * @param {string} nextLocale
 */
export function replaceLocale(pathname, nextLocale) {
  const parts = pathname.split('/')
  // parts === ['', 'en', 'blog'] for '/en/blog'
  if (parts.length < 2) return `/${nextLocale}`
  parts[1] = nextLocale
  return parts.join('/') || `/${nextLocale}`
}
