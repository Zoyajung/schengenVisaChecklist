// =============================================================================
// Container — centered max-width layout wrapper. Use s prop to change the
// element (div, section, header…). Width + padding consistent across all pages.
// =============================================================================

export default function Container({children, className = '', as: Tag = 'div'}) {
  return <Tag className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>
}

