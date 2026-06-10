import {defineField, defineType} from 'sanity'

export const visaType = defineType({
  name: 'visaType',
  title: 'Visa Type',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'examples',
      title: 'Examples',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short examples that help editors and users choose the right type.',
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'description'}},
})
