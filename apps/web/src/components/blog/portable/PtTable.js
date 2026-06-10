// =============================================================================
// Portable Text table block — renders row/cell arrays as a responsive HTML table.
// =============================================================================

export default function PtTable({value}) {
  const rows = value?.rows || []
  if (!rows.length) return null
  const [head, ...body] = value.hasHeaderRow ? rows : [null, ...rows]

  return (
    <figure className="my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {head ? (
          <thead>
            <tr className="border-b-2 border-slate-200">
              {(head.cells || []).map((cell, i) => (
                <th key={i} className="text-left font-semibold text-slate-900 py-2 pr-4">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-slate-100">
              {(row?.cells || []).map((cell, c) => (
                <td key={c} className="py-2 pr-4 text-slate-600 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {value.caption ? (
        <figcaption className="text-sm text-slate-600 mt-2">{value.caption}</figcaption>
      ) : null}
    </figure>
  )
}

