// Locale message registry. Add a new locale folder and import it here when the
// locale is enabled in `src/i18n/config.js`.

import {DEFAULT_LOCALE} from '@/i18n/config'
import enCommon from './en/common.json'
import enHome from './en/home.json'
import enBlog from './en/blog.json'
import enFaq from './en/faq.json'
import enCategory from './en/category.json'
import enAuthor from './en/author.json'
import enNotFound from './en/not-found.json'
import enChecklist from './en/checklist.json'

const MESSAGES = {
  en: {
    ...enCommon,
    ...enHome,
    ...enBlog,
    ...enFaq,
    ...enCategory,
    ...enAuthor,
    ...enNotFound,
    ...enChecklist,
  },
}

/**
 * Return the static message bundle for a locale, falling back to English.
 * Safe to import from server and client components because bundles are static.
 *
 * @param {string} locale
 */
export function getMessages(locale = DEFAULT_LOCALE) {
  return MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE]
}

/**
 * Resolve a dot-separated message key and replace {tokens}.
 *
 * @param {Record<string, any>} messages
 * @param {string} key
 * @param {Record<string, string | number>} [values]
 */
export function t(messages, key, values = {}) {
  const text = key.split('.').reduce((value, part) => value?.[part], messages)
  if (typeof text !== 'string') return key
  return text.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? `{${token}}`))
}
