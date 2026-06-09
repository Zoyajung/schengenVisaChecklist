import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import JsonLd from '@/components/shared/JsonLd'
import Container from '@/components/ui/Container'
import VisaChecklistForm from '@/components/checklist/VisaChecklistForm'
import FlyingPlanes from '@/components/checklist/FlyingPlanes'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'
import {buildPageSchemas} from '@/seo/schema'

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
    <main className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#dff7ed_0,#ffffff_34%,#f8fafc_100%)]">
        <FlyingPlanes />
        <Container className="relative py-8 lg:py-12">
          <div className="mx-auto max-w-4xl rounded-lg bg-white/70 p-3 shadow-2xl shadow-slate-900/5 backdrop-blur sm:p-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t(messages, 'checklist.heroEyebrow')}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {t(messages, 'home.heroTitle')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              {t(messages, 'home.heroDescription')}
            </p>
            <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {t(messages, 'checklist.trustNote')}
            </p>
            <div className="mt-6">
              <VisaChecklistForm locale={locale} countries={countries} visaTypes={visaTypes} />
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={schemas} />
    </main>
  )
}
