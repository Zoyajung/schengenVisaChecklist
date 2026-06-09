// =============================================================================
// JSON-LD schema composers.
//
// Design principles:
//   • Everything auto-detected — no manual toggles required.
//   • buildPostSchemas()   — blog post pages
//   • buildPageSchemas()   — code-built landing pages
//
// Auto-detection map for blog posts:
//   Always:          BlogPosting, BreadcrumbList
//   Title heuristic: HowTo (title starts with "How to …")
//   Has faqs:        FAQPage
//   quickAnswer:     SpeakableSpecification
//   YouTube blocks:  VideoObject
//
// Auto-detection map for landing pages:
//   Primary type:    from schemaConfig.primarySchemaType (editor pick, 1 field)
//   Always:          BreadcrumbList
//   Has faqs:        FAQPage (embedded in primary when type === faqPage)
//   quickAnswer:     SpeakableSpecification
//   Has services:    Service[], ItemList  (from Site Settings — zero per-page work)
// =============================================================================

export * from './organization'
export * from './blog'
export * from './website'
export * from './person'
export * from './breadcrumb'
export * from './article'
export * from './faq'
export * from './speakable'
export * from './video'
export * from './image'
export * from './howto'
export * from './product'
export * from './review'
export * from './localBusiness'
export * from './webpage'
export * from './service'

import {generateArticleSchema} from './article'
import {generateBreadcrumbSchema} from './breadcrumb'
import {generateFAQSchema} from './faq'
import {generateHowToSchema} from './howto'
import {generateSpeakableSchema} from './speakable'
import {videoSchemasFromBody} from './video'
import {generatePageSchema} from './webpage'
import {generateServiceSchemas, generateServiceItemList} from './service'
import {toPlainText} from '@/utils/portable-text'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Detect whether a post is a "How To" guide from its title alone.
 * Matches "How to …", "How To …", "How do I …" etc.
 */
function isHowToPost(title = '') {
  return /^how\s+to\b/i.test(title.trim())
}

/**
 * Extract ordered list items from Portable Text body as HowTo steps.
 * Looks for the first `number` list in the body.
 */
function howToStepsFromBody(body = []) {
  if (!Array.isArray(body)) return []
  const steps = []
  for (const block of body) {
    if (block?._type === 'block' && block.listItem === 'number' && Array.isArray(block.children)) {
      const text = block.children.map((c) => c.text || '').join('')
      if (text) steps.push({name: text.slice(0, 80), text})
    }
  }
  return steps
}

// ─── Blog post ────────────────────────────────────────────────────────────────

/**
 * Compose the full JSON-LD graph for a blog post page.
 * All schemas are auto-detected — editors need no schema config at all.
 *
 * Always:          BlogPosting, BreadcrumbList
 * "How to" title:  HowTo (with steps from the first numbered list in the body)
 * Has FAQs:        FAQPage
 * quickAnswer:     SpeakableSpecification
 * YouTube blocks:  VideoObject
 */
export function buildPostSchemas({post, url, settings = {}, faqs = [], breadcrumbs = [], locale = 'en'}) {
  const out = []

  out.push(generateArticleSchema({post, url, settings, type: 'blogPosting', locale}))

  if (breadcrumbs.length) out.push(generateBreadcrumbSchema(breadcrumbs))

  // HowTo — auto-detected from title pattern, steps from first numbered list
  if (isHowToPost(post.title)) {
    const steps = howToStepsFromBody(post.body)
    out.push(
      generateHowToSchema({
        name: post.title,
        description: post.seo?.metaDescription || (Array.isArray(post.body) ? toPlainText(post.body).slice(0, 200) : ''),
        image: post.featuredImage,
        steps,
        url,
      }),
    )
  }

  if (faqs.length) out.push(generateFAQSchema(faqs))
  if (post.aiSeo?.quickAnswer) out.push(generateSpeakableSchema({url}))
  out.push(...videoSchemasFromBody(post.body))

  return out.filter(Boolean)
}

// ─── Landing page ─────────────────────────────────────────────────────────────

/**
 * Compose the full JSON-LD graph for a code-built landing page.
 *
 * Primary type:  from schemaConfig.primarySchemaType (single editor field)
 * Always:        BreadcrumbList (when breadcrumbs provided)
 * Has FAQs:      FAQPage (embedded in primary when type === faqPage)
 * quickAnswer:   SpeakableSpecification
 * Services:      Service[], ItemList (from Site Settings — zero per-page input)
 */
export function buildPageSchemas({page, url, settings = {}, faqs = [], breadcrumbs = []}) {
  const out = []

  const primaryType = page?.schemaConfig?.primarySchemaType || 'webPage'
  out.push(generatePageSchema({page, url, settings, type: primaryType, faqs}))

  if (breadcrumbs.length) out.push(generateBreadcrumbSchema(breadcrumbs))

  // FAQPage: when the primary entity IS the FAQ page it carries mainEntity
  // itself (see generatePageSchema) — don't emit a second empty node.
  if (faqs.length && primaryType !== 'faqPage') out.push(generateFAQSchema(faqs))

  if (page?.aiSeo?.quickAnswer) out.push(generateSpeakableSchema({url}))

  // Service + ItemList — sourced from Site Settings, auto on every landing page.
  const services = settings?.services || []
  out.push(...generateServiceSchemas({services, settings}))
  out.push(generateServiceItemList({services}))

  return out.filter(Boolean)
}
