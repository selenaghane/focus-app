import {
  BREAK_NUDGES_SENT,
  BREAK_NUDGES_TAKEN,
  RECOVERY_WITH_BREAK_MIN,
  RECOVERY_WITHOUT_BREAK_MIN,
} from '../data/trendsData'

function Row({ label, minutes, max, tone }) {
  const good = tone === 'good'
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] text-slate-600">{label}</span>
        <span
          className={`text-[12.5px] font-bold tabular-nums ${
            good ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          {minutes} min
        </span>
      </div>
      <span className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <span
          className={`block h-full rounded-full ${good ? 'bg-emerald-500' : 'bg-amber-400'}`}
          style={{ width: `${(minutes / max) * 100}%` }}
        />
      </span>
    </div>
  )
}

export default function BreakResponseCard() {
  const max = Math.max(RECOVERY_WITH_BREAK_MIN, RECOVERY_WITHOUT_BREAK_MIN)
  const ignored = BREAK_NUDGES_SENT - BREAK_NUDGES_TAKEN

  return (
    <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-slate-700">
          When the frame buzzed
        </span>
        <span className="text-[11px] text-slate-400">
          You took {BREAK_NUDGES_TAKEN} of {BREAK_NUDGES_SENT} break nudges
          {ignored > 0 ? ` · pushed through ${ignored}` : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <Row
          label="Got up and took the break"
          minutes={RECOVERY_WITH_BREAK_MIN}
          max={max}
          tone="good"
        />
        <Row
          label="Pushed through it"
          minutes={RECOVERY_WITHOUT_BREAK_MIN}
          max={max}
        />
      </div>

      <p className="text-[11px] text-slate-400 leading-snug">
        Time taken to get back to a reacting pupil. Breaking early costs a few
        minutes; ignoring the buzz costs about{' '}
        {RECOVERY_WITHOUT_BREAK_MIN - RECOVERY_WITH_BREAK_MIN} more.
      </p>
    </div>
  )
}
