// =============================================================================
// FAQAccordion — accessible animated accordion for FAQ lists.
// Opens one item at a time; buttons use aria-expanded + aria-controls and the
// answer panels are properly hidden (aria-hidden) when collapsed.
// =============================================================================

'use client'
import {useState, useId} from 'react'
import {ChevronDown} from 'lucide-react'

/**
 * Reusable accordion for FAQ lists. Used by FAQSection and the in-body FAQ
 * block.
 * @param {{faqs:{question:string,answer:string}[]}} props
 */
export default function FAQAccordion({faqs = []}) {
  const [open, setOpen] = useState(null)
  const uid = useId()

  if (!faqs.length) return null

  return (
    <div className="grid gap-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        const btnId = `${uid}-btn-${i}`
        const panelId = `${uid}-panel-${i}`
        return (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-bold text-slate-950">{faq.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
