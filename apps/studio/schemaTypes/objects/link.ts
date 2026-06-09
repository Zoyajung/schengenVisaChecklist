import {defineType, defineField} from 'sanity'

/**
 * Link annotation supporting internal references (preferred) or external URLs.
 * Internal links can reference blog posts, categories, or authors. The frontend
 * resolves the live URL via resolveHref() so links never break when slugs change.
 * Landing pages are built in code, so they're not referenced here.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internal',
      title: 'Internal reference',
      type: 'reference',
      to: [{type: 'blogPost'}, {type: 'category'}, {type: 'author'}],
      hidden: ({parent}) => parent?.linkType === 'external',
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({
      name: 'blank',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
