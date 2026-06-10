// =============================================================================
// SpeakableSpecification schema — tells voice assistants (Google Assistant,
// Alexa) which CSS selector on the page contains the most speakable content.
// The `.ds-speakable` element is rendered by BlogQuickAnswer.js (screen-reader-only
// invisible div). Auto-emitted when aiSeo.quickAnswer is set on a document.
// =============================================================================

const CONTEXT = 'https://schema.org'

/**
 * SpeakableSpecification attached to a WebPage node. The frontend renders the
 * Quick Answer / speakable content with the `.ds-speakable` class so voice
 * assistants can target it.
 * @param {{url:string, cssSelectors?:string[]}} opts
 */
export function generateSpeakableSchema({url, cssSelectors = ['.ds-speakable']}) {
  return {
    '@context': CONTEXT,
    '@type': 'WebPage',
    '@id': url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url,
  }
}
