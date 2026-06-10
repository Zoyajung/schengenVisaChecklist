// =============================================================================
// Portable Text utilities — toPlainText for summaries/reading-time, and
// extractHeadings for the table of contents. Work on raw Portable Text arrays
// from Sanity without rendering to HTML.
// =============================================================================

import {slugify} from './format'

/** Flatten Portable Text to plain text (for summaries, reading time, etc). */
export function toPlainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b && b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join('\n\n')
}

/**
 * Extract headings for a table of contents.
 * @returns {{id:string,text:string,level:number}[]}
 */
export function extractHeadings(blocks, levels = [2, 3]) {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b) => b && b._type === 'block' && /^h[1-6]$/.test(b.style || ''))
    .map((b) => {
      const text = (b.children || []).map((c) => c.text || '').join('')
      return {id: b._key || slugify(text), text, level: Number(String(b.style).slice(1))}
    })
    .filter((h) => levels.includes(h.level))
}
