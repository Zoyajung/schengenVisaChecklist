import {defineField, defineType} from 'sanity'

export const country = defineType({
  name: 'country',
  title: 'Country',
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
    defineField({
      name: 'isoCode',
      title: 'ISO Code',
      type: 'string',
      description: 'Use the common 2-letter country code, for example IN, AE, FR.',
    }),
    defineField({
      name: 'countryTypes',
      title: 'Country Types',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'grid',
        list: [
          {title: 'Nationality', value: 'nationality'},
          {title: 'Residence', value: 'residence'},
          {title: 'Destination', value: 'destination'},
          {title: 'Schengen Country', value: 'schengen'},
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'notes', title: 'Notes', type: 'text', rows: 3}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'isoCode'},
  },
})
