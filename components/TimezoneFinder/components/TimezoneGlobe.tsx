import { useRef, useEffect, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { TimezoneEntry } from '@/store/timezone-finder.atom'
import GlobeGL, { GlobeMethods } from 'react-globe.gl'

interface TimezoneGlobeProps {
  entries: TimezoneEntry[]
}

interface PointData {
  lat: number
  lng: number
  color: string
  label: string
  size: number
}

interface ArcData {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color: string[]
}

export default function TimezoneGlobe({ entries }: TimezoneGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Auto-rotate and fly to first entry on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current?.controls) {
        const controls = globeRef.current.controls()
        if (controls) {
          controls.autoRotate = true
          controls.autoRotateSpeed = 0.5
          controls.enableZoom = false
        }
      }
      if (entries.length > 0 && entries[0].lat !== 0 && globeRef.current?.pointOfView) {
        globeRef.current.pointOfView(
          { lat: entries[0].lat, lng: entries[0].lng, altitude: 2 },
          1000
        )
      }
    }, 500)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to latest entry when entries change
  useEffect(() => {
    if (entries.length === 0) return
    const last = entries[entries.length - 1]
    const timer = setTimeout(() => {
      if (globeRef.current?.pointOfView) {
        globeRef.current.pointOfView(
          { lat: last.lat, lng: last.lng, altitude: 2 },
          1000
        )
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [entries])

  const pointsData = useMemo<PointData[]>(
    () =>
      entries.map((e) => ({
        lat: e.lat,
        lng: e.lng,
        color: e.color,
        label: e.city,
        size: 0.6,
      })),
    [entries]
  )

  const arcsData = useMemo<ArcData[]>(() => {
    if (entries.length < 2) return []
    const arcs: ArcData[] = []
    for (let i = 0; i < entries.length - 1; i++) {
      arcs.push({
        startLat: entries[i].lat,
        startLng: entries[i].lng,
        endLat: entries[i + 1].lat,
        endLng: entries[i + 1].lng,
        color: [entries[i].color, entries[i + 1].color],
      })
    }
    return arcs
  }, [entries])

  return (
    <div className="mx-auto w-full max-w-[300px] aspect-square relative">
      <GlobeGL
        ref={globeRef}
        globeImageUrl={
          isDark
            ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
            : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        }
        backgroundColor={isDark ? 'rgba(17,24,39,0)' : 'rgba(249,250,251,0)'}
        atmosphereColor={isDark ? '#3b82f6' : '#60a5fa'}
        atmosphereAltitude={0.15}
        pointsData={pointsData}
        pointColor={((d: PointData) => d.color) as (d: object) => string}
        pointAltitude={0.01}
        pointRadius={((d: PointData) => d.size) as (d: object) => number}
        pointLabel={((d: PointData) => d.label) as (d: object) => string}
        arcsData={arcsData}
        arcColor={((d: ArcData) => d.color) as (d: object) => string[]}
        arcStroke={1}
        arcDashLength={0.5}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        width={300}
        height={300}
      />
    </div>
  )
}
