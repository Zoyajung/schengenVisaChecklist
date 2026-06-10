import {defineField, defineType, defineArrayMember} from 'sanity' // defineArrayMember used by selectedFaqs
import {SeoChecklist} from '../components/SeoChecklist'
import {SeoPreview} from '../components/SeoPreview'
import {SchemaPreview} from '../components/SchemaPreview'

/**
 * Landing Page SEO & Metadata
 *
 * Lightweight document for managing SEO, AI SEO, FAQ, and structured data for
 * code-built landing pages (Home, About, Contact, FAQ, etc.).
 *
 * Groups mirror the blog post layout:
 *   Content → SEO (merged SEO + AI SEO) → Schema (auto) → Settings
 *
 * Slug is user-set because it IS the route path ("/" = home, "faq" = /faq, etc.)
 */
export const landingPageSeo = defineType({
  name: 'landingPageSeo',
  title: 'Landing Page SEO',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'schema', title: 'Schema'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    // ── Content ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Page Title / Identifier',
      type: 'string',
      group: 'content',
      description: 'Human-readable name (e.g. "Home", "About", "FAQ"). Not shown publicly.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page Route',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      description: 'URL path: "/" for homepage, "about" for /about, "faq" for /faq. (no leading slash except for home)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'selectedFaqs',
      title: 'FAQ Items',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faqItem'}]})],
      description:
        'Pick which FAQ items to show on this page from the FAQ Items list. Drives both the FAQ section and FAQPage JSON-LD. Used on every landing page including /faq — only the FAQs you select here appear.',
    }),
    // ── SEO (SEO & Meta + AI SEO merged) ─────────────────────────────────────
    defineField({name: 'seo', title: 'SEO & Meta', type: 'seo', group: 'seo'}),
    defineField({name: 'aiSeo', title: 'AI SEO', type: 'aiSeo', group: 'seo'}),
    defineField({name: 'seoChecklist', title: 'SEO Checklist', type: 'string', group: 'seo', components: {input: SeoChecklist}}),
    defineField({name: 'seoPreview', title: 'Search & Social Preview', type: 'string', group: 'seo', components: {input: SeoPreview}}),

    // ── Schema (auto-detected from content) ──────────────────────────────────
    defineField({
      name: 'schemaPreview',
      title: 'Schema Output',
      type: 'string',
      group: 'schema',
      components: {input: SchemaPreview},
    }),
    defineField({
      name: 'schemaConfig',
      title: 'Primary Schema Type',
      type: 'schemaConfig',
      group: 'schema',
      description: 'Select the schema.org type that best describes this page. All other schemas (FAQ, Breadcrumb, Speakable) are auto-detected from content.',
    }),

    // ── Settings ─────────────────────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated Date',
      type: 'datetime',
      group: 'settings',
      hidden: true,
      description: 'Deprecated manual field. The site now uses Sanity system _updatedAt automatically.',
    }),
  ],

  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {
        title,
        subtitle: `/${slug === '/' ? '' : (slug || '')}`,
      }
    },
  },
})
