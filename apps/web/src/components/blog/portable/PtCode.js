// =============================================================================
// Portable Text code block — renders syntax-highlighted fenced code with an optional
// filename header. Uses plain HTML <pre>/<code> (no external highlight library).
// =============================================================================

export default function PtCode({value}) {
  if (!value?.code) return null
  return (
    <figure className="my-8">
      {value.filename ? (
        <div className="bg-slate-800 text-slate-300 text-xs font-mono px-4 py-2 rounded-t-lg border-b border-slate-700">
          {value.filename}
        </div>
      ) : null}
      <pre
        className={`bg-slate-900 text-slate-100 text-sm font-mono p-4 overflow-x-auto ${
          value.filename ? 'rounded-b-lg' : 'rounded-lg'
        }`}
      >
        <code>{value.code}</code>
      </pre>
    </figure>
  )
}

