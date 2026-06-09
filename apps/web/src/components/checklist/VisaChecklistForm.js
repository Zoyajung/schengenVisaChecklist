'use client'

import {useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Loader2, Plane, Search} from 'lucide-react'
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

export default function VisaChecklistForm({locale = 'en', countries = [], visaTypes = []}) {
  const router = useRouter()
  const messages = getMessages(locale)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const allCountries = useMemo(() => mergeCountryCatalog(countries), [countries])
  const allVisaTypes = visaTypes.length ? visaTypes : FALLBACK_VISA_TYPES

  const groups = useMemo(() => ({
    nationalities: byType(allCountries, 'nationality'),
    residences: byType(allCountries, 'residence'),
    destinations: schengenDestinations(allCountries),
  }), [allCountries])

  async function onSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(event.currentTarget)
    const payload = {
      nationality: String(form.get('nationality') || ''),
      residenceCountry: String(form.get('residenceCountry') || ''),
      destinationCountry: String(form.get('destinationCountry') || ''),
      visaType: String(form.get('visaType') || ''),
      purpose: String(form.get('purpose') || ''),
      employmentStatus: String(form.get('employmentStatus') || ''),
      familyStatus: String(form.get('familyStatus') || ''),
      previousBiometrics: form.get('previousBiometrics') === 'yes',
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

  const selectClass = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
  const labelClass = 'text-sm font-medium text-slate-700'

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-white/15 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-primary">
              <Plane className="h-6 w-6 animate-pulse" aria-hidden="true" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-950">{t(messages, 'checklist.loading.title')}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(messages, 'checklist.loading.description')}
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.nationality')}</span>
          <select name="nationality" required className={selectClass} defaultValue="">
            <option value="" disabled>{t(messages, 'checklist.form.selectNationality')}</option>
            {groups.nationalities.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.residenceCountry')}</span>
          <select name="residenceCountry" required className={selectClass} defaultValue="">
            <option value="" disabled>{t(messages, 'checklist.form.selectResidenceCountry')}</option>
            {groups.residences.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.destinationCountry')}</span>
          <select name="destinationCountry" required className={selectClass} defaultValue="">
            <option value="" disabled>{t(messages, 'checklist.form.selectDestinationCountry')}</option>
            {groups.destinations.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.visaType')}</span>
          <select name="visaType" required className={selectClass} defaultValue="">
            <option value="" disabled>{t(messages, 'checklist.form.selectVisaType')}</option>
            {allVisaTypes.map((visaType) => <option key={visaType.slug} value={visaType.slug}>{visaType.name}</option>)}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.purpose')}</span>
          <input name="purpose" required className={selectClass} defaultValue="Tourism" />
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.employmentStatus')}</span>
          <select name="employmentStatus" className={selectClass} defaultValue="employed">
            <option value="employed">Employed</option>
            <option value="self-employed">Self-employed</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.familyStatus')}</span>
          <select name="familyStatus" className={selectClass} defaultValue="not-traveling-with-eu-family">
            <option value="not-traveling-with-eu-family">No EU/EEA family route</option>
            <option value="traveling-with-eu-family">Traveling with EU/EEA family</option>
            <option value="minor">Minor applicant</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>{t(messages, 'checklist.form.previousBiometrics')}</span>
          <select name="previousBiometrics" className={selectClass} defaultValue="no">
            <option value="no">No or not sure</option>
            <option value="yes">Yes, within the last 59 months</option>
          </select>
        </label>
        </div>

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
          {loading ? t(messages, 'checklist.form.generating') : t(messages, 'checklist.form.submit')}
        </button>
      </form>
    </>
  )
}
