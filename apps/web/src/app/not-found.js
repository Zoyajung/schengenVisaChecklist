// Global 404 page. Static copy comes from the message bundle so future
// localized not-found pages use the same translation source.

import Link from 'next/link'
import {DEFAULT_LOCALE} from '@/i18n/config'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

export default function NotFound() {
  const messages = getMessages(DEFAULT_LOCALE)

  return (
    <main className="min-h-screen bg-white px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-slate-900">{t(messages, 'notFound.title')}</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-500">{t(messages, 'notFound.description')}</p>
      <Link
        href={localizedPath(DEFAULT_LOCALE, '/')}
        className="mt-8 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t(messages, 'notFound.homeLink')}
      </Link>
    </main>
  )
}
