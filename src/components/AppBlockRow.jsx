import Toggle from './Toggle'
import AppIcon from './AppIcon'

export default function AppBlockRow({ id, name, blocked, onToggle, disabled }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3 transition-opacity ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <AppIcon id={id} size={36} />
        <span className="text-sm font-semibold text-slate-700 truncate">{name}</span>
      </div>
      <Toggle checked={blocked} onChange={onToggle} disabled={disabled} />
    </div>
  )
}
