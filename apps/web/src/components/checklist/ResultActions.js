'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {Check, Copy, FileDown, Flag, RotateCcw} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

export default function ResultActions({locale = 'en', slug}) {
  const messages = getMessages(locale)
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef(null)

  useEffect(() => () => {
    window.clearTimeout(noticeTimer.current)
  }, [])

  function showNotice(message) {
    setNotice(message)
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2500)
  }

  function copyWithFallback(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.left = '-9999px'
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    document.body.append(textarea)
    textarea.focus()
    textarea.select()
    const copied = document.execCommand('copy')
    textarea.remove()
    if (!copied) throw new Error('Copy command failed')
  }

  async function copyLink() {
    try {
      const url = window.location.href
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        copyWithFallback(url)
      }
      showNotice(t(messages, 'result.actions.copied'))
    } catch {
      showNotice(t(messages, 'result.actions.copyFailed'))
    }
  }

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {notice === t(messages, 'result.actions.copied') ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {t(messages, 'result.actions.copy')}
        </button>
        <a href={`/api/result/${encodeURIComponent(slug || '')}/pdf`} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <FileDown className="h-4 w-4" aria-hidden="true" />
          {t(messages, 'result.actions.pdf')}
        </a>
        <Link href={localizedPath(locale, '/checklist')} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t(messages, 'result.actions.startOver')}
        </Link>
        <Link href={localizedPath(locale, `/contact?result=${encodeURIComponent(slug || '')}`)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Flag className="h-4 w-4" aria-hidden="true" />
          {t(messages, 'result.actions.report')}
        </Link>
      </div>
      {notice ? (
        <p className="mt-2 text-sm font-medium text-slate-600" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}
    </div>
  )
}
