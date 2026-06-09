import {defineField, defineType} from 'sanity'

export const generatedResult = defineType({
  name: 'generatedResult',
  title: 'Generated Result',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userInputs',
      title: 'User Inputs',
      type: 'object',
      fields: [
        defineField({name: 'nationality', title: 'Nationality', type: 'string'}),
        defineField({name: 'residenceCountry', title: 'Residence Country', type: 'string'}),
        defineField({name: 'destinationCountry', title: 'Destination Country', type: 'string'}),
        defineField({name: 'visaType', title: 'Visa Type', type: 'string'}),
        defineField({name: 'purpose', title: 'Purpose', type: 'string'}),
        defineField({name: 'employmentStatus', title: 'Employment Status', type: 'string'}),
        defineField({name: 'familyStatus', title: 'Family Status', type: 'string'}),
        defineField({name: 'previousBiometrics', title: 'Previous Schengen Biometrics', type: 'boolean'}),
      ],
    }),
    defineField({
      name: 'generatedJson',
      title: 'Generated JSON Result',
      type: 'text',
      rows: 20,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceReferencesUsed',
      title: 'Source References Used',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'officialSource'}]}],
    }),
    defineField({
      name: 'confidenceLevel',
      title: 'Confidence Level',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'High', value: 'high'},
          {title: 'Medium', value: 'medium'},
          {title: 'Low', value: 'low'},
        ],
      },
      initialValue: 'low',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'AI Generated', value: 'aiGenerated'},
          {title: 'Admin Reviewed', value: 'adminReviewed'},
          {title: 'SEO Ready', value: 'seoReady'},
        ],
      },
      initialValue: 'aiGenerated',
    }),
    defineField({name: 'createdDate', title: 'Created Date', type: 'datetime', initialValue: () => new Date().toISOString()}),
    defineField({name: 'reviewedDate', title: 'Reviewed Date', type: 'datetime'}),
    defineField({name: 'reviewerNotes', title: 'Reviewer Notes', type: 'text', rows: 4}),
    defineField({name: 'indexable', title: 'Indexable', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {
      title: 'slug.current',
      subtitle: 'status',
    },
  },
})
