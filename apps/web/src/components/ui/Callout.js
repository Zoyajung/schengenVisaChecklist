// Reusable callout block with tone-based variants for informational, success,
// warning, and danger content.

import {Info, CheckCircle, AlertTriangle, AlertCircle} from 'lucide-react'

const TONES = {
  info:    {cls: 'border-blue-400 bg-blue-50 text-blue-900',     Icon: Info},
  success: {cls: 'border-emerald-400 bg-emerald-50 text-emerald-900', Icon: CheckCircle},
  warning: {cls: 'border-amber-400 bg-amber-50 text-amber-900',   Icon: AlertTriangle},
  danger:  {cls: 'border-red-400 bg-red-50 text-red-900',         Icon: AlertCircle},
}

export default function Callout({tone = 'info', title, children}) {
  const {cls, Icon} = TONES[tone] || TONES.info
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-6 ${cls}`}>
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 mt-0.5 shrink-0 opacity-80" aria-hidden="true" />
        <div className="min-w-0">
          {title ? <p className="font-semibold mb-1">{title}</p> : null}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
