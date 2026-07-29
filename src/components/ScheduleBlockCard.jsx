import Toggle from './Toggle'
import {
  DAY_LABELS,
  formatRange,
  formatDuration,
  daysSummary,
} from '../data/scheduleData'

export default function ScheduleBlockCard({
  block,
  active = false,
  onToggle,
  onEdit,
  disabled,
}) {
  const { label, startMin, endMin, days, enabled } = block

  return (
    <div
      className={`bg-white/80 rounded-2xl border shadow-sm px-4 py-3.5 flex flex-col gap-2.5 transition-opacity ${
        disabled ? 'opacity-40' : ''
      } ${active ? 'border-emerald-200' : 'border-slate-100'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          data-flat
          className="min-w-0 flex-1 flex flex-col gap-0.5 text-left"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-slate-700 truncate">
              {label}
            </span>
            {active && (
              <span className="shrink-0 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-1.5 py-0.5">
                Active now
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {formatRange(startMin, endMin)} · {formatDuration(startMin, endMin)} ·{' '}
            {daysSummary(days)}
          </span>
        </button>
        <Toggle checked={enabled} onChange={onToggle} disabled={disabled} />
      </div>

      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        data-flat
        className="flex gap-1.5"
        aria-label={`Edit ${label}`}
      >
        {DAY_LABELS.map((d, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
              days[i] ? 'bg-sky-50 text-[#2a78d6]' : 'text-slate-300'
            }`}
          >
            {d}
          </span>
        ))}
      </button>
    </div>
  )
}
