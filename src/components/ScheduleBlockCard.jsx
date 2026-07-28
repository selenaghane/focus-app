import Toggle from './Toggle'
import { DAY_LABELS } from '../data/scheduleData'

export default function ScheduleBlockCard({ label, time, days, enabled, onToggle, disabled }) {
  return (
    <div
      className={`bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2.5 transition-opacity ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          <span className="text-[11px] text-slate-400 tabular-nums">{time}</span>
        </div>
        <Toggle checked={enabled} onChange={onToggle} disabled={disabled} />
      </div>
      <div className="flex gap-1.5">
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
      </div>
    </div>
  )
}
