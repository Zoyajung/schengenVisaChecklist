// =============================================================================
// Draft mode — disable  /api/draft-mode/disable
// Clears the Next.js draft cookie and redirects back to the page (or /).
// Called by the DraftModeBanner "Exit preview" button.
// =============================================================================

import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

export async function GET(request) {
  ;(await draftMode()).disable()
  const url = new URL(request.url)
  const to = url.searchParams.get('redirect') || '/'
  return NextResponse.redirect(new URL(to, url.origin))
}
