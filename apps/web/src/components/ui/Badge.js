// =============================================================================
// Badge — small colour chip for category labels, status tags, and other inline
// identifiers. Pass color to override the default primary colour.
// =============================================================================

export default function Badge({children, className = ''}) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary ${className}`}
    >
      {children}
    </span>
  )
}

