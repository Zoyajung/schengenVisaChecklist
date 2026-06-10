// =============================================================================
// Formatting utilities — date display, reading time, word count, slugify,
// and text truncation. Pure functions with no dependencies.
// =============================================================================

/** Human-readable date, e.g. "June 1, 2026". */
export function formatDate(iso, locale = 'en-US') {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(locale, {year: 'numeric', month: 'long', day: 'numeric'})
  } catch {
    return ''
  }
}

/** ISO date for <time dateTime>. */
export function isoDate(iso) {
  if (!iso) return undefined
  try {
    return new Date(iso).toISOString()
  } catch {
    return undefined
  }
}

/** Estimated reading time in minutes (≈200 wpm), min 1. */
export function readingTime(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Count words in a string. */
export function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length
}

/** URL-safe slug from arbitrary text. */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate with an ellipsis at a word-ish boundary. */
export function truncate(text, max = 160) {
  const s = String(text || '')
  if (s.length <= max) return s
  return `${s.slice(0, max - 1).trimEnd()}…`
}
