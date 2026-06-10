import {defineType, defineField} from 'sanity'
import {createCharacterCount} from '../components/CharacterCount'

/**
 * Reusable SEO & meta object. Embedded on documents, and as defaults on
 * Site Settings and Category (inheritance: Site -> Category -> Document).
 *
 * Fields below feed ALL platforms — no need to enter values twice:
 *   Meta Title       → <title>, OpenGraph title, Twitter card title
 *   Meta Description → <meta description>, OpenGraph description, Twitter card description
 *   Share Image      → OpenGraph image, Twitter card image
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO & Meta',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Used for page <title>, OpenGraph title, and Twitter card title.',
      components: {input: createCharacterCount({recommendedMin: 50, recommendedMax: 60, hardLimit: 70})},
      validation: (Rule) =>
        Rule.max(70).warning('Over 70 characters will be truncated by Google'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Used for meta description, OpenGraph description, and Twitter card description.',
      components: {input: createCharacterCount({recommendedMin: 140, recommendedMax: 160, hardLimit: 180})},
      validation: (Rule) =>
        Rule.max(180).warning('Over 180 characters will be truncated by Google'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share Image',
      type: 'imageWithMeta',
      description: 'Used for OpenGraph and Twitter card image. Falls back to the post\'s featured image if blank.',
    }),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url', description: 'Optional. Leave blank to use the page URL. Set only to prevent duplicate-content issues.'}),
  ],
})
