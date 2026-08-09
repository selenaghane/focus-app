import AppIcon from './AppIcon'
import WeekChart from './WeekChart'
import useScreenTime from '../hooks/useScreenTime'
import { APP_LIST } from '../data/blockingData'
import {
  formatMinutes,
  minutesOver,
  pctOverGoal,
} from '../data/screenTimeData'

function AppleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#94a3b8" aria-hidden="true">
      <path d="M17.05 12.9c-.03-2.67 2.18-3.95 2.28-4.01-1.24-1.82-3.17-2.07-3.86-2.1-1.64-.17-3.2.96-4.03.96-.83 0-2.11-.94-3.47-.91-1.79.03-3.44 1.04-4.36 2.64-1.86 3.22-.48 7.99 1.33 10.6.88 1.28 1.94 2.71 3.32 2.66 1.33-.05 1.84-.86 3.45-.86 1.61 0 2.06.86 3.47.83 1.43-.02 2.34-1.3 3.22-2.59 1.01-1.48 1.43-2.92 1.45-3-.03-.01-2.78-1.07-2.8-4.22zM14.4 4.9c.73-.89 1.22-2.12 1.09-3.35-1.05.04-2.32.7-3.07 1.58-.67.78-1.26 2.03-1.1 3.23 1.17.09 2.36-.59 3.08-1.46z" />
    </svg>
  )
}

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

      {/* Where the numbers came from. The Apple mark only appears once a
          native bridge is genuinely supplying them — without one these are
          the app's own unlock grants, and the line says so. */}
      <div className="flex items-center gap-1.5 pt-0.5">
        {usage.native && <AppleIcon />}
        <span className="text-[calc(10px*var(--ui-text-scale,1))] text-slate-400">
          From {usage.sourceLabel}
          {usage.native
            ? usage.syncedAt && ` · synced ${usage.syncedAt}`
            : ' · resets at midnight'}
        </span>
      </div>
    </div>
  )
}
