import {defineType, defineField} from 'sanity'

/**
 * Standalone redirect record — the editor-managed Redirect Management UI.
 * Consumed by the Next.js proxy. Source/destination are site-relative paths
 * (without the locale prefix), e.g. /old-page -> /new-page.
 */
export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({
      name: 'source',
      title: 'Source path',
      type: 'string',
      description: 'Path to redirect from, e.g. /old-page',
      validation: (Rule) => Rule.required().custom((v) => (v && !v.startsWith('/') ? 'Must start with /' : true)),
    }),
    defineField({
      name: 'destination',
      title: 'Destination path or URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'permanent', title: 'Permanent (301)', type: 'boolean', initialValue: true, description: 'On = 301, Off = 302.'}),
    defineField({name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {source: 'source', destination: 'destination', permanent: 'permanent', enabled: 'enabled'},
    prepare: ({source, destination, permanent, enabled}) => ({
      title: `${source} → ${destination}`,
      subtitle: `${permanent ? '301' : '302'}${enabled ? '' : ' · disabled'}`,
    }),
  },
})
