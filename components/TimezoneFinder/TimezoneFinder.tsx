import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import SearchInput, { SearchSelection } from './components/SearchInput'
import TimeBars from './components/TimeBars'
import WorkingHoursConfig from './components/WorkingHoursConfig'
import CalendarExport from './components/CalendarExport'
import ShareButton from './components/ShareButton'
import { useTimezoneState } from './hooks/useTimezoneState'

const TimezoneGlobe = dynamic(() => import('./components/TimezoneGlobe'), { ssr: false })

export default function TimezoneFinder() {
  const {
    entries,
    overlap,
    addTimezone,
    removeTimezone,
    updateWorkHours,
    formattedOffset,
  } = useTimezoneState()

  const handleSearchSelect = useCallback(
    (selection: SearchSelection) => {
      addTimezone(selection.timezone, selection.city, selection.lat, selection.lng)
    },
    [addTimezone]
  )

  return (
    <div className="max-w-screen-lg mx-auto w-full flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="w-full lg:w-1/3">
        <TimezoneGlobe entries={entries} />
      </div>

      <div className="w-full flex flex-col gap-6 lg:w-2/3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <SearchInput onSelect={handleSearchSelect} disabled={entries.length >= 4} />
          </div>
          <ShareButton disabled={entries.length === 0} />
        </div>

        <TimeBars entries={entries} overlap={overlap} />

        <WorkingHoursConfig
          entries={entries}
          onUpdateHours={updateWorkHours}
          onRemove={removeTimezone}
          formattedOffset={formattedOffset}
        />

        <CalendarExport entries={entries} overlap={overlap} />
      </div>
    </div>
  )
}
