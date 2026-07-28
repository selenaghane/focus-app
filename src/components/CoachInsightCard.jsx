function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        fill="#2a78d6"
      />
    </svg>
  )
}

export default function CoachInsightCard({ text }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50 px-4 py-3.5 flex items-start gap-3">
      <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
        <SparkleIcon />
      </div>
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold text-[#2a78d6] uppercase tracking-wide">
          Coach insight
        </span>
        <p className="text-sm text-slate-700 leading-snug">{text}</p>
      </div>
    </div>
  )
}
