import {
  CURRENT_TONIC,
  TONIC_IS_ELEVATED,
  PEAK_PHASIC,
  LIVE_STATS,
} from '../data/sessionData'

export default function PupilStatRow() {
  const metrics = [
    {
      label: 'Baseline',
      value: CURRENT_TONIC.toFixed(2),
      sub: TONIC_IS_ELEVATED ? 'mm · elevated' : 'mm · settled',
      accent: TONIC_IS_ELEVATED ? 'text-amber-600' : 'text-slate-900',
    },
    {
      label: 'Best response',
      value: `+${PEAK_PHASIC.toFixed(2)}`,
      sub: 'mm today',
      accent: 'text-slate-900',
    },
    {
      label: 'Engaged',
      value: `${LIVE_STATS.engagedPct}%`,
      sub: 'of session',
      accent: 'text-slate-900',
    },
  ]

  return (
    <div className="flex gap-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex-1 min-w-0 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-2.5 py-3 flex flex-col items-center text-center gap-0.5"
        >
          <span className="text-[10px] font-medium text-slate-400 truncate w-full">
            {m.label}
          </span>
          <span className={`text-base font-bold tabular-nums ${m.accent}`}>
            {m.value}
          </span>
          <span className="text-[10px] text-slate-400 truncate w-full">
            {m.sub}
          </span>
        </div>
      ))}
    </div>
  )
}
