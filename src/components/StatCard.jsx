export default function StatCard({ label, value, sub, wide = false }) {
  return (
    <div
      className={`${wide ? 'w-full' : 'flex-1'} min-w-0 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5`}
    >
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
      <span className="text-2xl font-bold text-slate-900 tabular-nums">
        {value}
      </span>
      {sub && <span className="text-[11px] text-slate-400">{sub}</span>}
    </div>
  )
}
