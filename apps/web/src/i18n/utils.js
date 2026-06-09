// ============================================================================
// i18n utilities — pure functions only
// ----------------------------------------------------------------------------
// Stateless helpers used by middleware, layouts, and components. Keeping them
// pure means they're safe to call from any runtime (Edge middleware, server
// components, client components) and trivially testable.
// ============================================================================

import { LOCALES, DEFAULT_LOCALE, RTL_LOCALES } from './config'

/**
 * Type guard: does the given value match a currently-active locale?
 * @param {unknown} value
 * @returns {value is import('./config').Locale}
 */
export function isValidLocale(value) {
  return typeof value === 'string' && LOCALES.includes(/** @type {any} */ (value))
}

/**
 * Extract the locale segment from a pathname. Returns null if missing/invalid.
 *
 *   getLocaleFromPathname('/en/blog/foo') => 'en'
 *   getLocaleFromPathname('/blog/foo')    => null
 *
 * @param {string} pathname
 */
export function getLocaleFromPathname(pathname) {
  const segment = pathname.split('/')[1]
  return isValidLocale(segment) ? segment : null
}

/** Does this locale render right-to-left? */
export function isRtlLocale(locale) {
  return RTL_LOCALES.includes(locale)
}

/**
 * Coerce any value into a usable locale, falling back to DEFAULT_LOCALE.
 * Useful at boundaries (route params, query strings, cookies) where the
 * incoming value isn't yet trusted.
 */
export function resolveLocale(value) {
  return isValidLocale(value) ? value : DEFAULT_LOCALE
}
