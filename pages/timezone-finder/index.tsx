import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'

const TimezoneFinder = dynamic(
  () => import('@/components/TimezoneFinder'),
  { ssr: false }
)

export default function TimezoneFinderPage() {
  return (
    <>
      <NextSeo
        title="Timezone Overlap Finder – Best Meeting Times Across Time Zones"
        description="Instantly find overlapping working hours between 2–4 time zones. Visualize schedules, identify the best meeting window, and export calendar invites — no sign-up needed."
      />
      <main className="z-0 flex flex-col items-center w-full max-w-screen-xl gap-4 p-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold">When Can We All Meet?</h2>
          <p className="text-base-content/70 text-sm mt-1">
            Add your team&apos;s locations and instantly see the best time slots that work for everyone.
          </p>
        </div>

        <TimezoneFinder />
      </main>
    </>
  )
}
