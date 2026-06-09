// ============================================================================
// Reusable GROQ projections & filters. Keep GROQ out of components — compose
// these fragments in the query files instead.
// ============================================================================

/** Image projection: CDN url + metadata + the imageWithMeta fields. */
export const imageFields = `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions,
  "alt": coalesce(alt, ""),
  caption,
  credit,
  hotspot,
  crop
}`

/**
 * SEO object projection.
 * metaTitle / metaDescription / ogImage (shareImage) cover all platforms —
 * Google, OpenGraph, and Twitter — from a single set of inputs.
 */
export const seoFields = `{
  metaTitle, metaDescription, canonicalUrl,
  "ogImage": ogImage${imageFields}
}`

/** AI SEO object projection. */
export const aiSeoFields = `{
  quickAnswer, keyTakeaways
}`

/**
 * Author projection — full, for E-E-A-T and the author byline.
 * Includes all fields needed for the Person JSON-LD schema and the
 * clickable author link (/author/[slug]).
 */
export const authorFields = `{
  _id, _type, name, "slug": slug.current, entityType, role, worksFor, link, description,
  "bio": bio[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  },
  "image": image${imageFields}, socials
}`

/** Category projection — name, slug, description only. */
export const categoryFields = `{
  _id, _type, name, "slug": slug.current, description
}`

/** Schema config projection (used by site settings). */
export const schemaConfigFields = `{
  primarySchemaType, enableFaqSchema, enableSpeakable,
  enableBreadcrumb, enableVideoSchema, enableImageSchema
}`

/** Social defaults projection (used by site settings). */
export const socialDefaultsFields = `{
  "ogImage": ogImage${imageFields},
  "twitterImage": twitterImage${imageFields},
  twitterHandle
}`

/** Resolve an internal reference (link / cta) to {_type, slug}. */
const linkResolve = `{
  ...,
  "internal": internal->{_type, "slug": slug.current}
}`

/**
 * Portable Text body with resolved internal links and dereferenced media.
 */
export const bodyFields = `body[]{
  ...,
  _type == "image" => {
    ...,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions
  },
  _type == "ctaBlock" => { ..., link${linkResolve} },
  _type == "faqBlock" => { ... },
  markDefs[]{
    ...,
    _type == "link" => ${linkResolve}
  }
}`

/**
 * Public visibility filter. References `$preview` (always injected by
 * sanityFetch) so editors previewing drafts bypass status/schedule gating.
 */
export const liveFilter = `(
  (!defined(status) || status == "published" || $preview) &&
  (!defined(publishAt) || publishAt <= now() || $preview) &&
  (!defined(unpublishAt) || unpublishAt > now() || $preview) &&
  (visibility != false || $preview)
)`
