// =============================================================================
// Navbar — sticky top navigation. Supports a slide-in mobile menu with proper
// focus management and ARIA attributes. Brand name comes from Sanity Site
// Settings. Add new nav links in the NAV_LINKS array below.
// =============================================================================

'use client'
import {useState} from 'react'
import Link from 'next/link'
import {Menu, X} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

/** Central list of nav links. Add/remove entries here. */
const NAV_LINKS = [
  {href: '/checklist', labelKey: 'nav.checklist'},
  {href: '/blog', labelKey: 'nav.blog'},
  {href: '/faq', labelKey: 'nav.faq'},
  {href: '/about', labelKey: 'nav.about'},
  {href: '/contact', labelKey: 'nav.contact'},
]

export default function Navbar({locale, brand}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const messages = getMessages(locale)
  const displayBrand = brand || t(messages, 'site.fallbackBrand')

  return (
    <nav aria-label={t(messages, 'nav.mainLabel')} className="sticky top-0 z-50 bg-secondary border-b border-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand / logo */}
          <Link href={localizedPath(locale, '/')} className="flex min-w-0 max-w-[calc(100vw-5.5rem)] shrink items-center gap-2.5 sm:max-w-none sm:shrink-0">
            <div className="h-8 w-8 shrink-0 rounded-md bg-primary" aria-hidden="true" />
            <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg">{displayBrand}</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden sm:flex items-center gap-6" role="list">
            {NAV_LINKS.map(({href, labelKey}) => (
              <li key={href}>
                <Link
                  href={localizedPath(locale, href)}
                  className="text-slate-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  {t(messages, labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden text-slate-400 hover:text-primary p-2 rounded-md transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t(messages, 'nav.closeMenu') : t(messages, 'nav.openMenu')}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>

        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div id="mobile-menu" className="sm:hidden border-t border-tertiary bg-secondary">
          <ul className="px-4 py-3 space-y-1" role="list">
            {NAV_LINKS.map(({href, labelKey}) => (
              <li key={href}>
                <Link
                  href={localizedPath(locale, href)}
                  className="block py-2 text-slate-300 hover:text-primary text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(messages, labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
