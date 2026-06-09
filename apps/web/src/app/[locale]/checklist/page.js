import {sanityFetch} from '@/sanity/lib/fetch'
import {COUNTRIES_QUERY, SITE_SETTINGS_QUERY, VISA_TYPES_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import Container from '@/components/ui/Container'
import VisaChecklistForm from '@/components/checklist/VisaChecklistForm'
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
    <main className="min-h-screen bg-slate-50">
      <Container className="py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t(messages, 'checklist.heroEyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{t(messages, 'checklist.heroTitle')}</h1>
          <p className="mt-3 text-slate-600">{t(messages, 'checklist.heroDescription')}</p>
          <div className="mt-6">
            <VisaChecklistForm locale={locale} countries={countries} visaTypes={visaTypes} />
          </div>
        </div>
      </Container>
    </main>
  )
}
