// =============================================================================
// Portable Text image block — renders Sanity images with LQIP blur placeholder,
// caption, and responsive sizing via Next.js <Image>.
// =============================================================================

import Image from 'next/image'
import {imageUrl} from '@/sanity/lib/image'

export default function PtImage({value}) {
  if (!value?.url) return null
  const w = value.dimensions?.width || 1200
  const h = value.dimensions?.height || 800
  return (
    <figure className="my-8">
      <Image
        src={imageUrl(value, {width: 1200})}
        alt={value.alt || ''}
        width={w}
        height={h}
        className="rounded-xl w-full h-auto"
        sizes="(max-width: 768px) 100vw, 768px"
        loading="lazy"
        placeholder={value.lqip ? 'blur' : 'empty'}
        blurDataURL={value.lqip || undefined}
      />
      {value.caption ? (
        <figcaption className="text-center text-sm text-slate-600 mt-2">{value.caption}</figcaption>
      ) : null}
    </figure>
  )
}
