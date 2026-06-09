import {Mail} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import Container from '@/components/ui/Container'
import {getMessages, t} from '@/messages'

export async function generateMetadata({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  return buildMetadata({
    settings,
    doc: {title: t(messages, 'contact.title'), seo: {metaDescription: t(messages, 'contact.description')}},
    path: '/contact',
    locale,
  })
}

export default async function ContactPage({params, searchParams}) {
  const {locale} = await params
  const query = await searchParams
  const messages = getMessages(locale)
  const resultSlug = typeof query?.result === 'string' ? query.result : ''
  const emailSubject = resultSlug ? `Incorrect checklist report: ${resultSlug}` : 'Checklist report'
  const emailBody = resultSlug ? `Checklist result: ${resultSlug}\n\nIssue:` : ''

  return (
    <main className="min-h-screen bg-white">
      <Container className="py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-950">{t(messages, 'contact.title')}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{t(messages, 'contact.description')}</p>
          {resultSlug ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{t(messages, 'contact.resultReference')}</p>
              <p className="mt-1 break-words text-sm text-slate-600">{resultSlug}</p>
              <p className="mt-3 text-sm text-slate-600">{t(messages, 'contact.reportInstructions')}</p>
            </div>
          ) : null}
          <a
            href={`mailto:hello@schengenvisachecklist.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t(messages, 'contact.emailLabel')}: hello@schengenvisachecklist.com
          </a>
        </div>
      </Container>
    </main>
  )
}
