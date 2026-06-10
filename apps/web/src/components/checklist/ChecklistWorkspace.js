import Image from 'next/image'
import {
  BadgeCheck,
  CalendarDays,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import MotionReveal from '@/components/shared/MotionReveal'
import Container from '@/components/ui/Container'
import {getMessages, t} from '@/messages'
import VisaChecklistForm from './VisaChecklistForm'

const DESTINATIONS = [
  {
    key: 'france',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=82',
  },
  {
    key: 'germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=82',
  },
  {
    key: 'italy',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=82',
  },
  {
    key: 'spain',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=82',
  },
]

const QUICK_STATS = [
  {icon: ShieldCheck, labelKey: 'checklist.workspace.stats.schengen'},
  {icon: CalendarDays, labelKey: 'checklist.workspace.stats.rule'},
  {icon: BadgeCheck, labelKey: 'checklist.workspace.stats.profile'},
]

export default function ChecklistWorkspace({locale = 'en', countries = [], visaTypes = []}) {
  const messages = getMessages(locale)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-slate-950">
      <section className="bg-[linear-gradient(180deg,#071c33_0%,#0b2948_100%)] text-white">
        <Container className="py-6 sm:py-10 lg:py-12">
          <MotionReveal className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex max-w-full min-h-9 items-center gap-2 overflow-hidden rounded-md border border-white/15 bg-white/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-tertiary shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{t(messages, 'checklist.heroEyebrow')}</span>
            </div>
            <h1 className="mx-auto mt-4 max-w-[20rem] text-4xl font-black leading-[1.04] text-white sm:max-w-4xl sm:text-6xl lg:text-7xl">
              {t(messages, 'checklist.workspace.headline')}
            </h1>
            <p className="mx-auto mt-4 max-w-[19rem] px-1 text-sm leading-6 text-white/75 [overflow-wrap:anywhere] sm:max-w-2xl sm:text-lg sm:leading-7">
              {t(messages, 'checklist.workspace.description')}
            </p>

            <div className="mx-auto mt-5 grid w-[calc(100vw-2rem)] max-w-[22rem] grid-cols-3 gap-2 sm:flex sm:w-full sm:max-w-3xl sm:flex-wrap sm:justify-center">
              {QUICK_STATS.map(({icon: Icon, labelKey}) => (
                <span
                  key={labelKey}
                  className="inline-flex min-h-14 min-w-0 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-white/15 bg-white/10 px-2 text-center text-[11px] font-bold leading-3 text-white sm:min-h-10 sm:w-auto sm:flex-row sm:gap-2 sm:px-3 sm:text-xs"
                >
                  <Icon className="h-4 w-4 shrink-0 text-tertiary" aria-hidden="true" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{t(messages, labelKey)}</span>
                </span>
              ))}
            </div>
          </MotionReveal>

          <section id="checklist-generator" className="scroll-mt-24">
            <MotionReveal delay={0.08} className="mx-auto mt-6 max-w-6xl">
              <VisaChecklistForm locale={locale} countries={countries} visaTypes={visaTypes} />
            </MotionReveal>
          </section>
        </Container>
      </section>

      <section className="py-7 sm:py-10">
        <Container>
          <MotionReveal delay={0.14}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {t(messages, 'checklist.workspace.countryBoard.kicker')}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {t(messages, 'checklist.workspace.countryBoard.title')}
                </h2>
              </div>
              <span className="inline-flex w-fit items-center rounded-md bg-primary px-3 py-2 text-xs font-bold text-white">
                {t(messages, 'checklist.workspace.countryBoard.badge')}
              </span>
            </div>

            <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
              {DESTINATIONS.map(({key, image}) => (
                <article key={key} className="w-[82vw] min-w-[260px] max-w-sm shrink-0 snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:w-auto md:max-w-none md:shrink">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={image}
                      alt={t(messages, `checklist.workspace.countryBoard.items.${key}.imageAlt`)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/15 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
                      {t(messages, `checklist.workspace.countryBoard.items.${key}.validity`)}
                    </span>
                  </div>
                  <div className="grid gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 text-lg font-bold text-slate-950">
                        {t(messages, `checklist.workspace.countryBoard.items.${key}.name`)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                      <span className="rounded-md bg-primary/5 px-2 py-1">{t(messages, 'checklist.workspace.countryBoard.shortStay')}</span>
                      <span className="rounded-md bg-tertiary/20 px-2 py-1 text-secondary">{t(messages, 'checklist.workspace.countryBoard.verify')}</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {t(messages, `checklist.workspace.countryBoard.items.${key}.documents`)}
                    </p>
                    <a
                      href="#checklist-generator"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                    >
                      <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                      {t(messages, 'checklist.workspace.countryBoard.action')}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </MotionReveal>
        </Container>
      </section>
    </main>
  )
}
