import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import JsonLd from '@/components/shared/JsonLd'
import ChecklistWorkspace from '@/components/checklist/ChecklistWorkspace'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
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
    <>
      <ChecklistWorkspace locale={locale} countries={countries} visaTypes={visaTypes} />
      <JsonLd data={schemas} />
    </>
  )
}
