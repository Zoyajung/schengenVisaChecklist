import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Author — E-E-A-T entity. Powers author pages, the inline byline on blog
 * posts, and is injected into Article/BlogPosting schema as a Person or
 * Organization node (determined by the Entity Type field).
 *
 * All JSON-LD for the author page is auto-generated from these fields —
 * no manual schema configuration is needed.
 */
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'entityType',
      title: 'Entity Type',
      type: 'string',
      options: {
        list: [
          {title: 'Person', value: 'person'},
          {title: 'Organisation', value: 'organisation'},
        ],
        layout: 'radio',
      },
      initialValue: 'person',
      validation: (Rule) => Rule.required(),
      description: 'Determines the schema.org type: Person or Organization.',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Auto-generated from the name. Used in the author page URL: /author/[slug]',
    }),

    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "SEO Expert", "Staff Writer", "Guest Contributor", "Digital Agency".',
    }),

    defineField({
      name: 'worksFor',
      title: 'Organisation / Employer',
      type: 'string',
      description: 'Optional. Company or organisation this person works for (used in structured data for E-E-A-T).',
    }),

    defineField({
      name: 'link',
      title: 'Website',
      type: 'url',
      description: 'Personal or organisation website URL.',
      validation: (Rule) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),

    defineField({
      name: 'socials',
      title: 'Social Profiles',
      type: 'array',
      description: 'Optional. Social or professional profile links.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['twitter', 'linkedin', 'github', 'youtube', 'instagram'],
              },
            }),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),

    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown in the author byline and used in structured data.',
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'portableText',
      description: 'Rich-text biography shown on the author page. Supports headings, bold, italic, links, callouts, images, and more.',
    }),

    defineField({
      name: 'image',
      title: 'Photo / Logo',
      type: 'imageWithMeta',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'image', entityType: 'entityType'},
    prepare: ({title, subtitle, media, entityType}) => ({
      title,
      subtitle: [entityType === 'organisation' ? 'Org' : null, subtitle].filter(Boolean).join(' · '),
      media,
    }),
  },
})
