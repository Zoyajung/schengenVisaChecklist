import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {GENERATED_RESULTS_REVIEW_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import Container from '@/components/ui/Container'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

export async function generateMetadata({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  const metadata = buildMetadata({
    settings,
    doc: {title: t(messages, 'admin.reviewTitle'), seo: {metaDescription: t(messages, 'admin.reviewDescription')}},
    path: '/admin/review-results',
    locale,
  })
  metadata.robots = {index: false, follow: false}
  return metadata
}

export default async function ReviewResultsPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const results = (await sanityFetch({query: GENERATED_RESULTS_REVIEW_QUERY, tags: ['generatedResult'], revalidate: 30})) || []

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-950">{t(messages, 'admin.reviewTitle')}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">{t(messages, 'admin.reviewDescription')}</p>
        </div>

        {results.length ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Indexable</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((result) => (
                  <tr key={result._id}>
                    <td className="px-4 py-3">
                      <Link href={localizedPath(locale, `/result/${result.slug}`)} className="font-medium text-primary hover:underline">
                        {result.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{result.status}</td>
                    <td className="px-4 py-3 capitalize text-slate-700">{result.confidenceLevel}</td>
                    <td className="px-4 py-3 text-slate-700">{result.indexable ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-slate-500">{result.createdDate ? new Date(result.createdDate).toLocaleString('en') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">{t(messages, 'admin.empty')}</p>
        )}
      </Container>
    </main>
  )
}
