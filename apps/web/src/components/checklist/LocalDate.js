'use client'

import {clampFutureDateToSiteToday} from '@/utils/date'

export default function LocalDate({value}) {
  return clampFutureDateToSiteToday(value)
}
