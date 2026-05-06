import { useState, useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  searchQueryAtom,
  searchCurrentValueAtom,
  searchIsDebouncingAtom,
  nominatimResultsLoadableAtom,
  NominatimResult,
} from '@/store/timezone-finder.atom'
import { findNearestCity } from '@/utils/timezone-cities'

export interface SearchSelection {
  city: string
  timezone: string
  lat: number
  lng: number
}

interface SearchInputProps {
  onSelect: (selection: SearchSelection) => void
  disabled?: boolean
}

export default function SearchInput({ onSelect, disabled }: SearchInputProps) {
  const currentValue = useAtomValue(searchCurrentValueAtom)
  const setQuery = useSetAtom(searchQueryAtom)
  const isDebouncing = useAtomValue(searchIsDebouncingAtom)
  const resultsLoadable = useAtomValue(nominatimResultsLoadableAtom)
  const [isFocused, setIsFocused] = useState(false)

  const handleSelect = useCallback(
    (result: NominatimResult) => {
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      const cityName =
        result.name ||
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.display_name.split(',')[0]

      const nearest = findNearestCity(lat, lng)
      const timezone = nearest?.timezone ?? `Etc/GMT${lng >= 0 ? '-' : '+'}${Math.abs(Math.round(lng / 15))}`

      onSelect({ city: cityName, timezone, lat, lng })
      setQuery('')
      setIsFocused(false)
    },
    [onSelect, setQuery]
  )

  const isLoading = isDebouncing || resultsLoadable.state === 'loading'
  const results: NominatimResult[] =
    resultsLoadable.state === 'hasData' ? resultsLoadable.data : []

  return (
    <div className="relative">
      <input
        type="text"
        value={currentValue}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Search city..."
        disabled={disabled}
        className="input input-bordered w-full input-sm"
      />
      {isLoading && isFocused && currentValue.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-box border border-base-300 bg-base-100 shadow-lg p-3">
          <span className="loading loading-spinner loading-xs"></span>
          <span className="text-sm text-base-content/60 ml-2">Searching...</span>
        </div>
      )}
      {isFocused && !isLoading && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-box border border-base-300 bg-base-100 shadow-lg">
          {results.map((result) => (
            <li
              key={result.place_id}
              onMouseDown={() => handleSelect(result)}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-base-200 text-base-content"
            >
              <span className="font-medium">
                {result.name || result.display_name.split(',')[0]}
              </span>
              <span className="text-base-content/60 text-xs block truncate">
                {result.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
