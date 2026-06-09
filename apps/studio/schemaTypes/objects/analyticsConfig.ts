import {defineType, defineField} from 'sanity'

/**
 * CMS-driven analytics IDs. All optional — the frontend analytics layer mounts
 * only the providers that have an ID set. Lives on Site Settings.
 */
export const analyticsConfig = defineType({
  name: 'analyticsConfig',
  title: 'Analytics',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'ga4Id', title: 'GA4 Measurement ID', type: 'string', description: 'e.g. G-XXXXXXX'}),
    defineField({name: 'gtmId', title: 'Google Tag Manager ID', type: 'string', description: 'e.g. GTM-XXXXXXX'}),
    defineField({name: 'plausibleDomain', title: 'Plausible Domain', type: 'string'}),
    defineField({name: 'clarityId', title: 'Microsoft Clarity ID', type: 'string'}),
  ],
})
