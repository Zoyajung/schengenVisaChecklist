// =============================================================================
// Footer — site footer with brand, description, nav links, social profiles, and
// copyright. Brand name and description come from Sanity Site Settings.
// Social profile URLs come from siteSettings.socialProfiles. Icons are real
// brand logos (see BrandIcons); unknown platforms fall back to a generic link.
// =============================================================================

import Link from 'next/link'
import {Link2} from 'lucide-react'
import SocialBrandIcon, {SUPPORTED_BRANDS} from './BrandIcons'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

/**
 * @param {{
 *   locale: string,
 *   brand?: string,
 *   description?: string,
 *   socialProfiles?: {platform: string, url: string}[]
 * }} props
 */
export default function Footer({locale, brand, description, socialProfiles = []}) {
  const year = new Date().getFullYear()
  const messages = getMessages(locale)
  const displayBrand = brand || t(messages, 'site.fallbackBrand')

  return (
    <footer className="bg-secondary text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        <div className="flex flex-col sm:flex-row gap-10 pb-12 border-b border-tertiary">

          {/* Brand + description from Sanity Site Settings */}
          <div className="flex-1">
            <Link href={localizedPath(locale, '/')} className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-md" />
              <span className="text-white font-bold text-base">{displayBrand}</span>
            </Link>
            {description ? (
              <p className="text-sm leading-relaxed max-w-xs">{description}</p>
            ) : null}
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">{t(messages, 'footer.navigate')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={localizedPath(locale, '/checklist')} className="text-sm hover:text-primary transition-colors">
                  {t(messages, 'nav.checklist')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/blog')} className="text-sm hover:text-primary transition-colors">
                  {t(messages, 'nav.blog')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/faq')} className="text-sm hover:text-primary transition-colors">
                  {t(messages, 'nav.faq')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/about')} className="text-sm hover:text-primary transition-colors">
                  {t(messages, 'nav.about')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/contact')} className="text-sm hover:text-primary transition-colors">
                  {t(messages, 'nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar: copyright + social icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs">
          <p>&copy; {year} {displayBrand}. {t(messages, 'footer.rights')}</p>

          {/* Social icons pulled from Sanity Site Settings → socialProfiles */}
          {socialProfiles?.length ? (
            <div className="flex items-center gap-3">
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
                    className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors"
                  >
                    {hasBrand ? (
                      <SocialBrandIcon platform={platform} className="w-4 h-4" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>

      </div>
    </footer>
  )
}
