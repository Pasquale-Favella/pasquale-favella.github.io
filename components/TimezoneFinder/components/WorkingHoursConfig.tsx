import { FiX } from 'react-icons/fi'
import { WORK_PRESETS, TimezoneEntry } from '@/store/timezone-finder.atom'

interface WorkingHoursConfigProps {
  entries: TimezoneEntry[]
  onUpdateHours: (id: string, workStart: number, workEnd: number) => void
  onRemove: (id: string) => void
  formattedOffset: (tz: string) => string
}

export default function WorkingHoursConfig({
  entries,
  onUpdateHours,
  onRemove,
  formattedOffset,
}: WorkingHoursConfigProps) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-base-content">
        Working Hours
      </h3>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-wrap items-center gap-2 p-2 rounded-box border border-base-300 bg-base-100"
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-base-content truncate block">
              {entry.city}
            </span>
            <span className="text-[10px] text-base-content/50">
              {formattedOffset(entry.timezone)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {WORK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onUpdateHours(entry.id, preset.start, preset.end)}
                className={`btn btn-xs ${
                  entry.workStart === preset.start && entry.workEnd === preset.end
                    ? 'btn-primary'
                    : 'btn-ghost border border-base-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <input
              type="number"
              min={0}
              max={23}
              value={entry.workStart}
              onChange={(e) =>
                onUpdateHours(entry.id, parseInt(e.target.value) || 0, entry.workEnd)
              }
              className="input input-bordered input-xs w-12 text-center"
            />
            <span className="text-base-content/50">–</span>
            <input
              type="number"
              min={0}
              max={23}
              value={entry.workEnd}
              onChange={(e) =>
                onUpdateHours(entry.id, entry.workStart, parseInt(e.target.value) || 0)
              }
              className="input input-bordered input-xs w-12 text-center"
            />
          </div>

          <button
            onClick={() => onRemove(entry.id)}
            className="btn btn-ghost btn-xs text-error"
            title="Remove"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
