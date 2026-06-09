// ============================================================================
// Site-level constants. These are *fallbacks* — anything an editor can set
// lives in Sanity Site Settings and overrides these at runtime.
// ============================================================================

/** Absolute production URL, no trailing slash. Used for canonicals & schema. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

/** Fallback brand name when Site Settings has none. */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SchengenVisaChecklist.com'

/** Default OG image path (relative to SITE_URL) when nothing is configured. */
export const DEFAULT_OG_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE || ''
