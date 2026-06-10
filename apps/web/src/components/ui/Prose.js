// =============================================================================
// Prose — applies @tailwindcss/typography prose styles to arbitrary HTML
// content. Used around rendered Portable Text blocks.
// =============================================================================

export default function Prose({children, className = ''}) {
  return <div className={`ds-prose max-w-none ${className}`}>{children}</div>
}

