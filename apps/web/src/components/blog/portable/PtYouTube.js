// =============================================================================
// Portable Text YouTube block — renders a click-to-load embed so YouTube's
// scripts do not block the initial article render.
// =============================================================================

import {getYouTubeId} from '@/utils/embed'
import LiteYouTube from './LiteYouTube'

export default function PtYouTube({value, locale = 'en'}) {
  if (!value?.url) return null
  const id = getYouTubeId(value.url)
  if (!id) return null

  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
        <LiteYouTube id={id} title={value.title} url={value.url} locale={locale} />
      </div>
      {value.title ? <figcaption className="text-center text-sm text-slate-600 mt-2">{value.title}</figcaption> : null}
    </figure>
  )
}

