// Compact list component for the "Key Takeaways" box under blog content.
// Kept separate so articles can opt into the AI/SEO summary block only when
// the CMS provides takeaway items.

import {Check} from 'lucide-react'
import {getMessages, t} from '@/messages'

export default function BlogKeyTakeaways({items = [], locale = 'en'}) {
  if (!items?.length) return null
  const messages = getMessages(locale)
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-3">{t(messages, 'aiSeo.keyTakeaways')}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-slate-700">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
