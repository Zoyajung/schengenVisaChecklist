import {defineType, defineField} from 'sanity'

/**
 * Structured-data (JSON-LD) configuration.
 * Embedded on Landing Page SEO documents and Site Settings.
 *
 * Blog posts are always BlogPosting — schemaConfig is hidden there.
 * For landing pages the primary type should be selected by the editor;
 * everything else is auto-detected from page content.
 */
export const PRIMARY_SCHEMA_TYPES = [
  // — Page types ————————————————————————————————————————
  {title: 'WebPage (generic)', value: 'webPage'},
  {title: 'AboutPage', value: 'aboutPage'},
  {title: 'ContactPage', value: 'contactPage'},
  {title: 'FAQPage', value: 'faqPage'},
  {title: 'CollectionPage', value: 'collectionPage'},
  {title: 'SearchResultsPage', value: 'searchResultsPage'},

  // — Article / content types ——————————————————————————
  {title: 'Article', value: 'article'},
  {title: 'BlogPosting', value: 'blogPosting'},
  {title: 'HowTo', value: 'howTo'},

  // — Commerce / listing ————————————————————————————————
  {title: 'Product', value: 'product'},
  {title: 'Review', value: 'review'},
  {title: 'ItemList', value: 'itemList'},

  // — Organisation / business ———————————————————————————
  {title: 'Organization', value: 'organization'},
  {title: 'LocalBusiness', value: 'localBusiness'},
  {title: 'Service', value: 'service'},
  {title: 'TravelAgency', value: 'travelAgency'},

  // — Site-level ————————————————————————————————————————
  {title: 'WebSite', value: 'webSite'},
]

export const schemaConfig = defineType({
  name: 'schemaConfig',
  title: 'Schema',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'primarySchemaType',
      title: 'Primary Schema Type',
      type: 'string',
      options: {list: PRIMARY_SCHEMA_TYPES, layout: 'dropdown'},
      description: 'Main entity type for this page. Auto-detected as BlogPosting for blog posts.',
    }),
    defineField({name: 'enableFaqSchema', title: 'FAQ Schema', type: 'boolean', hidden: true}),
    defineField({name: 'enableSpeakable', title: 'Speakable Schema', type: 'boolean', hidden: true}),
    defineField({name: 'enableBreadcrumb', title: 'Breadcrumb Schema', type: 'boolean', initialValue: true, hidden: true}),
    defineField({name: 'enableVideoSchema', title: 'Video Schema', type: 'boolean', hidden: true}),
    defineField({name: 'enableImageSchema', title: 'Image Schema', type: 'boolean', hidden: true}),
  ],
})
