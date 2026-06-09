import {Plane} from 'lucide-react'

const PLANES = [
  {top: '14%', delay: '0s', duration: '18s', size: 'h-5 w-5', opacity: 'opacity-25'},
  {top: '42%', delay: '5s', duration: '24s', size: 'h-4 w-4', opacity: 'opacity-20'},
  {top: '70%', delay: '11s', duration: '21s', size: 'h-6 w-6', opacity: 'opacity-15'},
]

export default function FlyingPlanes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-25 motion-reduce:hidden" viewBox="0 0 1200 500" preserveAspectRatio="none">
        <path
          d="M-40 360 C 180 210, 320 430, 520 260 S 850 110, 1240 230"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 12"
          className="text-primary"
        />
        <path
          d="M-20 150 C 170 50, 360 180, 520 120 S 840 20, 1220 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 14"
          className="text-slate-300"
        />
      </svg>
      {PLANES.map((plane, index) => (
        <Plane
          key={index}
          className={`absolute -left-10 ${plane.size} ${plane.opacity} text-primary motion-reduce:hidden`}
          style={{
            top: plane.top,
            animation: `fly-across ${plane.duration} linear ${plane.delay} infinite`,
          }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
    </div>
  )
}
