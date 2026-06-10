// =============================================================================
// JsonLd — renders structured data as <script type="application/ld+json">.
// Pass a single schema object or an array; nulls are safely skipped.
// Use in every page alongside the JSON-LD generators from src/seo/schema/.
// =============================================================================

/**
 * Renders one or more JSON-LD scripts. Pass a single object or an array;
 * null/undefined entries are skipped.
 */
export default function JsonLd({data}) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean)
  if (!items.length) return null
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(item)}}
        />
      ))}
    </>
  )
}
