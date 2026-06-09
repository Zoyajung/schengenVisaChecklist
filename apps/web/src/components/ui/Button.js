// =============================================================================
// Button — link-style button supporting a raw href string or a Sanity CMS
// link reference (resolved via resolveHref). External links open in a new tab.
// =============================================================================

import Link from 'next/link'
import {resolveHref} from '@/utils/resolveHref'

const STYLES = {
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'border border-current text-primary hover:bg-primary/5',
}

/**
 * Link-style button. Accepts a raw `href` or a CMS `link` object (resolved via
 * resolveHref). External links open in a new tab.
 */
export default function Button({href, link, locale = 'en', children, style = 'primary', className = ''}) {
  const url = href || resolveHref(link, locale) || '#'
  const external = /^https?:\/\//.test(url)
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${STYLES[style] || STYLES.primary} ${className}`

  if (external) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={url} className={cls}>
      {children}
    </Link>
  )
}

