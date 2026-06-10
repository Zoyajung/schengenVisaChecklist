'use client'

import {useId, useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import Flag from 'react-world-flags'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import {COUNTRY_OPTIONS, SCHENGEN_COUNTRY_SLUGS} from '@/constants/countries'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

const FALLBACK_VISA_TYPES = [
  {name: 'Tourist', slug: 'tourist'},
  {name: 'Business', slug: 'business'},
  {name: 'Family Visit', slug: 'family-visit'},
  {name: 'Transit', slug: 'transit'},
  {name: 'Medical', slug: 'medical'},
  {name: 'Student Short Stay', slug: 'student-short-stay'},
]

const CATALOG_COUNTRIES = COUNTRY_OPTIONS.map((country) => ({
  ...country,
  countryTypes: SCHENGEN_COUNTRY_SLUGS.has(country.slug)
    ? ['nationality', 'residence', 'destination', 'schengen']
    : ['nationality', 'residence'],
}))

const INITIAL_VALUES = {
  nationality: '',
  residenceCountry: '',
  destinationCountry: '',
  visaType: '',
  purpose: 'Tourism',
  employmentStatus: 'employed',
  familyStatus: 'not-traveling-with-eu-family',
  previousBiometrics: 'no',
}

const STEPS = [
  {
    titleKey: 'checklist.wizard.travelerTitle',
    descriptionKey: 'checklist.wizard.travelerDescription',
    icon: UserRound,
    required: ['nationality', 'residenceCountry'],
  },
  {
    titleKey: 'checklist.wizard.tripTitle',
    descriptionKey: 'checklist.wizard.tripDescription',
    icon: MapPin,
    required: ['destinationCountry', 'visaType', 'purpose'],
  },
  {
    titleKey: 'checklist.wizard.profileTitle',
    descriptionKey: 'checklist.wizard.profileDescription',
    icon: ClipboardCheck,
    required: [],
  },
]

const EMPLOYMENT_OPTIONS = [
  {value: 'employed', labelKey: 'checklist.form.employment.employed'},
  {value: 'self-employed', labelKey: 'checklist.form.employment.selfEmployed'},
  {value: 'student', labelKey: 'checklist.form.employment.student'},
  {value: 'unemployed', labelKey: 'checklist.form.employment.unemployed'},
  {value: 'retired', labelKey: 'checklist.form.employment.retired'},
]

const FAMILY_OPTIONS = [
  {value: 'not-traveling-with-eu-family', labelKey: 'checklist.form.family.noEuRoute'},
  {value: 'traveling-with-eu-family', labelKey: 'checklist.form.family.euFamily'},
  {value: 'minor', labelKey: 'checklist.form.family.minor'},
]

const BIOMETRICS_OPTIONS = [
  {value: 'no', labelKey: 'checklist.form.biometrics.no'},
  {value: 'yes', labelKey: 'checklist.form.biometrics.yes'},
]

function byType(countries, type) {
  return countries.filter((country) => country.countryTypes?.includes(type))
}

function mergeCountryCatalog(countries) {
  const bySlug = new Map(CATALOG_COUNTRIES.map((country) => [country.slug, country]))

  for (const country of countries || []) {
    if (!country?.slug) continue

    const existing = bySlug.get(country.slug)
    const countryTypes = new Set([
      ...(existing?.countryTypes || []),
      ...(country.countryTypes || []),
    ])

    if (SCHENGEN_COUNTRY_SLUGS.has(country.slug)) {
      countryTypes.add('destination')
      countryTypes.add('schengen')
    }

    bySlug.set(country.slug, {
      ...existing,
      ...country,
      countryTypes: [...countryTypes],
    })
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function schengenDestinations(countries) {
  return countries.filter((country) => (
    SCHENGEN_COUNTRY_SLUGS.has(country.slug) || country.countryTypes?.includes('schengen')
  ))
}

function findLabel(options, value, fallback) {
  return options.find((option) => option.slug === value || option.value === value)?.name
    || options.find((option) => option.value === value)?.label
    || fallback
}

function findCountry(options, value) {
  return options.find((option) => option.slug === value)
}

function CountryCombobox({
  label,
  placeholder,
  options,
  value,
  invalid,
  help,
  onChange,
  messages,
}) {
  const listboxId = useId()
  const selected = findCountry(options, value)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery
    ? options.filter((country) => (
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.slug.toLowerCase().includes(normalizedQuery) ||
        country.isoCode?.toLowerCase().includes(normalizedQuery)
      ))
    : options

  function selectCountry(country) {
    onChange(country.slug)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <div className="relative">
        <div className={`flex min-h-12 items-center gap-2 rounded-md border bg-white px-3.5 py-2 shadow-sm transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 ${invalid ? 'border-red-400 ring-4 ring-red-100' : 'border-slate-200'}`}>
          {selected?.isoCode ? (
            <Flag code={selected.isoCode} className="h-5 w-7 shrink-0 rounded-sm object-cover shadow-sm" aria-hidden="true" />
          ) : (
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          )}
          <input
            type="text"
            role="combobox"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-invalid={invalid}
            value={open || query ? query : selected?.name || ''}
            placeholder={selected?.name || placeholder}
            className="min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />
          {selected || query ? (
            <button
              type="button"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={t(messages, 'checklist.form.clearCountry')}
              onClick={() => {
                onChange('')
                setQuery('')
                setOpen(false)
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {open ? (
          <div id={listboxId} role="listbox" className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-2xl shadow-slate-900/20">
            {filtered.length ? (
              filtered.map((country) => (
                <button
                  key={country.slug}
                  type="button"
                  role="option"
                  aria-selected={country.slug === value}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:text-primary"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCountry(country)}
                >
                  {country.isoCode ? (
                    <Flag code={country.isoCode} className="h-5 w-7 shrink-0 rounded-sm object-cover shadow-sm" aria-hidden="true" />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  {country.isoCode ? <span className="text-xs font-bold text-slate-400">{country.isoCode}</span> : null}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">{t(messages, 'checklist.form.noCountries')}</p>
            )}
          </div>
        ) : null}
      </div>
      {help ? <span className="text-xs leading-5 text-slate-500">{help}</span> : null}
    </div>
  )
}

export default function VisaChecklistForm({locale = 'en', countries = [], visaTypes = []}) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const messages = getMessages(locale)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState({})
  const [values, setValues] = useState(INITIAL_VALUES)

  const allCountries = useMemo(() => mergeCountryCatalog(countries), [countries])
  const allVisaTypes = visaTypes.length ? visaTypes : FALLBACK_VISA_TYPES

  const groups = useMemo(() => ({
    nationalities: byType(allCountries, 'nationality'),
    residences: byType(allCountries, 'residence'),
    destinations: schengenDestinations(allCountries),
  }), [allCountries])

  const employmentOptions = EMPLOYMENT_OPTIONS.map((option) => ({
    ...option,
    label: t(messages, option.labelKey),
  }))
  const familyOptions = FAMILY_OPTIONS.map((option) => ({
    ...option,
    label: t(messages, option.labelKey),
  }))
  const biometricsOptions = BIOMETRICS_OPTIONS.map((option) => ({
    ...option,
    label: t(messages, option.labelKey),
  }))

  const inputClass = 'min-h-12 w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10'
  const labelClass = 'text-sm font-bold text-slate-800'

  function updateValue(name, value) {
    setValues((current) => ({...current, [name]: value}))
    setTouched((current) => ({...current, [name]: true}))
    if (error) setError('')
  }

  function markStepTouched(stepIndex) {
    const required = STEPS[stepIndex].required
    setTouched((current) => ({
      ...current,
      ...Object.fromEntries(required.map((field) => [field, true])),
    }))
  }

  function validateStep(stepIndex) {
    const missing = STEPS[stepIndex].required.filter((field) => !String(values[field] || '').trim())
    if (missing.length) {
      markStepTouched(stepIndex)
      setError(t(messages, 'checklist.form.requiredStep'))
      return false
    }
    setError('')
    return true
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  function goBack() {
    setError('')
    setStep((current) => Math.max(current - 1, 0))
  }

  async function onSubmit(event) {
    event.preventDefault()

    const allRequired = STEPS.flatMap((item) => item.required)
    const firstMissing = allRequired.find((field) => !String(values[field] || '').trim())

    if (firstMissing) {
      const missingStep = STEPS.findIndex((item) => item.required.includes(firstMissing))
      setTouched((current) => ({
        ...current,
        ...Object.fromEntries(allRequired.map((field) => [field, true])),
      }))
      setStep(missingStep >= 0 ? missingStep : 0)
      setError(t(messages, 'checklist.form.requiredStep'))
      return
    }

    setLoading(true)
    setError('')

    const payload = {
      nationality: values.nationality,
      residenceCountry: values.residenceCountry,
      destinationCountry: values.destinationCountry,
      visaType: values.visaType,
      purpose: values.purpose,
      employmentStatus: values.employmentStatus,
      familyStatus: values.familyStatus,
      previousBiometrics: values.previousBiometrics === 'yes',
    }

    try {
      const res = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || t(messages, 'checklist.form.error'))
      router.push(localizedPath(locale, `/result/${data.slug}`))
    } catch (err) {
      setError(err instanceof Error ? err.message : t(messages, 'checklist.form.error'))
    } finally {
      setLoading(false)
    }
  }

  function fieldState(name) {
    return touched[name] && !String(values[name] || '').trim()
  }

  const activeStep = STEPS[step]
  const ActiveIcon = activeStep.icon
  const progress = `${((step + 1) / STEPS.length) * 100}%`
  const selectedNationality = findLabel(groups.nationalities, values.nationality, t(messages, 'checklist.form.notSelected'))
  const selectedResidence = findLabel(groups.residences, values.residenceCountry, t(messages, 'checklist.form.notSelected'))
  const selectedDestination = findLabel(groups.destinations, values.destinationCountry, t(messages, 'checklist.form.notSelected'))
  const selectedVisaType = findLabel(allVisaTypes, values.visaType, t(messages, 'checklist.form.notSelected'))

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-secondary/70 px-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm rounded-lg border border-white/70 p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-primary text-white shadow-lg shadow-primary/20">
              <Plane className="h-7 w-7 animate-pulse" aria-hidden="true" />
            </div>
            <p className="mt-4 text-lg font-bold text-slate-950">{t(messages, 'checklist.loading.title')}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t(messages, 'checklist.loading.description')}</p>
            <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="absolute inset-y-0 w-2/3 rounded-full bg-tertiary" style={{animation: 'premium-shimmer 1.35s ease-in-out infinite'}} />
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="glass-panel overflow-hidden rounded-lg border border-white/80">
        <div className="border-b border-slate-200/80 bg-white/90 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-white">
              <ActiveIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-tertiary">
                {t(messages, 'checklist.wizard.stepCounter', {current: step + 1, total: STEPS.length})}
              </p>
              <h2 className="mt-1 text-xl font-bold leading-7 text-slate-950">{t(messages, activeStep.titleKey)}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{t(messages, activeStep.descriptionKey)}</p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{width: progress}} />
          </div>

          <ol className="mt-4 grid grid-cols-3 gap-2" aria-label={t(messages, 'checklist.wizard.progressLabel')}>
            {STEPS.map((item, index) => {
              const StepIcon = item.icon
              const isComplete = index < step
              const isActive = index === step
              return (
                <li key={item.titleKey}>
                  <button
                    type="button"
                    className={`flex min-h-11 w-full items-center justify-center gap-1 rounded-md border px-2 text-xs font-bold transition ${
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : isComplete
                          ? 'border-tertiary/40 bg-tertiary/10 text-primary'
                          : 'border-slate-200 bg-white text-slate-500'
                    }`}
                    onClick={() => {
                      if (index <= step || validateStep(step)) setStep(index)
                    }}
                  >
                    {isComplete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <StepIcon className="h-4 w-4" aria-hidden="true" />}
                    <span className="hidden sm:inline">{t(messages, item.titleKey)}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={prefersReducedMotion ? false : {opacity: 0, x: 18}}
              animate={{opacity: 1, x: 0}}
              exit={prefersReducedMotion ? undefined : {opacity: 0, x: -18}}
              transition={{duration: 0.22, ease: 'easeOut'}}
              className="grid gap-4"
            >
              {step === 0 ? (
                <div className="grid gap-4">
                  <CountryCombobox
                    label={t(messages, 'checklist.form.nationality')}
                    placeholder={t(messages, 'checklist.form.searchNationality')}
                    options={groups.nationalities}
                    value={values.nationality}
                    invalid={fieldState('nationality')}
                    help={t(messages, 'checklist.wizard.nationalityHelp')}
                    messages={messages}
                    onChange={(value) => updateValue('nationality', value)}
                  />

                  <CountryCombobox
                    label={t(messages, 'checklist.form.residenceCountry')}
                    placeholder={t(messages, 'checklist.form.searchResidenceCountry')}
                    options={groups.residences}
                    value={values.residenceCountry}
                    invalid={fieldState('residenceCountry')}
                    help={t(messages, 'checklist.wizard.residenceHelp')}
                    messages={messages}
                    onChange={(value) => updateValue('residenceCountry', value)}
                  />
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-4">
                  <CountryCombobox
                    label={t(messages, 'checklist.form.destinationCountry')}
                    placeholder={t(messages, 'checklist.form.searchDestinationCountry')}
                    options={groups.destinations}
                    value={values.destinationCountry}
                    invalid={fieldState('destinationCountry')}
                    messages={messages}
                    onChange={(value) => updateValue('destinationCountry', value)}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className={labelClass}>{t(messages, 'checklist.form.visaType')}</span>
                      <select
                        name="visaType"
                        value={values.visaType}
                        aria-invalid={fieldState('visaType')}
                        className={`${inputClass} ${fieldState('visaType') ? 'border-red-400 ring-4 ring-red-100' : ''}`}
                        onChange={(event) => updateValue('visaType', event.target.value)}
                      >
                        <option value="" disabled>{t(messages, 'checklist.form.selectVisaType')}</option>
                        {allVisaTypes.map((visaType) => <option key={visaType.slug} value={visaType.slug}>{visaType.name}</option>)}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className={labelClass}>{t(messages, 'checklist.form.purpose')}</span>
                      <input
                        name="purpose"
                        value={values.purpose}
                        aria-invalid={fieldState('purpose')}
                        className={`${inputClass} ${fieldState('purpose') ? 'border-red-400 ring-4 ring-red-100' : ''}`}
                        onChange={(event) => updateValue('purpose', event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="rounded-md border border-tertiary/25 bg-tertiary/10 p-3 text-sm leading-6 text-slate-700">
                    <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
                    {t(messages, 'checklist.wizard.routeNote')}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className={labelClass}>{t(messages, 'checklist.form.employmentStatus')}</span>
                      <select
                        name="employmentStatus"
                        value={values.employmentStatus}
                        className={inputClass}
                        onChange={(event) => updateValue('employmentStatus', event.target.value)}
                      >
                        {employmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className={labelClass}>{t(messages, 'checklist.form.previousBiometrics')}</span>
                      <select
                        name="previousBiometrics"
                        value={values.previousBiometrics}
                        className={inputClass}
                        onChange={(event) => updateValue('previousBiometrics', event.target.value)}
                      >
                        {biometricsOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className={labelClass}>{t(messages, 'checklist.form.familyStatus')}</span>
                    <select
                      name="familyStatus"
                      value={values.familyStatus}
                      className={inputClass}
                      onChange={(event) => updateValue('familyStatus', event.target.value)}
                    >
                      {familyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>

                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                      <Briefcase className="h-4 w-4 text-tertiary" aria-hidden="true" />
                      {t(messages, 'checklist.wizard.reviewTitle')}
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t(messages, 'checklist.form.nationality')}</dt>
                        <dd className="text-right font-semibold text-slate-900">{selectedNationality}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t(messages, 'checklist.form.residenceCountry')}</dt>
                        <dd className="text-right font-semibold text-slate-900">{selectedResidence}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t(messages, 'checklist.form.destinationCountry')}</dt>
                        <dd className="text-right font-semibold text-slate-900">{selectedDestination}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t(messages, 'checklist.form.visaType')}</dt>
                        <dd className="text-right font-semibold text-slate-900">{selectedVisaType}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={step === 0 || loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t(messages, 'checklist.wizard.back')}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary"
                onClick={goNext}
              >
                {t(messages, 'checklist.wizard.next')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
                {loading ? t(messages, 'checklist.form.generating') : t(messages, 'checklist.form.submit')}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
