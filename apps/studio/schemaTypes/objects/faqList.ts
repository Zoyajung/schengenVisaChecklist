import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Reusable FAQ array. Used at site / category / page / post level and rendered
 * both visually and as FAQPage JSON-LD on the frontend.
 */
export const faqList = defineType({
  name: 'faqList',
  title: 'FAQ',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'faq',
      title: 'Q&A',
      fields: [
        defineField({
          name: 'question',
          title: 'Question',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'answer',
          title: 'Answer',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {select: {title: 'question', subtitle: 'answer'}},
    }),
  ],
})
