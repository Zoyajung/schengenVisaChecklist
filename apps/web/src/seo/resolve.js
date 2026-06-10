// ============================================================================
// Inheritance resolvers — Site Settings -> Document.
// Category-level defaults were removed; inheritance is now Site -> Document.
//
// SEO: metaTitle / metaDescription / ogImage feed all platforms (Google,
// OpenGraph, Twitter) — no separate OG/Twitter fields needed.
// ============================================================================

/** First defined (non-null/undefined/empty) value. */
function firstDefined(...vals) {
  for (const v of vals) if (v !== undefined && v !== null && v !== '') return v
  return undefined
}

/**
 * Resolve the effective SEO values for a page.
 * ogTitle / twitterTitle / ogDescription / twitterDescription all derive from
 * metaTitle / metaDescription — editors enter values once.
 *
 * @param {{settings?:any, doc?:any}} ctx
 */
export function resolveSeo({settings, doc} = {}) {
  settings = settings || {}
  doc = doc || {}
  const s = settings.defaultSeo || {}
  const d = doc.seo || {}
  const siteSocial = settings.socialDefaults || {}

  const metaTitle = firstDefined(d.metaTitle, s.metaTitle)
  const metaDescription = firstDefined(d.metaDescription, doc.excerpt, doc.description, s.metaDescription, settings.description)
  // ogImage / shareImage: prefer the post's dedicated SEO image, then the
  // featured image, then the site-wide default
  const ogImage = firstDefined(d.ogImage, doc.featuredImage, s.ogImage, siteSocial.ogImage)

  return {
    metaTitle,
    metaDescription,
    canonicalUrl: d.canonicalUrl,
    // OG and Twitter reuse the same values — no duplication required
    ogTitle: metaTitle,
    ogDescription: metaDescription,
    ogImage,
    twitterTitle: metaTitle,
    twitterDescription: metaDescription,
    twitterImage: firstDefined(d.ogImage, doc.featuredImage, siteSocial.twitterImage, s.ogImage),
    twitterHandle: siteSocial.twitterHandle,
    // robots: all pages indexed and followed by default (no noindex/nofollow)
    robots: {},
  }
}

/**
 * Resolve the effective AI SEO values.
 * quickAnswer and keyTakeaways are the only consumer-visible fields.
 *
 * @param {{doc?:any}} ctx
 */
export function resolveAiSeo({doc} = {}) {
  doc = doc || {}
  const d = doc.aiSeo || {}
  return {
    quickAnswer: d.quickAnswer || null,
    keyTakeaways: Array.isArray(d.keyTakeaways) && d.keyTakeaways.length ? d.keyTakeaways : [],
  }
}

/**
 * Resolve the effective schema config.
 * Blog post schemas are fully auto-detected from content — this function
 * provides the defaults used by the schema builder.
 *
 * @param {{settings?:any}} ctx
 */
export function resolveSchemaConfig({settings} = {}) {
  settings = settings || {}
  const s = settings.defaultSchemaConfig || {}
  return {
    primarySchemaType: s.primarySchemaType || 'blogPosting',
    enableBreadcrumb: true,       // always on
    enableFaqSchema: true,        // auto-detected from faq content
    enableSpeakable: true,        // auto-detected from quickAnswer
    enableVideoSchema: true,      // auto-detected from YouTube blocks in body
    enableImageSchema: false,     // off by default
  }
}

/**
 * Document FAQ array. Filters out empty/dangling entries — landing pages
 * reference shared faqItem docs, so a deleted reference dereferences to null.
 */
export function resolveFaq({doc} = {}) {
  doc = doc || {}
  if (!Array.isArray(doc.faq)) return []
  return doc.faq.filter((f) => f && f.question && f.answer)
}
