// =============================================================================
// Breadcrumbs — visual breadcrumb trail with ChevronRight separators. The
// matching BreadcrumbList JSON-LD is injected by the page (not here).
// =============================================================================

import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {getMessages, t} from '@/messages'

/**
 * Visual breadcrumbs. The matching BreadcrumbList JSON-LD is injected by the
 * page (see seo/schema/breadcrumb).
 * @param {{items:{name:string, href?:string}[], locale?: string}} props
 */
export default function Breadcrumbs({items = [], locale = 'en'}) {
  if (!items.length) return null
  const messages = getMessages(locale)
  return (
    <nav aria-label={t(messages, 'breadcrumbs.label')} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {last || !item.href ? (
                <span className={last ? 'text-slate-700 font-medium' : ''} aria-current={last ? 'page' : undefined}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.name}
                </Link>
              )}
              {!last ? <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-slate-300 shrink-0" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
