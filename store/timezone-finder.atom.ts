import { atom } from 'jotai'
import { loadable } from 'jotai/utils'
import axios from 'axios'
import { differenceInMinutes } from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import atomWithDebounce from '@/utils/atomWithDebounce'

// --- Types ---

export interface TimezoneEntry {
  id: string
  timezone: string
  city: string
  lat: number
  lng: number
  color: string
  workStart: number
  workEnd: number
}

export interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  name: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

export interface OverlapResult {
  start: number
  end: number
  hasOverlap: boolean
}

// --- Constants ---

export const TIMEZONE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'] as const

export const WORK_PRESETS = [
  { label: '9–17', start: 9, end: 17 },
  { label: '8–16', start: 8, end: 16 },
  { label: '10–18', start: 10, end: 18 },
] as const

// --- Timezone utilities (date-fns-tz) ---

export function getUtcOffsetHours(timezone: string): number {
  const now = new Date()
  const utcNow = toZonedTime(now, 'UTC')
  const tzNow = toZonedTime(now, timezone)
  return differenceInMinutes(tzNow, utcNow) / 60
}

export function getCurrentHourInTimezone(timezone: string): number {
  const now = new Date()
  const timeStr = formatInTimeZone(now, timezone, 'HH:mm')
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours + minutes / 60
}

export function formatUtcOffset(timezone: string): string {
  const offset = getUtcOffsetHours(timezone)
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  const h = Math.floor(abs)
  const m = Math.round((abs - h) * 60)
  return `UTC${sign}${h}${m > 0 ? `:${m.toString().padStart(2, '0')}` : ''}`
}

// --- Nominatim search (debounced + loadable) ---

const {
  currentValueAtom: searchCurrentValueAtom,
  debouncedValueAtom: searchDebouncedAtom,
  isDebouncingAtom: searchIsDebouncingAtom,
} = atomWithDebounce('', 400)

export { searchCurrentValueAtom, searchIsDebouncingAtom }
export const searchQueryAtom = searchDebouncedAtom

const nominatimResultsAsyncAtom = atom(async (get) => {
  const query = get(searchDebouncedAtom)
  if (!query || query.length < 2) return []

  const { data } = await axios.get<NominatimResult[]>(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 6,
        'accept-language': 'en',
      },
      headers: { 'User-Agent': 'TimezoneFinder/1.0' },
    }
  )
  return data
})

export const nominatimResultsLoadableAtom = loadable(nominatimResultsAsyncAtom)

