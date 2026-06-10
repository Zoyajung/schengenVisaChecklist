import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Globe2,
  Landmark,
  LockKeyhole,
  MapPin,
  Plane,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import JsonLd from '@/components/shared/JsonLd'
import MotionReveal from '@/components/shared/MotionReveal'
import Container from '@/components/ui/Container'
import VisaChecklistForm from '@/components/checklist/VisaChecklistForm'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'
import {buildPageSchemas} from '@/seo/schema'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=82'

const TRUST_ITEMS = [
  {icon: Globe2, valueKey: 'home.trust.items.countries.value', labelKey: 'home.trust.items.countries.label'},
  {icon: RefreshCw, valueKey: 'home.trust.items.updated.value', labelKey: 'home.trust.items.updated.label'},
  {icon: Clock3, valueKey: 'home.trust.items.fast.value', labelKey: 'home.trust.items.fast.label'},
  {icon: ShieldCheck, valueKey: 'home.trust.items.secure.value', labelKey: 'home.trust.items.secure.label'},
]

const HOW_IT_WORKS = [
  {icon: MapPin, titleKey: 'home.howItWorks.items.details.title', bodyKey: 'home.howItWorks.items.details.body'},
  {icon: Sparkles, titleKey: 'home.howItWorks.items.generate.title', bodyKey: 'home.howItWorks.items.generate.body'},
  {icon: FileCheck2, titleKey: 'home.howItWorks.items.prepare.title', bodyKey: 'home.howItWorks.items.prepare.body'},
]

const FEATURES = [
  {icon: BadgeCheck, titleKey: 'home.features.items.personalized.title', bodyKey: 'home.features.items.personalized.body'},
  {icon: Landmark, titleKey: 'home.features.items.country.title', bodyKey: 'home.features.items.country.body'},
  {icon: Plane, titleKey: 'home.features.items.visaType.title', bodyKey: 'home.features.items.visaType.body'},
  {icon: Smartphone, titleKey: 'home.features.items.mobile.title', bodyKey: 'home.features.items.mobile.body'},
  {icon: RefreshCw, titleKey: 'home.features.items.updated.title', bodyKey: 'home.features.items.updated.body'},
  {icon: LockKeyhole, titleKey: 'home.features.items.reliable.title', bodyKey: 'home.features.items.reliable.body'},
]

const DESTINATIONS = [
  {
    key: 'germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=78',
  },
  {
    key: 'france',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=78',
  },
  {
    key: 'italy',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=78',
  },
  {
    key: 'spain',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=78',
  },
  {
    key: 'netherlands',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=78',
  },
  {
    key: 'switzerland',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=78',
  },
]

const TESTIMONIALS = ['consultant', 'traveler', 'family']
const FAQS = ['official', 'openai', 'sources', 'free']

async function loadHome() {
  const [settings, seo, countries, visaTypes] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: LANDING_PAGE_SEO_QUERY, params: {slug: '/'}, tags: ['landingPageSeo']}),
    sanityFetch({query: COUNTRIES_QUERY, tags: ['country']}),
    sanityFetch({query: VISA_TYPES_QUERY, tags: ['visaType']}),
  ])
  return {settings: settings || {}, seo, countries: countries || [], visaTypes: visaTypes || []}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const {settings, seo} = await loadHome()
  return buildMetadata({settings, doc: seo || {}, path: '/', locale, type: 'website'})
}

export default async function Home({params}) {
  const {locale} = await params
  const {settings, seo, countries, visaTypes} = await loadHome()
  const messages = getMessages(locale)
  const schemas = seo
    ? buildPageSchemas({
        page: seo,
        url: `${SITE_URL}${localizedPath(locale, '/')}`,
        settings,
        faqs: [],
        breadcrumbs: [],
      })
    : []

  return (
    <main className="bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_IMAGE}
            alt={t(messages, 'home.heroImageAlt')}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,28,51,0.88)_0%,rgba(7,28,51,0.68)_45%,rgba(7,28,51,0.3)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        <Container className="relative grid gap-8 pb-16 pt-10 sm:pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-24 lg:pt-20">
          <MotionReveal className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-tertiary" aria-hidden="true" />
              {t(messages, 'home.heroEyebrow')}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {t(messages, 'home.heroTitle')}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {t(messages, 'home.heroDescription')}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#checklist-generator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tertiary px-5 py-3 text-sm font-bold text-secondary shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white"
              >
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                {t(messages, 'home.primaryCta')}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {t(messages, 'home.secondaryCta')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-7 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
              {['official', 'mobile', 'private'].map((key) => (
                <span key={key} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-tertiary" aria-hidden="true" />
                  {t(messages, `home.heroTrust.${key}`)}
                </span>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal className="lg:justify-self-end" delay={0.12}>
            <div id="checklist-generator" className="scroll-mt-24">
              <VisaChecklistForm locale={locale} countries={countries} visaTypes={visaTypes} />
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="relative -mt-8 z-10">
        <Container>
          <MotionReveal className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map(({icon: Icon, valueKey, labelKey}) => (
              <div key={valueKey} className="rounded-md bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-slate-950">{t(messages, valueKey)}</p>
                    <p className="text-sm text-slate-600">{t(messages, labelKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </MotionReveal>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <MotionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-tertiary">{t(messages, 'home.howItWorks.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t(messages, 'home.howItWorks.title')}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{t(messages, 'home.howItWorks.description')}</p>
          </MotionReveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map(({icon: Icon, titleKey, bodyKey}, index) => (
              <MotionReveal key={titleKey} delay={index * 0.08}>
                <article className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-primary text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-tertiary">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{t(messages, titleKey)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(messages, bodyKey)}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <MotionReveal>
              <p className="text-sm font-bold text-tertiary">{t(messages, 'home.features.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t(messages, 'home.features.title')}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{t(messages, 'home.features.description')}</p>
              <Link
                href={localizedPath(locale, '/checklist')}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary"
              >
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                {t(messages, 'home.features.cta')}
              </Link>
            </MotionReveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({icon: Icon, titleKey, bodyKey}, index) => (
                <MotionReveal key={titleKey} delay={index * 0.05}>
                  <article className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-tertiary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-slate-950">{t(messages, titleKey)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{t(messages, bodyKey)}</p>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <MotionReveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-tertiary">{t(messages, 'home.destinations.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t(messages, 'home.destinations.title')}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{t(messages, 'home.destinations.description')}</p>
            </div>
            <Link href={localizedPath(locale, '/checklist')} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary transition hover:text-secondary">
              {t(messages, 'home.destinations.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </MotionReveal>

          <div className="premium-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {DESTINATIONS.map(({key, image}, index) => (
              <MotionReveal key={key} className="min-w-[82%] snap-start sm:min-w-0" delay={index * 0.04}>
                <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={image}
                      alt={t(messages, `home.destinations.items.${key}.alt`)}
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-950">{t(messages, `home.destinations.items.${key}.name`)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{t(messages, `home.destinations.items.${key}.body`)}</p>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-16 text-white sm:py-20">
        <Container>
          <MotionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-tertiary">{t(messages, 'home.testimonials.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t(messages, 'home.testimonials.title')}</h2>
            <p className="mt-4 text-base leading-7 text-white/70">{t(messages, 'home.testimonials.description')}</p>
          </MotionReveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((key, index) => (
              <MotionReveal key={key} delay={index * 0.08}>
                <figure className="h-full rounded-lg border border-white/20 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur">
                  <div className="flex gap-1 text-tertiary" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-5 text-sm leading-6 text-white/75">
                    {t(messages, `home.testimonials.items.${key}.quote`)}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-tertiary text-secondary">
                      <Users className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{t(messages, `home.testimonials.items.${key}.name`)}</span>
                      <span className="text-xs text-white/60">{t(messages, `home.testimonials.items.${key}.role`)}</span>
                    </span>
                  </figcaption>
                </figure>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <MotionReveal>
              <p className="text-sm font-bold text-tertiary">{t(messages, 'home.faq.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t(messages, 'home.faq.title')}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{t(messages, 'home.faq.description')}</p>
            </MotionReveal>

            <div className="grid gap-3">
              {FAQS.map((key, index) => (
                <MotionReveal key={key} delay={index * 0.05}>
                  <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm open:shadow-lg">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-950">
                      {t(messages, `home.faq.items.${key}.question`)}
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-50 text-primary transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t(messages, `home.faq.items.${key}.answer`)}</p>
                  </details>
                </MotionReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={schemas} />
    </main>
  )
}
