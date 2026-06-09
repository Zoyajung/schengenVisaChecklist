// =============================================================================
// SEO fallback defaults — used only when Sanity Site Settings is empty.
// Real defaults belong in the Sanity Studio `siteSettings` singleton document.
// =============================================================================

import {SITE_NAME} from '@/constants/site'

/**
 * Last-resort defaults used only when Sanity Site Settings is empty. Real
 * defaults belong in the Site Settings singleton.
 */
export const seoDefaults = {
  siteName: SITE_NAME,
  titleTemplate: '%s',
  description: '',
}
