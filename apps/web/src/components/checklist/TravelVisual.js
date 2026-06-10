import {MapPinned, Plane, ShieldCheck} from 'lucide-react'
import FlyingPlanes from './FlyingPlanes'

export default function TravelVisual() {
  return (
    <div
      className="relative min-h-[320px] overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5"
      aria-hidden="true"
    >
      <FlyingPlanes />

      <svg className="absolute inset-0 h-full w-full text-slate-200" viewBox="0 0 640 360" fill="none">
        <path
          d="M80 248 C 160 136, 275 292, 372 172 S 510 96, 568 148"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 12"
        />
        <path d="M116 248h408" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="absolute left-[14%] top-[60%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg shadow-slate-900/10">
        <MapPinned className="h-6 w-6" />
      </div>

      <div className="absolute left-[44%] top-[40%] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-emerald-900/20">
        <Plane className="h-7 w-7" />
      </div>

      <div className="absolute right-[13%] top-[28%] flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/20">
        <ShieldCheck className="h-6 w-6" />
      </div>
    </div>
  )
}
