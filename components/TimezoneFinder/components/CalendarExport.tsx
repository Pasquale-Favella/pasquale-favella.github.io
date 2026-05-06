import { useState } from 'react'
import { format, setHours, setMinutes } from 'date-fns'
import { TimezoneEntry, OverlapResult } from '@/store/timezone-finder.atom'

interface CalendarExportProps {
  entries: TimezoneEntry[]
  overlap: OverlapResult | null
}

export default function CalendarExport({ entries, overlap }: CalendarExportProps) {
  const [selectedDate, setSelectedDate] = useState('')

  if (!overlap?.hasOverlap || entries.length < 2) return null

  const handleExport = () => {
    if (!selectedDate) return

    const refTimezone = entries[0].timezone
    const [year, month, day] = selectedDate.split('-').map(Number)
    const baseDate = new Date(year, month - 1, day)

    const startDate = setMinutes(setHours(baseDate, Math.floor(overlap.start)), Math.round((overlap.start % 1) * 60))
    const endHour = Math.min(Math.floor(overlap.start) + 1, Math.floor(overlap.end))
    const endDate = setMinutes(setHours(baseDate, endHour), Math.round((overlap.start % 1) * 60))

    const dtStart = format(startDate, "yyyyMMdd'T'HHmmss")
    const dtEnd = format(endDate, "yyyyMMdd'T'HHmmss")
    const attendees = entries.map((e) => `${e.city} (${e.timezone})`).join(', ')

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Timezone Finder//EN',
      'BEGIN:VEVENT',
      `DTSTART;TZID=${refTimezone}:${dtStart}`,
      `DTEND;TZID=${refTimezone}:${dtEnd}`,
      'SUMMARY:Team Meeting (Overlap Window)',
      `DESCRIPTION:Best overlap time for: ${attendees}`,
      `UID:${Date.now()}@timezone-finder`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${selectedDate}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-base-content">Export Meeting</h3>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input input-bordered input-sm flex-1"
        />
        <button
          onClick={handleExport}
          disabled={!selectedDate}
          className="btn btn-primary btn-sm"
        >
          Export .ics
        </button>
      </div>
    </div>
  )
}
