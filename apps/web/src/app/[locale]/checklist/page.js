import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import ChecklistWorkspace from '@/components/checklist/ChecklistWorkspace'
import {getMessages, t} from '@/messages'

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
      title: t(messages, 'checklist.workspace.title'),
      seo: {metaDescription: t(messages, 'checklist.workspace.description')},
    },
    path: '/checklist',
    locale,
  })
}

export default async function ChecklistPage({params}) {
  const {locale} = await params
  const {countries, visaTypes} = await loadChecklistPage()

  return <ChecklistWorkspace locale={locale} countries={countries} visaTypes={visaTypes} />
}
