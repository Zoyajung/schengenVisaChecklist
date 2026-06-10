// =============================================================================
// FAQPage schema — generates a schema.org/FAQPage node from an array of
// {question, answer} pairs. Auto-detected by buildPostSchemas (blog posts with
// inline FAQs) and buildPageSchemas (landing pages with selectedFaqs).
// =============================================================================

const CONTEXT = 'https://schema.org'

/**
 * FAQPage JSON-LD.
 * @param {{question:string,answer:string}[]} faqs
 */
export function generateFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || !faqs.length) return null
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((f) => f && f.question && f.answer)
      .map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {'@type': 'Answer', text: f.answer},
      })),
  }
}
