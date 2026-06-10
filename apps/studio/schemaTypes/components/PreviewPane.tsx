import {useFormValue} from 'sanity'

const ORIGIN = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET || ''
const LOCALE = 'en'

function pathFor(type: string, slug: string): string {
  if (type === 'blogPost') return `/blog/${slug}`
  if (type === 'category') return `/blog/category/${slug}`
  if (type === 'author') return `/author/${slug}`
  if (type === 'landingPageSeo') return slug === '/' ? '/' : `/${slug}`
  return '/'
}

/**
 * Editor preview panel: generated URL, draft preview link, status and last
 * published time.
 */
export function PreviewPane() {
  const type = useFormValue(['_type']) as string
  const slug = (useFormValue(['slug', 'current']) as string) || ''
  const status = (useFormValue(['status']) as string) || '—'
  const updatedAt = useFormValue(['_updatedAt']) as string | undefined

  const path = pathFor(type, slug)
  const liveUrl = `${ORIGIN}/${LOCALE}${path === '/' ? '' : path}`
  const draftUrl = `${ORIGIN}/api/draft-mode/enable?secret=${SECRET}&redirect=${encodeURIComponent(`/${LOCALE}${path === '/' ? '' : path}`)}`
  const canResolve = Boolean(slug)

  return (
    <div className="ds-panel ds-previewpane">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Preview</span>
        <span className="ds-badge" data-state={status === 'published' ? 'ok' : 'off'}>{status}</span>
      </div>
      <dl className="ds-previewpane__grid">
        <dt>Generated URL</dt>
        <dd>{canResolve ? <a href={liveUrl} target="_blank" rel="noreferrer">{liveUrl}</a> : <em>set a slug</em>}</dd>

        <dt>Draft preview</dt>
        <dd>{canResolve ? <a href={draftUrl} target="_blank" rel="noreferrer">Open draft preview</a> : <em>set a slug</em>}</dd>

        <dt>Last published</dt>
        <dd>{updatedAt ? new Date(updatedAt).toLocaleString() : '—'}</dd>
      </dl>
    </div>
  )
}

export default PreviewPane
