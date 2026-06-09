import {CheckCircle2, ExternalLink, FileCheck2, ShieldAlert} from 'lucide-react'
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
    doc: {title: t(messages, 'about.title'), seo: {metaDescription: t(messages, 'about.description')}},
    path: '/about',
    locale,
  })
}

export default async function AboutPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const sections = Array.isArray(messages.about?.sections) ? messages.about.sections : []
  const principles = Array.isArray(messages.about?.principles) ? messages.about.principles : []
  const icons = [FileCheck2, CheckCircle2, ExternalLink, ShieldAlert]

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-14">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t(messages, 'about.eyebrow')}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t(messages, 'about.title')}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{t(messages, 'about.description')}</p>
            <p className="mt-5 text-base leading-7 text-slate-700">{t(messages, 'about.intro')}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {sections.map((section, index) => {
              const Icon = icons[index % icons.length]
              return (
                <section key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-950">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.body}</p>
                </section>
              )
            })}
          </div>

          {principles.length ? (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{t(messages, 'about.principlesTitle')}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {principles.map((principle) => (
                  <li key={principle} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            {t(messages, 'about.closing')}
          </div>
        </div>
      </Container>
    </main>
  )
}
