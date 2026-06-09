import {defineField, defineType} from 'sanity'

export const officialSource = defineType({
  name: 'officialSource',
  title: 'Official Source',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Government', value: 'government'},
          {title: 'Embassy', value: 'embassy'},
          {title: 'VFS', value: 'vfs'},
          {title: 'TLS', value: 'tls'},
          {title: 'EU', value: 'eu'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'country', title: 'General Country', type: 'reference', to: [{type: 'country'}]}),
    defineField({name: 'destinationCountry', title: 'Destination Country', type: 'reference', to: [{type: 'country'}]}),
    defineField({name: 'residenceCountry', title: 'Residence Country', type: 'reference', to: [{type: 'country'}]}),
    defineField({
      name: 'lastCheckedDate',
      title: 'Last Checked Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'sourceType'},
  },
})
