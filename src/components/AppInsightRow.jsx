import Toggle from './Toggle'
import AppIcon from './AppIcon'
import { formatMinutes } from '../data/screenTimeData'

export default function AppInsightRow({ id, name, avgMin, recommended, blocked, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <AppIcon id={id} size={36} />
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-700 truncate">{name}</span>
            {recommended && (
              <span className="shrink-0 text-[calc(9px*var(--ui-text-scale,1))] font-bold uppercase tracking-wide text-[#2a78d6] bg-sky-50 rounded-full px-1.5 py-0.5">
                Recommended
              </span>
            )}
          </div>
          <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 tabular-nums">
            {avgMin > 0 ? `${formatMinutes(avgMin)}/day avg` : 'No recent usage'}
          </span>
        </div>
      </div>
      <Toggle checked={blocked} onChange={onToggle} label={`Block ${name}`} />
    </div>
  )
}
