import Image from 'next/image'
import {CheckCircle2, ExternalLink, FileCheck2, MapPin, ShieldAlert, ShieldCheck} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import Container from '@/components/ui/Container'
import {getMessages, t} from '@/messages'

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1100&q=82'

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
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-slate-950">
      <section className="bg-[linear-gradient(180deg,#071c33_0%,#0b2948_100%)] text-white">
        <Container className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center">
          <div className="min-w-0">
            <p className="inline-flex min-h-9 max-w-full items-center rounded-md border border-white/15 bg-white/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-tertiary">
              {t(messages, 'about.eyebrow')}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] text-white sm:text-6xl">
              {t(messages, 'about.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {t(messages, 'about.description')}
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl shadow-black/25">
            <div className="relative aspect-[4/3] bg-secondary">
              <Image
                src={ABOUT_IMAGE}
                alt={t(messages, 'about.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-px bg-white/10 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                <span className="bg-secondary/75 px-2 py-3">{t(messages, 'about.visual.documents')}</span>
                <span className="bg-secondary/75 px-2 py-3">{t(messages, 'about.visual.sources')}</span>
                <span className="bg-secondary/75 px-2 py-3">{t(messages, 'about.visual.route')}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-base leading-7 text-slate-700">{t(messages, 'about.intro')}</p>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {sections.map((section, index) => {
                const Icon = icons[index % icons.length]
                return (
                  <article key={section.title} className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 text-lg font-bold leading-6 text-slate-950">{section.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{section.body}</p>
                  </article>
                )
              })}
            </div>
          </div>

          {principles.length ? (
            <aside className="min-w-0 rounded-lg border border-primary/15 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-tertiary text-secondary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="min-w-0 text-xl font-bold text-slate-950">{t(messages, 'about.principlesTitle')}</h2>
              </div>
              <ul className="mt-4 grid gap-3" role="list">
                {principles.map((principle) => (
                  <li key={principle} className="flex min-w-0 gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0">{principle}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </Container>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <Container>
          <div className="rounded-lg border border-primary/20 bg-primary px-5 py-5 text-sm font-semibold leading-6 text-white shadow-sm sm:px-6">
            {t(messages, 'about.closing')}
          </div>
        </Container>
      </section>
    </main>
  )
}
