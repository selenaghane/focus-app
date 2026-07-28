import { STRATEGY_EFFECTIVENESS } from '../data/trendsData'

export default function StrategyRankCard() {
  return (
    <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
      <span className="text-sm font-semibold text-slate-700">
        What&rsquo;s working for you
      </span>
      <div className="flex flex-col gap-2.5">
        {STRATEGY_EFFECTIVENESS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-sky-50 text-[#2a78d6] text-[11px] font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="flex-1 min-w-0 text-sm text-slate-700 truncate">
              {s.label}
            </span>
            <span className="shrink-0 text-sm font-bold text-emerald-600 tabular-nums">
              +{s.delta}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
