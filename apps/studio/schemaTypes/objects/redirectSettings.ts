import {defineType, defineField} from 'sanity'

/**
 * Per-document redirect behaviour for slug history. Old slugs are always
 * redirected to the current slug. Toggle between 301 (permanent, default)
 * and 302 (temporary) as needed.
 */
export const redirectSettings = defineType({
  name: 'redirectSettings',
  title: 'Redirect Settings',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'enabled',
      title: 'Redirect old slugs to current slug',
      type: 'boolean',
      initialValue: true,
      hidden: true,
    }),
    defineField({
      name: 'permanent',
      title: 'Use 301 (Permanent) redirect',
      type: 'boolean',
      initialValue: true,
      description: 'On = 301 permanent (default, recommended for SEO). Off = 302 temporary.',
    }),
  ],
})
