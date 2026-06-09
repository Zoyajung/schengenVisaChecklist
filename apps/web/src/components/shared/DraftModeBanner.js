// =============================================================================
// DraftModeBanner - sticky top banner shown only in draft/preview mode.
// Rendered by layout.js when draftMode().isEnabled is true.
// The "exit preview" link calls /api/draft-mode/disable which clears the cookie.
// =============================================================================

import {getMessages, t} from '@/messages'

/**
 * Shown only when Next.js Draft Mode is enabled (preview). Links to the
 * disable route to exit preview.
 */
export default function DraftModeBanner({locale = 'en'}) {
  const messages = getMessages(locale)

  return (
    <div className="sanity-draft-banner">
      {t(messages, 'draftMode.banner')} -{' '}
      {/* Full navigation to an API route clears draft mode and redirects. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/draft-mode/disable">
        {t(messages, 'draftMode.exit')}
      </a>
    </div>
  )
}
