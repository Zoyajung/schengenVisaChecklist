// =============================================================================
// useTableOfContents — IntersectionObserver scroll-spy hook. Pass heading
// list from extractHeadings(); returns the id of the heading currently in view.
// =============================================================================

'use client'
import {useEffect, useState} from 'react'

/**
 * Scroll-spy for a table of contents. Pass the heading list from
 * extractHeadings(); returns the id of the heading currently in view.
 *
 * @param {{id:string}[]} headings
 * @returns {string|null}
 */
export function useTableOfContents(headings = []) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (!headings.length) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      {rootMargin: '0px 0px -70% 0px', threshold: 0.1},
    )
    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  return activeId
}

export default useTableOfContents

