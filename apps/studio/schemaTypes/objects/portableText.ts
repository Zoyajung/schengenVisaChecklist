import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Production rich-text body. Standard block content (H1–H6, lists, quote, code,
 * inline marks, reference-based links) plus structured custom blocks that each
 * have a dedicated frontend renderer: image, table, callout, YouTube, CTA, FAQ,
 * divider and code block.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 1', value: 'h1'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Heading 5', value: 'h5'},
        {title: 'Heading 6', value: 'h6'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [{type: 'link'}],
      },
    }),

    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
        defineField({name: 'credit', title: 'Credit', type: 'string'}),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'table',
      title: 'Table',
      fields: [
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'row',
              fields: [
                defineField({name: 'cells', title: 'Cells', type: 'array', of: [{type: 'string'}]}),
              ],
              preview: {
                select: {cells: 'cells'},
                prepare: ({cells}) => ({title: ((cells as string[]) || []).join(' · ') || 'Row'}),
              },
            }),
          ],
        }),
        defineField({name: 'hasHeaderRow', title: 'First row is a header', type: 'boolean', initialValue: true}),
      ],
      preview: {select: {caption: 'caption'}, prepare: ({caption}) => ({title: caption || 'Table'})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              {title: 'Info', value: 'info'},
              {title: 'Success', value: 'success'},
              {title: 'Warning', value: 'warning'},
              {title: 'Danger', value: 'danger'},
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        }),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'content', title: 'Content', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
      ],
      preview: {select: {title: 'title', subtitle: 'tone', content: 'content'}, prepare: ({title, subtitle, content}) => ({title: title || content, subtitle: `Callout · ${subtitle}`})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube',
      fields: [
        defineField({name: 'url', title: 'Video URL', type: 'url', validation: (Rule) => Rule.required()}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
      ],
      preview: {select: {title: 'title', subtitle: 'url'}, prepare: ({title, subtitle}) => ({title: title || 'YouTube video', subtitle})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'ctaBlock',
      title: 'Call to Action',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'text', title: 'Text', type: 'string'}),
        defineField({name: 'label', title: 'Button label', type: 'string', validation: (Rule) => Rule.required()}),
        defineField({name: 'link', title: 'Button link', type: 'link'}),
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {list: ['primary', 'secondary'], layout: 'radio'},
          initialValue: 'primary',
        }),
      ],
      preview: {select: {title: 'heading', subtitle: 'label'}, prepare: ({title, subtitle}) => ({title: title || 'Call to action', subtitle})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'faqBlock',
      title: 'FAQ',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'items', title: 'Questions', type: 'faqList'}),
      ],
      preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'FAQ block'})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {list: ['line', 'dots', 'space'], layout: 'radio'},
          initialValue: 'line',
        }),
      ],
      preview: {prepare: () => ({title: '— Divider —'})},
    }),

    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code',
      fields: [
        defineField({name: 'language', title: 'Language', type: 'string'}),
        defineField({name: 'filename', title: 'Filename', type: 'string'}),
        defineField({name: 'code', title: 'Code', type: 'text', rows: 8, validation: (Rule) => Rule.required()}),
      ],
      preview: {select: {title: 'filename', subtitle: 'language'}, prepare: ({title, subtitle}) => ({title: title || 'Code block', subtitle})},
    }),
  ],
})
