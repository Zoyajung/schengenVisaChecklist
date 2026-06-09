// =============================================================================
// Divider — horizontal rule with an optional centred label. Used to visually
// separate sections within a page or article.
// =============================================================================

export default function Divider({style = 'line'}) {
  if (style === 'space') return <div className="h-10" aria-hidden />
  if (style === 'dots') {
    return (
      <div className="my-8 text-center text-slate-500 tracking-[0.5em] select-none" aria-hidden>
        â€¢ â€¢ â€¢
      </div>
    )
  }
  return <hr className="my-8 border-t border-slate-200" />
}

