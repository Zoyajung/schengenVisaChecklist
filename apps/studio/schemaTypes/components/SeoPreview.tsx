import {useFormValue, useClient} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'

const SITE_ORIGIN = (process.env.SANITY_STUDIO_PREVIEW_URL || 'https://example.com').replace(/^https?:\/\//, '')

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

/**
 * Resolve a Sanity image value (from useFormValue) to a CDN URL string,
 * or return null if no asset is attached yet.
 */
function useSanityImageUrl(image: unknown): string | null {
  const client = useClient({apiVersion: '2024-01-01'})
  if (!image || typeof image !== 'object') return null
  const img = image as Record<string, unknown>
  if (!img.asset) return null
  try {
    return imageUrlBuilder(client).image(img).width(600).height(315).fit('crop').url()
  } catch {
    return null
  }
}

/**
 * Social card image slot — shows the OG image when available,
 * falls back to the branded placeholder.
 */
function SocialImage({src}: {src: string | null}) {
  if (src) {
    return (
      <div className="ds-social__img" style={{backgroundImage: 'none', padding: 0}}>
        <img
          src={src}
          alt="OG preview"
          style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
        />
      </div>
    )
  }
  return <div className="ds-social__img" />
}

/**
 * Live Google + social previews. Reads metaTitle / metaDescription / ogImage
 * (+ featuredImage fallback for blog posts) — all three platforms in one panel.
 */
export function SeoPreview() {
  const title = (useFormValue(['title']) as string) || ''
  const slug = (useFormValue(['slug', 'current']) as string) || ''
  const seo = (useFormValue(['seo']) as Record<string, unknown>) || {}
  const featuredImage = useFormValue(['featuredImage'])
  const type = useFormValue(['_type'])

  const base = type === 'blogPost' ? '/blog/' : '/'
  const url = `${SITE_ORIGIN}${base}${slug}`.replace(/\/+$/, '') || SITE_ORIGIN

  const metaTitle = (seo.metaTitle as string) || title || 'Untitled'
  const metaDesc = (seo.metaDescription as string) || 'No description set.'

  // ogImage > featuredImage fallback (blog posts use featured image for social)
  const ogImageValue = seo.ogImage || featuredImage
  const ogImageUrl = useSanityImageUrl(ogImageValue)

  return (
    <div className="ds-panel ds-seopreview">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Search &amp; Social Preview</span>
      </div>

      {/* Google */}
      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Google</div>
        <div className="ds-google">
          <div className="ds-google__url">{url}</div>
          <div className="ds-google__title">{truncate(metaTitle, 60)}</div>
          <div className="ds-google__desc">{truncate(metaDesc, 160)}</div>
        </div>
      </div>

      {/* Facebook / OpenGraph */}
      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Facebook / OpenGraph</div>
        <div className="ds-social">
          <SocialImage src={ogImageUrl} />
          <div className="ds-social__body">
            <div className="ds-social__domain">{SITE_ORIGIN}</div>
            <div className="ds-social__title">{truncate(metaTitle, 70)}</div>
            <div className="ds-social__desc">{truncate(metaDesc, 110)}</div>
          </div>
        </div>
      </div>

      {/* Twitter / X */}
      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Twitter / X</div>
        <div className="ds-social ds-social--twitter">
          <SocialImage src={ogImageUrl} />
          <div className="ds-social__body">
            <div className="ds-social__title">{truncate(metaTitle, 70)}</div>
            <div className="ds-social__desc">{truncate(metaDesc, 110)}</div>
            <div className="ds-social__domain">{SITE_ORIGIN}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeoPreview
