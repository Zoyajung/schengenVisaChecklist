// =============================================================================
// Sanity client — exports a configured `createClient` instance.
// When Sanity env vars are not set (e.g. on a fresh clone before .env.local is
// created), a no-op stub is exported so the build never crashes. All data reads
// should go through `sanityFetch` in ./fetch, not this client directly.
// =============================================================================

import {createClient} from 'next-sanity'
import {projectId, dataset, apiVersion, isSanityConfigured} from './config'

// Real client when configured; otherwise a stub whose fetch() resolves to null
// so builds and renders never crash before Sanity env vars are set (e.g. on a
// fresh Vercel deploy). All reads go through sanityFetch() in ./fetch.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
      stega: false,
    })
  : /** @type {any} */ ({
      fetch: async () => null,
      withConfig() {
        return this
      },
    })
