import Toggle from './Toggle'

export default function SettingRow({ label, sub, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5">
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        {sub && <span className="text-[11px] text-slate-400 leading-snug">{sub}</span>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  )
}
