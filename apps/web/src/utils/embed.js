// =============================================================================
// Embed utilities — extract YouTube video IDs and build privacy-friendly embed
// URLs. Used by PtYouTube (Portable Text renderer) and VideoObject schema.
// =============================================================================

/** Extract an 11-char YouTube video id from common URL shapes. */
export function getYouTubeId(url) {
  if (!url) return null
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  )
  return m ? m[1] : null
}

/** Privacy-friendly embed URL for a YouTube link (falls back to the input). */
export function youTubeEmbedUrl(url) {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url
}
