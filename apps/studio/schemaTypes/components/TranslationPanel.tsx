import {useMemo, useState} from 'react'
import {useToast} from '@sanity/ui'
import {useClient, useFormValue} from 'sanity'

const API_VERSION = '2025-01-01'

const LANGUAGE_OPTIONS = [
  {title: 'English', value: 'en'},
  {title: 'French', value: 'fr'},
  {title: 'German', value: 'de'},
  {title: 'Arabic', value: 'ar'},
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

const clone = <T,>(value: T): T | undefined => {
  if (value === undefined || value === null) return undefined
  return JSON.parse(JSON.stringify(value)) as T
}

const cleanObject = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T

function createTranslationGroup(id: string | undefined) {
  const baseId = id?.replace(/^drafts\./, '')
  return baseId ? `blog-${baseId}` : `blog-${Date.now().toString(36)}`
}

/**
 * Blog translation helper for the document-level localization workflow:
 * copy translatable JSON, translate it outside Studio, then generate a linked
 * draft that reuses shared assets/references from the source post.
 */
export function TranslationPanel() {
  const client = useClient({apiVersion: API_VERSION})
  const toast = useToast()
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [translatedJson, setTranslatedJson] = useState('')
  const [busy, setBusy] = useState(false)

  const id = useFormValue(['_id']) as string | undefined
  const title = useFormValue(['title']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const language = (useFormValue(['language']) as string | undefined) || 'en'
  const sourceTranslationGroup = useFormValue(['translationGroup']) as string | undefined
  const translationGroup = sourceTranslationGroup || createTranslationGroup(id)

  const source = {
    title,
    slug,
    tags: useFormValue(['tags']),
    body: useFormValue(['body']),
    faq: useFormValue(['faq']),
    seo: useFormValue(['seo']),
    aiSeo: useFormValue(['aiSeo']),
  }

  const shared = {
    featuredImage: useFormValue(['featuredImage']),
    author: useFormValue(['author']),
    category: useFormValue(['category']),
    tocEnabled: useFormValue(['tocEnabled']),
    schemaConfig: useFormValue(['schemaConfig']),
    publishedAt: useFormValue(['publishedAt']),
    publishAt: useFormValue(['publishAt']),
    unpublishAt: useFormValue(['unpublishAt']),
    featured: useFormValue(['featured']),
    priority: useFormValue(['priority']),
    visibility: useFormValue(['visibility']),
  }

  const sourceJson = useMemo(
    () =>
      JSON.stringify(
        cleanObject({
          title: source.title,
          slug: source.slug,
          tags: clone(source.tags),
          body: clone(source.body),
          faq: clone(source.faq),
          seo: clone(source.seo),
          aiSeo: clone(source.aiSeo),
        }),
        null,
        2,
      ),
    [source.aiSeo, source.body, source.faq, source.seo, source.slug, source.tags, source.title],
  )

  async function copySourceJson() {
    await navigator.clipboard.writeText(sourceJson)
    toast.push({status: 'success', title: 'Source JSON copied'})
  }

  async function createTranslatedDraft() {
    if (!id) {
      toast.push({status: 'error', title: 'Save this post before creating translations'})
      return
    }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(translatedJson) as Record<string, unknown>
    } catch {
      toast.push({status: 'error', title: 'Translated JSON is not valid'})
      return
    }

    const baseId = id.replace(/^drafts\./, '')
    if (targetLanguage === language) {
      toast.push({status: 'error', title: 'Choose a different target language'})
      return
    }

    setBusy(true)
    try {
      if (!sourceTranslationGroup) {
        await client.patch(id).setIfMissing({translationGroup}).commit()
      }

      const translatedTitle = typeof payload.title === 'string' ? payload.title : title || 'Untitled'
      const draftId = `drafts.${baseId}-${targetLanguage}`
      const publishedTargetId = `${baseId}-${targetLanguage}`
      const existingTranslation = await client.fetch<{_id: string; title?: string} | null>(
        `*[
          _type == "blogPost" &&
          translationGroup == $translationGroup &&
          coalesce(language, "en") == $language
        ][0]{_id,title}`,
        {translationGroup, language: targetLanguage},
      )
      const baseSlug = slugify(translatedTitle) || slugify(title || 'blog-post')
      const requestedSlug = baseSlug.endsWith(`-${targetLanguage}`) ? baseSlug : `${baseSlug}-${targetLanguage}`
      const slugCount = await client.fetch<number>(
        `count(*[
          _type == "blogPost" &&
          slug.current == $slug &&
          !(_id in [$draftId, $publishedTargetId])
        ])`,
        {slug: requestedSlug, draftId, publishedTargetId},
      )
      const finalSlug = slugCount > 0 ? `${requestedSlug}-${slugCount + 1}` : requestedSlug
      const sourceSeo = (source.seo || {}) as Record<string, unknown>
      const translatedSeo = ((payload.seo || {}) as Record<string, unknown>) || {}

      const doc = cleanObject({
        _type: 'blogPost',
        _id: draftId,
        title: translatedTitle,
        slug: {_type: 'slug', current: finalSlug},
        language: targetLanguage,
        translationGroup,
        sourceLanguage: language,
        sourceDocument: {_type: 'reference', _ref: baseId},
        tags: clone(payload.tags ?? source.tags),
        body: clone(payload.body ?? source.body),
        faq: clone(payload.faq ?? source.faq),
        seo: cleanObject({
          metaTitle: translatedSeo.metaTitle ?? sourceSeo.metaTitle,
          metaDescription: translatedSeo.metaDescription ?? sourceSeo.metaDescription,
          ogImage: clone(sourceSeo.ogImage),
        }),
        aiSeo: clone(payload.aiSeo ?? source.aiSeo),
        featuredImage: clone(shared.featuredImage),
        author: clone(shared.author),
        category: clone(shared.category),
        tocEnabled: shared.tocEnabled ?? true,
        schemaConfig: clone(shared.schemaConfig),
        publishedAt: shared.publishedAt,
        publishAt: shared.publishAt,
        unpublishAt: shared.unpublishAt,
        featured: shared.featured ?? false,
        priority: shared.priority,
        visibility: shared.visibility ?? true,
        status: 'draft',
      })

      const created = await client.createOrReplace(doc)
      toast.push({
        status: 'success',
        title: existingTranslation ? 'Translated draft updated' : 'Translated draft created',
        description: created._id,
      })
      setTranslatedJson('')
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Could not create translated draft',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ds-panel ds-translation">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Translations</span>
        <span className="ds-badge" data-state="ok">
          {language.toUpperCase()} source
        </span>
      </div>

      <div className="ds-translation__body">
        <p className="ds-translation__help">
          Copy the source JSON, translate only the text values, then paste the translated JSON below.
          Shared fields such as images, author, category, schema config, and publish settings are copied automatically.
        </p>

        <div className="ds-translation__actions">
          <button className="ds-button" type="button" onClick={copySourceJson}>
            Copy source JSON
          </button>
          <label className="ds-translation__select">
            <span>Target language</span>
            <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <textarea
          className="ds-translation__textarea"
          value={translatedJson}
          onChange={(event) => setTranslatedJson(event.target.value)}
          placeholder="Paste translated JSON here"
          rows={14}
        />

        <button
          className="ds-button ds-button--primary"
          type="button"
          disabled={busy || !translatedJson.trim()}
          onClick={createTranslatedDraft}
        >
          {busy ? 'Creating draft...' : 'Create translated draft'}
        </button>
      </div>
    </div>
  )
}

export default TranslationPanel
