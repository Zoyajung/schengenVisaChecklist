// ============================================================================
// Locale proxy (Next.js 16's renamed middleware) + redirect management.
// ----------------------------------------------------------------------------
// Two responsibilities, in order:
//
//   1. Editor-managed redirects (Sanity `redirect` docs). Best-effort: looked
//      up against a short-lived in-memory cache. The reliable slug-history path
//      is the per-document `oldSlugs` handling inside the page routes.
//   2. Locale prefixing — ensure every request lands under /<locale>/...
// ============================================================================

import {NextResponse} from 'next/server'
import {LOCALES, DEFAULT_LOCALE} from './i18n/config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

function getCanonicalOrigin() {
  if (!configuredSiteUrl || /^https?:\/\/localhost(?::\d+)?$/i.test(configuredSiteUrl)) return null
  try {
    return new URL(configuredSiteUrl).origin
  } catch {
    return null
  }
}

const canonicalOrigin = getCanonicalOrigin()

const STATIC_REDIRECTS = [
  {source: '/blogs', destination: '/blog', permanent: true},
  {source: '/faqs', destination: '/faq', permanent: true},
]

// --- redirect cache ---------------------------------------------------------
const REDIRECT_TTL = 60_000
let redirectCache = {at: 0, data: []}

async function getRedirects() {
  if (!projectId) return []
  const now = Date.now()
  if (now - redirectCache.at < REDIRECT_TTL) return redirectCache.data
  try {
    const query = '*[_type=="redirect" && enabled==true]{source,destination,"permanent":coalesce(permanent,true)}'
    const url = `https://${projectId}.apicdn.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`
    const res = await fetch(url)
    const json = await res.json()
    redirectCache = {at: now, data: Array.isArray(json.result) ? json.result : []}
  } catch {
    redirectCache = {at: now, data: redirectCache.data}
  }
  return redirectCache.data
}

function localeOf(pathname) {
  const seg = pathname.split('/')[1]
  return LOCALES.includes(seg) ? seg : null
}

function stripLocale(pathname) {
  const locale = localeOf(pathname)
  if (!locale) return pathname
  const rest = pathname.slice(locale.length + 1)
  return rest || '/'
}

function normalizePath(pathname) {
  const lower = pathname.toLowerCase()
  return lower === '/' ? '/' : lower.replace(/\/+$/, '')
}

function withCanonicalOrigin(requestUrl, targetPathname) {
  const url = requestUrl.clone()
  url.pathname = targetPathname
  if (canonicalOrigin && !isLocalHost(url.hostname)) {
    const canonical = new URL(canonicalOrigin)
    url.protocol = canonical.protocol
    url.host = canonical.host
  }
  return url
}

function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

function destinationFor(request, destination, locale) {
  if (/^https?:\/\//.test(destination)) return destination
  const path = destination.startsWith('/') ? destination : `/${destination}`
  const localized = localeOf(path) ? path : `/${locale}${path}`
  return withCanonicalOrigin(request.nextUrl, normalizePath(localized))
}

export async function proxy(request) {
  const {pathname} = request.nextUrl
  const normalizedPath = normalizePath(pathname)
  const requestOrigin = request.nextUrl.origin
  const needsOriginRedirect =
    canonicalOrigin && !isLocalHost(request.nextUrl.hostname) && requestOrigin !== canonicalOrigin
  const locale = localeOf(normalizedPath) || DEFAULT_LOCALE

  // 1. Static duplicate-route aliases for existing public landing pages.
  const barePath = stripLocale(normalizedPath).replace(/\/+$/, '') || '/'
  const staticHit = STATIC_REDIRECTS.find((r) => r.source === barePath)
  if (staticHit) {
    return NextResponse.redirect(
      destinationFor(request, staticHit.destination, locale),
      staticHit.permanent ? 308 : 307,
    )
  }

  // 2. Editor-managed redirects (match against the normalized locale-less path).
  const redirects = await getRedirects()
  const hit = redirects.find((r) => normalizePath(r.source || '/') === barePath && barePath !== '/')
  if (hit) {
    return NextResponse.redirect(destinationFor(request, hit.destination, locale), hit.permanent ? 308 : 307)
  }

  // 3. Canonical origin, lowercase, trailing slash, and locale prefixing.
  const hasLocalePrefix = LOCALES.some(
    (locale) => normalizedPath === `/${locale}` || normalizedPath.startsWith(`/${locale}/`),
  )
  const canonicalPath = hasLocalePrefix
    ? normalizedPath
    : normalizedPath === '/'
      ? `/${DEFAULT_LOCALE}`
      : `/${DEFAULT_LOCALE}${normalizedPath}`

  if (!needsOriginRedirect && canonicalPath === pathname) return

  return NextResponse.redirect(withCanonicalOrigin(request.nextUrl, canonicalPath), 308)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
