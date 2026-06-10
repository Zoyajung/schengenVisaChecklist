import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'liwj8ta5'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const appId = process.env.SANITY_STUDIO_APP_ID || 'ak3mnggo4u6erankxexpjqkw'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId,
  }
})
