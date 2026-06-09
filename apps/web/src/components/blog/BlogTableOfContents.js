// =============================================================================
// BlogTableOfContents — sticky side-panel ToC with scroll-spy. Headings are
// extracted server-side from the post body via extractHeadings() (utils/portable-text).
// Active heading is tracked client-side via useTableOfContents (IntersectionObserver).
// Only visible on ≥lg screens (hidden on mobile to avoid clutter).
// =============================================================================

'use client'
import {useTableOfContents} from '@/hooks/useTableOfContents'
import {getMessages, t} from '@/messages'

/**
 * @param {{headings:{id:string,text:string,level:number}[]}} props
 */
export default function BlogTableOfContents({headings = [], locale = 'en'}) {
  const activeId = useTableOfContents(headings)
  const messages = getMessages(locale)
  if (!headings.length) return null

  return (
    <nav aria-label={t(messages, 'blog.tocTitle')} className="text-sm">
      <p className="font-semibold uppercase tracking-widest text-xs text-slate-400 mb-3">{t(messages, 'blog.tocTitle')}</p>
      <ul className="space-y-1.5 border-l border-slate-200">
        {headings.map((h) => (
          <li key={h.id} style={{paddingLeft: (h.level - 2) * 12}}>
            <a
              href={`#${h.id}`}
              className={`block -ml-px border-l-2 pl-3 py-0.5 transition-colors ${
                activeId === h.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
