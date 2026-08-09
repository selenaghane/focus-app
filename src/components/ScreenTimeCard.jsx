import AppIcon from './AppIcon'
import WeekChart from './WeekChart'
import useScreenTime from '../hooks/useScreenTime'
import { APP_LIST } from '../data/blockingData'
import {
  formatMinutes,
  minutesOver,
  pctOverGoal,
} from '../data/screenTimeData'

export default function ScreenTimeCard({ usedMin, goalMin, usage: usageOverride, week }) {
  // The live ledger, unless a specific day's snapshot has been handed down
  // (demo mode, scrubbing the week chart) — the hook still has to run
  // unconditionally either way.
  const liveUsage = useScreenTime()
  const usage = usageOverride ?? liveUsage
  const over = minutesOver(usedMin, goalMin)
  const pct = pctOverGoal(usedMin, goalMin)
  const isOver = over > 0

  // Bar fills to the goal; anything past it overflows in amber.
  const goalWidth = Math.min(100, (usedMin / Math.max(usedMin, goalMin)) * 100)
  const withinGoalWidth = Math.min(goalWidth, (goalMin / Math.max(usedMin, goalMin)) * 100)

  const rows = usage.perApp.map((u) => ({
    ...u,
    ...(APP_LIST.find((a) => a.id === u.id) || {}),
  }))
  // A fresh install has no rows at all. Math.max() of nothing is -Infinity,
  // which would turn every bar width into NaN, so guard the divisor.
  const maxApp = Math.max(1, ...rows.map((r) => r.minutes))

  return (
    <div className="w-full bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">
          Time on blocked apps
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            isOver ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {formatMinutes(usedMin)}
        </span>
      </div>

      {week && (
        <WeekChart
          days={week.days}
          goalMin={goalMin}
          selectedIndex={week.selectedIndex}
          onSelect={week.onSelect}
        />
      )}

      <div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
          <div
            className="h-full bg-[#2a78d6] transition-all duration-500"
            style={{ width: `${withinGoalWidth}%` }}
          />
          {isOver && (
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${goalWidth - withinGoalWidth}%` }}
            />
          )}
        </div>
        <div className="flex items-baseline justify-between gap-2 mt-1.5">
          <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 tabular-nums">
            Goal {formatMinutes(goalMin)}
          </span>
          <span
            className={`text-[calc(11px*var(--ui-text-scale,1))] font-semibold tabular-nums ${
              isOver ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {isOver
              ? `${formatMinutes(over)} over · ${Math.round(pct)}%`
              : `${formatMinutes(goalMin - usedMin)} left`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {rows.length === 0 && (
          <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 leading-snug">
            Nothing on blocked apps today. Every unlock you spend shows up
            here.
          </span>
        )}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2">
            <AppIcon id={r.id} size={18} />
            <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-500 w-16 shrink-0 truncate">
              {r.name}
            </span>
            <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <span
                className="block h-full rounded-full bg-slate-300"
                style={{ width: `${(r.minutes / maxApp) * 100}%` }}
              />
            </span>
            <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 tabular-nums w-9 text-right shrink-0">
              {formatMinutes(r.minutes)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
