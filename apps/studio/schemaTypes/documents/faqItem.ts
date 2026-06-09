import {defineField, defineType} from 'sanity'

/**
 * Standalone FAQ item — powers the global/landing FAQ section. Page- and
 * post-level FAQs use the embedded `faqList` object instead.
 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Lower numbers appear first', initialValue: 0}),
  ],
  orderings: [{title: 'Display Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'answer'}},
})
