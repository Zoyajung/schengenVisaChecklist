// =============================================================================
// Navbar - sticky public navigation with mobile menu and a checklist CTA.
// =============================================================================

'use client'

import {useState} from 'react'
import Link from 'next/link'
import {Menu, ShieldCheck, X} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

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
    <nav aria-label={t(messages, 'nav.mainLabel')} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link
            href={localizedPath(locale, '/')}
            className="flex min-w-0 items-center gap-3 rounded-md py-2 text-primary transition hover:text-secondary"
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-white shadow-lg shadow-primary/20">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-5 text-slate-950 sm:text-base">{displayBrand}</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">{t(messages, 'site.tagline')}</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {NAV_LINKS.map(({href, labelKey}) => (
              <li key={href}>
                <Link
                  href={localizedPath(locale, href)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-primary"
                >
                  {t(messages, labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href={localizedPath(locale, '/checklist')}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t(messages, 'nav.generate')}
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-primary hover:text-primary lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t(messages, 'nav.closeMenu') : t(messages, 'nav.openMenu')}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="grid gap-1" role="list">
              {NAV_LINKS.map(({href, labelKey}) => (
                <li key={href}>
                  <Link
                    href={localizedPath(locale, href)}
                    className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(messages, labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={localizedPath(locale, '/checklist')}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-bold text-white shadow-lg shadow-primary/20"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              {t(messages, 'nav.generate')}
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
