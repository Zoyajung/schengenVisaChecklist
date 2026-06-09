import {defineField, defineType} from 'sanity'

export const checklistRule = defineType({
  name: 'checklistRule',
  title: 'Checklist Rule',
  type: 'document',
  fields: [
    defineField({name: 'documentName', title: 'Document Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Required', value: 'required'},
          {title: 'Conditional', value: 'conditional'},
          {title: 'Optional', value: 'optional'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'nationality', title: 'Applies To Nationality', type: 'reference', to: [{type: 'country'}]}),
    defineField({name: 'residenceCountry', title: 'Applies To Residence Country', type: 'reference', to: [{type: 'country'}]}),
    defineField({name: 'destinationCountry', title: 'Applies To Destination Country', type: 'reference', to: [{type: 'country'}]}),
    defineField({name: 'visaType', title: 'Applies To Visa Type', type: 'reference', to: [{type: 'visaType'}]}),
    defineField({name: 'conditionText', title: 'Condition Text', type: 'text', rows: 2}),
    defineField({name: 'explanation', title: 'Explanation', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'commonMistakes',
      title: 'Common Mistakes',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'officialSources',
      title: 'Official Source References',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'officialSource'}]}],
    }),
  ],
  preview: {
    select: {title: 'documentName', subtitle: 'status'},
  },
})
