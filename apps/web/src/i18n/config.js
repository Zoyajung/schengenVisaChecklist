// ============================================================================
// i18n configuration - single source of truth.
// ----------------------------------------------------------------------------
// To enable a new locale later:
//   1. Add its code to LOCALES below, for example 'fr'.
//   2. Add a human-readable label to LOCALE_LABELS.
//   3. Create matching files under messages/<locale>/.
//   4. Import the new message file in src/messages/index.js.
//   5. If it reads right-to-left, add it to RTL_LOCALES.
//
// Only 'en' is active during the MVP. The other labels are references only
// until their locale code is added to LOCALES.
// ============================================================================

/**
 * @typedef {(typeof LOCALES)[number]} Locale
 * Compile-time union of every active locale code. Editor IntelliSense and
 * `tsc --checkJs` narrow this automatically when LOCALES grows.
 */

/** Active locales the site currently serves. */
export const LOCALES = /** @type {const} */ (['en'])

/** Fallback used when no locale can be detected or an invalid one is requested. */
export const DEFAULT_LOCALE = 'en'

/** Display names used by future locale switcher UIs. */
export const LOCALE_LABELS = {
  en: 'English',
  fr: 'Francais',
  de: 'Deutsch',
  ar: 'Arabic',
}

/** Locales that render right-to-left. Drives the <html dir> attribute. */
export const RTL_LOCALES = ['ar']
