import {revalidateTag} from 'next/cache'
import {parseBody} from 'next-sanity/webhook'

// ============================================================================
// Sanity webhook -> on-demand revalidation. Configure a webhook in Sanity that
// POSTs here with a GROQ projection of `{_type, "slug": slug.current}` and a
// signed webhook secret matching SANITY_REVALIDATE_SECRET. Content updates
// appear without a redeploy. All content types are tagged by `_type` in
// sanityFetch().
// ============================================================================

function tagsFor(type, slug) {
  const tags = new Set([type])
  if (slug) tags.add(`${type}:${slug}`)

  // Referenced content is rendered into blog cards, article headers, metadata,
  // JSON-LD, and sitemaps. Revalidate dependent query tags as well.
  if (type === 'author' || type === 'category') tags.add('blogPost')
  if (type === 'faqItem') tags.add('landingPageSeo')
  if (type === 'redirect') tags.add('redirect')

  return [...tags]
}

export async function POST(request) {
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    console.error('[revalidate] SANITY_REVALIDATE_SECRET is not configured')
    return new Response(JSON.stringify({message: 'Revalidation is not configured'}), {status: 412})
  }

  try {
    const {isValidSignature, body} = await parseBody(request, process.env.SANITY_REVALIDATE_SECRET, true)

    if (!isValidSignature) {
      return new Response(JSON.stringify({message: 'Invalid signature'}), {status: 401})
    }

    const type = body?._type
    if (!type) {
      return new Response(JSON.stringify({message: 'Bad request: missing _type'}), {status: 400})
    }

    const slug = body?.slug?.current || body?.slug
    const tags = tagsFor(type, slug)
    for (const tag of tags) revalidateTag(tag)

    return Response.json({revalidated: true, type, slug: slug || null, tags, now: Date.now()})
  } catch (err) {
    console.error('[revalidate] error:', err)
    return new Response(JSON.stringify({message: 'Error revalidating'}), {status: 500})
  }
}
