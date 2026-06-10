import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {readToken, isSanityConfigured} from '@/sanity/lib/config'

// ─── Presentation-tool handler (validates the Sanity preview URL secret) ─────
const presentationHandler =
  isSanityConfigured && readToken
    ? defineEnableDraftMode({client: client.withConfig({token: readToken})}).GET
    : null

// ─── Simple shared-secret fallback ───────────────────────────────────────────
// Allows direct preview links of the form:
//   /api/draft-mode/enable?secret=<SANITY_PREVIEW_SECRET>&redirect=/en/blog/my-post
// Useful for PreviewPane links in the Studio editor and manual testing.
//
// IMPORTANT: use NextResponse.redirect() — NOT redirect() from next/navigation.
// redirect() throws a special error that Next.js catches internally, but the
// draft-mode Set-Cookie header may not be flushed before the redirect response
// is sent in Route Handlers. NextResponse.redirect() returns a real Response
// object so the cookie is always included in the redirect's response headers.
async function sharedSecretHandler(request) {
  const {searchParams} = new URL(request.url)
  const secret = searchParams.get('secret')
  const redirectTo = searchParams.get('redirect') || '/'

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new Response('SANITY_PREVIEW_SECRET is not configured.', {status: 412})
  }
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', {status: 401})
  }

  ;(await draftMode()).enable()
  // Resolve the redirect path against this request's origin so relative paths
  // (/en/blog/my-post) become absolute URLs (http://localhost:3000/en/...).
  const base = new URL(request.url)
  return NextResponse.redirect(new URL(redirectTo, base.origin))
}

export async function GET(request) {
  if (!isSanityConfigured) {
    return new Response('Sanity is not configured.', {status: 412})
  }
  if (!readToken) {
    return new Response('Draft mode is not configured (missing SANITY_API_READ_TOKEN).', {status: 412})
  }

  // If a plain `secret` param is present, use the simple shared-secret path.
  // Otherwise delegate to the Presentation-tool handler (validatePreviewUrl).
  const {searchParams} = new URL(request.url)
  if (searchParams.has('secret')) {
    return sharedSecretHandler(request)
  }

  if (!presentationHandler) {
    return new Response('Presentation handler not configured (missing token or project id).', {status: 412})
  }
  return presentationHandler(request)
}
