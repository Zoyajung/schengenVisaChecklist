// =============================================================================
// FAQSection — reusable section wrapper around FaqAccordion. Accepts a heading,
// optional intro, and an array of {question, answer} objects. Used on blog
// posts (from post/category FAQ), landing pages (from landingPageSeo FAQ), and
// anywhere else FAQs should appear. FAQPage JSON-LD is injected by the page.
// =============================================================================

import FAQAccordion from './FAQAccordion'
import {getMessages, t} from '@/messages'

/**
 * Reusable visual FAQ section (landing + blog + page builder). The FAQPage
 * JSON-LD is injected separately by the page.
 */
export default function FAQSection({
  heading,
  intro,
  faqs = [],
  id = 'faq',
  className = '',
  locale = 'en',
}) {
  if (!faqs?.length) return null
  const messages = getMessages(locale)
  const resolvedHeading = heading ?? t(messages, 'faq.title')
  return (
    <section id={id} className={`py-14 ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">{t(messages, 'faq.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{resolvedHeading}</h2>
          {intro ? <p className="mt-3 text-slate-500">{intro}</p> : null}
        </div>
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  )
}
