// =============================================================================
// Footer - premium public footer with navigation, contact, and trust cues.
// =============================================================================

import Link from 'next/link'
import {FileCheck2, Globe2, Link2, Mail, MapPin, ShieldCheck} from 'lucide-react'
import SocialBrandIcon, {SUPPORTED_BRANDS} from './BrandIcons'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

const NAV_LINKS = [
  {href: '/checklist', labelKey: 'nav.checklist'},
  {href: '/blog', labelKey: 'nav.blog'},
  {href: '/faq', labelKey: 'nav.faq'},
  {href: '/about', labelKey: 'nav.about'},
  {href: '/contact', labelKey: 'nav.contact'},
]

export default function Footer({locale, brand, description, socialProfiles = []}) {
  const year = new Date().getFullYear()
  const messages = getMessages(locale)
  const displayBrand = brand || t(messages, 'site.fallbackBrand')
  const displayDescription = description || t(messages, 'footer.description')

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href={localizedPath(locale, '/')} className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-tertiary text-secondary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-bold">{displayBrand}</span>
                <span className="text-sm text-white/60">{t(messages, 'site.tagline')}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">{displayDescription}</p>
            <div className="mt-6 grid gap-3 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-tertiary" aria-hidden="true" />
                {t(messages, 'footer.coverage')}
              </span>
              <span className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-tertiary" aria-hidden="true" />
                {t(messages, 'footer.sourceAware')}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">{t(messages, 'footer.navigate')}</h2>
            <ul className="mt-4 grid gap-3" role="list">
              {NAV_LINKS.map(({href, labelKey}) => (
                <li key={href}>
                  <Link href={localizedPath(locale, href)} className="text-sm text-white/70 transition hover:text-tertiary">
                    {t(messages, labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">{t(messages, 'footer.support')}</h2>
            <ul className="mt-4 grid gap-3 text-sm text-white/70" role="list">
              <li>{t(messages, 'footer.supportItemOne')}</li>
              <li>{t(messages, 'footer.supportItemTwo')}</li>
              <li>{t(messages, 'footer.supportItemThree')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">{t(messages, 'footer.contact')}</h2>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <a href="mailto:hello@schengenvisachecklist.com" className="flex items-center gap-2 transition hover:text-tertiary">
                <Mail className="h-4 w-4 text-tertiary" aria-hidden="true" />
                hello@schengenvisachecklist.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-tertiary" aria-hidden="true" />
                {t(messages, 'footer.remoteEurope')}
              </span>
            </div>

            {socialProfiles?.length ? (
              <div className="mt-6 flex items-center gap-3">
                {socialProfiles.map(({platform, url}) => {
                  const label = platform.charAt(0).toUpperCase() + platform.slice(1)
                  const hasBrand = SUPPORTED_BRANDS.includes(platform)
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white/80 transition hover:border-tertiary hover:text-tertiary"
                    >
                      {hasBrand ? <SocialBrandIcon platform={platform} className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/20 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {displayBrand}. {t(messages, 'footer.rights')}</p>
          <p>{t(messages, 'footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
