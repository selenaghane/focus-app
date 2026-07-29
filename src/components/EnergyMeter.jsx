import { MAX_ENERGY, stageInfo, stageFromEnergy } from '../data/monsterData'

// Colour tracks the same five stages the artwork uses, so the bar and the
// creature always agree about how the monster is doing.
const STAGE_COLORS = ['#1baf7a', '#5cc08d', '#eda100', '#f08a4b', '#e2635f']

export default function EnergyMeter({ energy }) {
  const clamped = Math.max(0, Math.min(MAX_ENERGY, energy))
  const stage = stageFromEnergy(clamped)
  const { label, blurb } = stageInfo(clamped)
  const color = STAGE_COLORS[stage]

  return (
    <div className="w-full bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">Energy</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {Math.round(clamped)}
          <span className="text-slate-400 font-medium"> / {MAX_ENERGY}</span>
        </span>
      </div>

      <div
        className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={MAX_ENERGY}
        aria-label="Monster energy"
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold" style={{ color }}>
          {label}
        </span>
        <span className="text-[11px] text-slate-400 truncate">{blurb}</span>
      </div>
    </div>
  )
}
