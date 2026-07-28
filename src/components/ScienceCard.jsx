function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="9.5" ry="6" stroke="#2a78d6" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.2" stroke="#2a78d6" strokeWidth="1.7" />
    </svg>
  )
}

export default function ScienceCard({ title, children }) {
  return (
    <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="shrink-0 w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center">
          <EyeIcon />
        </div>
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>
      <p className="text-[12.5px] text-slate-500 leading-snug">{children}</p>
    </div>
  )
}
