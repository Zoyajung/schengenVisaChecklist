export const SITE_TIME_ZONE = process.env.NEXT_PUBLIC_SITE_TIME_ZONE || 'America/New_York'

function partsToIso(parts) {
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function dateInSiteTimeZone(date = new Date()) {
  try {
    return partsToIso(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: SITE_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(date),
    )
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

export function clampFutureDateToSiteToday(value) {
  const date = String(value || '')
  const today = dateInSiteTimeZone()
  return date && date > today ? today : date
}
