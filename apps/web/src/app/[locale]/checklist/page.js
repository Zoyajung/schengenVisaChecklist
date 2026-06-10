import Image from 'next/image'
import {Clock3, FileCheck2, Globe2, ShieldCheck} from 'lucide-react'
import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import MotionReveal from '@/components/shared/MotionReveal'
import Container from '@/components/ui/Container'
import VisaChecklistForm from '@/components/checklist/VisaChecklistForm'
import {getMessages, t} from '@/messages'

const CHECKLIST_IMAGE = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1500&q=80'

const TRUST_POINTS = [
  {icon: Globe2, key: 'home.heroTrust.official'},
  {icon: Clock3, key: 'home.heroTrust.mobile'},
  {icon: ShieldCheck, key: 'home.heroTrust.private'},
]

async function loadChecklistPage() {
  const [countries, visaTypes] = await Promise.all([
    sanityFetch({query: COUNTRIES_QUERY, tags: ['country']}),
    sanityFetch({query: VISA_TYPES_QUERY, tags: ['visaType']}),
  ])
  return {countries: countries || [], visaTypes: visaTypes || []}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  return buildMetadata({
    settings,
    doc: {
      title: t(messages, 'checklist.heroTitle'),
      seo: {metaDescription: t(messages, 'checklist.heroDescription')},
    },
    path: '/checklist',
    locale,
  })
}

export default async function ChecklistPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const {countries, visaTypes} = await loadChecklistPage()

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={CHECKLIST_IMAGE}
            alt={t(messages, 'checklist.heroImageAlt')}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,28,51,0.9)_0%,rgba(7,28,51,0.72)_52%,rgba(7,28,51,0.38)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        <Container className="grid gap-8 pb-16 pt-10 sm:pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-24 lg:pt-20">
          <MotionReveal className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
              <FileCheck2 className="h-4 w-4 text-tertiary" aria-hidden="true" />
              {t(messages, 'checklist.heroEyebrow')}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.06] text-white sm:text-5xl">
              {t(messages, 'checklist.heroTitle')}
            </h1>
            <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
              {t(messages, 'checklist.heroDescription')}
            </p>
            <div className="mt-7 grid gap-3 text-sm text-white/75">
              {TRUST_POINTS.map(({icon: Icon, key}) => (
                <span key={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-tertiary" aria-hidden="true" />
                  {t(messages, key)}
                </span>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <VisaChecklistForm locale={locale} countries={countries} visaTypes={visaTypes} />
          </MotionReveal>
        </Container>
      </section>
    </main>
  )
}
