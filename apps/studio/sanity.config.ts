import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {StudioLayout} from './schemaTypes/components/StudioLayout'
import {wrapPublish} from './schemaTypes/actions/publishWithRedirect'

const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'liwj8ta5'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Document types whose Publish action also records slug history for redirects.
const REDIRECT_AWARE_TYPES = ['blogPost']

// Singletons should not be duplicated or deleted from the studio.
const SINGLETONS = ['siteSettings']

export default defineConfig({
  name: 'default',
  title: 'Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (prev) => prev.filter((t) => !SINGLETONS.includes(t.id)),
  },

  document: {
    actions: (prev, context) => {
      // Singletons: no duplicate / delete / unpublish.
      if (SINGLETONS.includes(context.schemaType)) {
        return prev.filter(({action}) => action && !['duplicate', 'delete', 'unpublish'].includes(action))
      }
      // Slug-history on publish for redirect-aware types.
      if (REDIRECT_AWARE_TYPES.includes(context.schemaType)) {
        return prev.map((a) => (a.action === 'publish' ? wrapPublish(a) : a))
      }
      return prev
    },
  },

  studio: {
    components: {layout: StudioLayout},
  },
})
