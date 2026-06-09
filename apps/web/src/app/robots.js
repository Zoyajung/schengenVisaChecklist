// =============================================================================
// robots.txt — generated at /robots.txt
// Blocks /api/ and /studio/ from crawlers. Update rules here if you need to
// noindex specific paths (e.g. /thank-you, /login).
// =============================================================================

import {SITE_URL} from '@/constants/site'

export default function robots() {
  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/api/', '/studio/']}],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
