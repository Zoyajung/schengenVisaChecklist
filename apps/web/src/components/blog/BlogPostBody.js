// =============================================================================
// BlogPostBody — renders Sanity Portable Text with full custom block/mark support.
// Supports: headings, paragraphs, blockquotes, lists, inline code, internal
// and external links, images, tables, callouts, YouTube embeds, CTAs, FAQs,
// dividers, and syntax-highlighted code blocks.
// =============================================================================

import {PortableText} from 'next-sanity'
import {resolveHref} from '@/utils/resolveHref'
import PtImage from './portable/PtImage'
import PtTable from './portable/PtTable'
import PtCallout from './portable/PtCallout'
import PtYouTube from './portable/PtYouTube'
import PtCta from './portable/PtCta'
import PtFaq from './portable/PtFaq'
import PtDivider from './portable/PtDivider'
import PtCode from './portable/PtCode'

// Build the renderer map. `locale` is closed over so internal reference links
// resolve to live, locale-prefixed URLs.
function buildComponents(locale) {
  return {
    block: {
      h1: ({value, children}) => (
        <h1 id={value?._key} className="text-3xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">
          {children}
        </h1>
      ),
      h2: ({value, children}) => (
        <h2 id={value?._key} className="text-2xl font-bold text-slate-900 mt-10 mb-3 scroll-mt-24">
          {children}
        </h2>
      ),
      h3: ({value, children}) => (
        <h3 id={value?._key} className="text-xl font-semibold text-slate-900 mt-8 mb-2 scroll-mt-24">
          {children}
        </h3>
      ),
      h4: ({children}) => <h4 className="text-lg font-semibold text-slate-900 mt-6 mb-2">{children}</h4>,
      h5: ({children}) => <h5 className="text-base font-semibold text-slate-900 mt-6 mb-2">{children}</h5>,
      h6: ({children}) => <h6 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mt-6 mb-2">{children}</h6>,
      normal: ({children}) => <p className="text-slate-600 leading-relaxed mb-4">{children}</p>,
      blockquote: ({children}) => (
        <blockquote className="border-l-4 border-primary pl-4 italic text-slate-500 my-6">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({children}) => <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-slate-600">{children}</ul>,
      number: ({children}) => <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-slate-600">{children}</ol>,
    },
    listItem: {
      bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
      number: ({children}) => <li className="leading-relaxed">{children}</li>,
    },
    marks: {
      strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
      em: ({children}) => <em className="italic">{children}</em>,
      underline: ({children}) => <span className="underline">{children}</span>,
      code: ({children}) => (
        <code className="bg-slate-100 text-slate-800 text-sm font-mono px-1.5 py-0.5 rounded">{children}</code>
      ),
      link: ({value, children}) => {
        const href = resolveHref(value, locale) || value?.href || '#'
        const external = /^https?:\/\//.test(href)
        return (
          <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            {children}
          </a>
        )
      },
    },
    types: {
      image: PtImage,
      table: PtTable,
      callout: PtCallout,
      youtube: ({value}) => <PtYouTube value={value} locale={locale} />,
      ctaBlock: ({value}) => <PtCta value={value} locale={locale} />,
      faqBlock: PtFaq,
      divider: PtDivider,
      codeBlock: PtCode,
    },
  }
}

/**
 * Renders a Portable Text body with full custom block & mark support.
 * @param {{body:any[], locale?:string, className?:string}} props
 */
export default function BlogPostBody({body, locale = 'en', className = ''}) {
  if (!body?.length) return null
  return (
    <div className={`ds-prose max-w-none ${className}`}>
      <PortableText value={body} components={buildComponents(locale)} />
    </div>
  )
}
