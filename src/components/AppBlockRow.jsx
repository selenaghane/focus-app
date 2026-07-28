import Toggle from './Toggle'

export default function AppBlockRow({
  name,
  color,
  letter,
  textDark,
  blocked,
  onToggle,
  disabled,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3 transition-opacity ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: color, color: textDark ? '#1e293b' : '#fff' }}
        >
          {letter}
        </div>
        <span className="text-sm font-semibold text-slate-700 truncate">{name}</span>
      </div>
      <Toggle checked={blocked} onChange={onToggle} disabled={disabled} />
    </div>
  )
}
