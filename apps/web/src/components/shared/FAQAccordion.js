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
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        const btnId = `${uid}-btn-${i}`
        const panelId = `${uid}-panel-${i}`
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-medium text-slate-900">{faq.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              <p className="pb-5 -mt-1 text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
