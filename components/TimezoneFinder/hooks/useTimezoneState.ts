import { useCallback, useMemo } from 'react'
import { createParser, useQueryState } from 'nuqs'
import { TimezoneEntry, TIMEZONE_COLORS, formatUtcOffset, getUtcOffsetHours, OverlapResult } from '@/store/timezone-finder.atom'
import { TIMEZONE_CITIES } from '@/utils/timezone-cities'

// --- Custom nuqs parser for TimezoneEntry[] ---
// URL format: timezone|city|lat|lng|start-end separated by ","

const entriesParser = createParser<TimezoneEntry[]>({
  parse: (value) => {
    if (!value) return []
    return value.split(',').map((segment, i) => {
      const [timezone, city, latStr, lngStr, hoursStr] = segment.split('|')
      const [ws, we] = hoursStr?.split('-').map(Number) || [9, 17]
      return {
        id: `${timezone}-${i}`,
        timezone,
        city: decodeURIComponent(city || timezone.split('/').pop()?.replace(/_/g, ' ') || timezone),
        lat: parseFloat(latStr) || 0,
        lng: parseFloat(lngStr) || 0,
        color: TIMEZONE_COLORS[i] || '#888',
        workStart: ws,
        workEnd: we,
      }
    })
  },
  serialize: (entries) => {
    if (entries.length === 0) return ''
    return entries
      .map((e) => `${e.timezone}|${encodeURIComponent(e.city)}|${e.lat.toFixed(4)}|${e.lng.toFixed(4)}|${e.workStart}-${e.workEnd}`)
      .join(',')
  },
})

// --- Overlap computation (pure function) ---

function computeOverlap(entries: TimezoneEntry[]): OverlapResult | null {
  if (entries.length < 2) return null

  const refOffset = getUtcOffsetHours(entries[0].timezone)
  const workingRanges = entries.map((entry) => {
    const diff = getUtcOffsetHours(entry.timezone) - refOffset
    return { start: entry.workStart - diff, end: entry.workEnd - diff }
  })

  let overlapStart = -Infinity
  let overlapEnd = Infinity
  for (const range of workingRanges) {
    overlapStart = Math.max(overlapStart, range.start)
    overlapEnd = Math.min(overlapEnd, range.end)
  }

  if (overlapStart >= overlapEnd) return { start: -1, end: -1, hasOverlap: false }
  return { start: overlapStart, end: overlapEnd, hasOverlap: true }
}

// --- Default entry (auto-detect user timezone) ---

function getDefaultEntries(): TimezoneEntry[] {
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const match = TIMEZONE_CITIES.find((c) => c.timezone === userTz)
  return [{
    id: `${userTz}-0`,
    timezone: userTz,
    city: match?.city || userTz.split('/').pop()?.replace(/_/g, ' ') || userTz,
    lat: match?.lat || 0,
    lng: match?.lng || 0,
    color: TIMEZONE_COLORS[0],
    workStart: 9,
    workEnd: 17,
  }]
}

/**
 * Single source of truth for timezone finder state.
 * nuqs manages entries directly via custom parser — URL is the state.
 */
export function useTimezoneState() {
  const [entries, setEntries] = useQueryState('entries', entriesParser.withDefault(getDefaultEntries()))

  const overlap = useMemo(() => computeOverlap(entries), [entries])

  const addTimezone = useCallback(
    (timezone: string, city: string, lat: number, lng: number) => {
      if (entries.length >= 4) return
      if (entries.some((e) => e.timezone === timezone && e.city === city)) return

      const newEntry: TimezoneEntry = {
        id: `${timezone}-${Date.now()}`,
        timezone,
        city,
        lat,
        lng,
        color: TIMEZONE_COLORS[entries.length] || '#888',
        workStart: 9,
        workEnd: 17,
      }
      setEntries([...entries, newEntry])
    },
    [entries, setEntries]
  )

  const removeTimezone = useCallback(
    (id: string) => {
      const updated = entries
        .filter((e) => e.id !== id)
        .map((e, i) => ({ ...e, color: TIMEZONE_COLORS[i] || '#888' }))
      setEntries(updated.length > 0 ? updated : null)
    },
    [entries, setEntries]
  )

  const updateWorkHours = useCallback(
    (id: string, workStart: number, workEnd: number) => {
      setEntries(entries.map((e) => (e.id === id ? { ...e, workStart, workEnd } : e)))
    },
    [entries, setEntries]
  )

  return {
    entries,
    overlap,
    addTimezone,
    removeTimezone,
    updateWorkHours,
    formattedOffset: formatUtcOffset,
  }
}
