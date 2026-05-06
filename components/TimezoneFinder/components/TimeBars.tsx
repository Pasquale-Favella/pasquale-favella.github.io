import { useEffect, useState, useMemo } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import {
  TimezoneEntry,
  OverlapResult,
  getCurrentHourInTimezone,
  getUtcOffsetHours,
} from '@/store/timezone-finder.atom'

interface TimeBarsProps {
  entries: TimezoneEntry[]
  overlap: OverlapResult | null
}

export default function TimeBars({ entries, overlap }: TimeBarsProps) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const refOffset = useMemo(
    () => (entries.length > 0 ? getUtcOffsetHours(entries[0].timezone) : 0),
    [entries]
  )

  if (entries.length === 0) {
    return (
      <div className="text-center text-base-content/50 py-8">
        <p className="text-sm">Search for a city above to add timezones</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const currentHour = getCurrentHourInTimezone(entry.timezone)
        const offsetDiff = getUtcOffsetHours(entry.timezone) - refOffset
        const zonedNow = toZonedTime(new Date(), entry.timezone)

        return (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.city} ({entry.timezone})
              </span>
              <span className="text-base-content/60">
                {format(zonedNow, 'HH:mm')}
              </span>
            </div>
            <TimeBar
              entry={entry}
              currentHour={currentHour}
              overlap={overlap}
              offsetDiff={offsetDiff}
            />
          </div>
        )
      })}

      {overlap && (
        <div className="mt-4 p-3 rounded-box bg-base-200 border border-base-300">
          {overlap.hasOverlap ? (
            <div className="space-y-2">
              <p className="text-sm text-success font-medium flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                Overlap found ({formatHour(overlap.end - overlap.start + (overlap.end - overlap.start < 0 ? 24 : 0))}h window)
              </p>
              <div className="pl-5 space-y-1">
                {entries.map((entry) => {
                  const offsetDiff = getUtcOffsetHours(entry.timezone) - refOffset
                  const localStart = ((overlap.start + offsetDiff) % 24 + 24) % 24
                  const localEnd = ((overlap.end + offsetDiff) % 24 + 24) % 24
                  return (
                    <p key={entry.id} className="text-xs text-base-content/70 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-medium">{entry.city}:</span>
                      {formatHour(localStart)} – {formatHour(localEnd)}
                    </p>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-error font-medium flex items-center gap-1">
              <FiXCircle className="w-4 h-4" /> No overlapping working hours found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface TimeBarProps {
  entry: { workStart: number; workEnd: number; color: string }
  currentHour: number
  overlap: OverlapResult | null
  offsetDiff: number
}

function TimeBar({ entry, currentHour, overlap, offsetDiff }: TimeBarProps) {
  const workLeft = (entry.workStart / 24) * 100
  const workWidth = ((entry.workEnd - entry.workStart) / 24) * 100
  const overlapLeft = overlap?.hasOverlap
    ? (Math.max(0, overlap.start + offsetDiff) / 24) * 100
    : 0
  const overlapWidth = overlap?.hasOverlap
    ? ((Math.min(24, overlap.end + offsetDiff) - Math.max(0, overlap.start + offsetDiff)) / 24) * 100
    : 0

  return (
    <div className="relative h-8 rounded bg-base-300 overflow-hidden">
      <div
        className="absolute top-0 bottom-0 opacity-30"
        style={{ left: `${workLeft}%`, width: `${workWidth}%`, backgroundColor: entry.color }}
      />

      {overlap?.hasOverlap && (
        <div
          className="absolute top-0 bottom-0 bg-success/50"
          style={{ left: `${overlapLeft}%`, width: `${overlapWidth}%` }}
        />
      )}

      {[0, 6, 12, 18].map((h) => (
        <div
          key={h}
          className="absolute top-0 bottom-0 w-px bg-base-content/20"
          style={{ left: `${(h / 24) * 100}%` }}
        />
      ))}

      {[0, 6, 12, 18].map((h) => (
        <span
          key={`l-${h}`}
          className="absolute bottom-0 text-[9px] text-base-content/50 leading-none"
          style={{ left: `${(h / 24) * 100 + 0.5}%` }}
        >
          {h}:00
        </span>
      ))}

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-error z-10"
        style={{ left: `${(currentHour / 24) * 100}%` }}
      />
    </div>
  )
}

function formatHour(h: number): string {
  const hours = Math.floor(((h % 24) + 24) % 24)
  const minutes = Math.round((Math.abs(h) % 1) * 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
