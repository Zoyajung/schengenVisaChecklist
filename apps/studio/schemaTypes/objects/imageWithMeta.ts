import {defineType, defineField} from 'sanity'

/**
 * Image object enriched with the metadata every SEO-conscious image needs.
 * `hotspot` provides the focal point. Reused for featured images, OG images,
 * page-builder blocks, body images, author and category images.
 */
export const imageWithMeta = defineType({
  name: 'imageWithMeta',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines. Required.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'credit', title: 'Credit', type: 'string'}),
  ],
})
