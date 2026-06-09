// =============================================================================
// BlogEmptyState - full-width placeholder shown in the blog listing grid when
// no published posts exist. Prompts developers to create their first post in
// Sanity Studio.
// =============================================================================

import {FileText} from 'lucide-react'
import {getMessages, t} from '@/messages'

export default function BlogEmptyState({locale = 'en'}) {
  const messages = getMessages(locale)

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-slate-900 font-semibold text-lg mb-1">{t(messages, 'blog.emptyTitle')}</h3>
      <p className="text-slate-400 text-sm">{t(messages, 'blog.emptyDescription')}</p>
    </div>
  )
}
