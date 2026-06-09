'use client'

// Lightweight YouTube embed that shows a thumbnail first and only mounts the
// iframe after user interaction. This avoids eager third-party loading during
// initial page render.

import {useState} from 'react'
import {Play} from 'lucide-react'
import {youTubeEmbedUrl} from '@/utils/embed'
import {getMessages, t} from '@/messages'

export default function LiteYouTube({id, title, url, locale = 'en'}) {
  const [loaded, setLoaded] = useState(false)
  const messages = getMessages(locale)
  const label = title ? t(messages, 'video.playWithTitle', {title}) : t(messages, 'video.play')
  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  if (loaded) {
    return (
      <iframe
        src={`${youTubeEmbedUrl(url)}?autoplay=1`}
        title={title || t(messages, 'video.title')}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setLoaded(true)}
      className="absolute inset-0 h-full w-full overflow-hidden bg-slate-900 text-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="h-full w-full object-cover opacity-80"
      />
      <span className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <Play className="h-6 w-6 translate-x-0.5 fill-current" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}
