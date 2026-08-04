function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#2a78d6" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3 2"
        stroke="#2a78d6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpikeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 17l4-4 3 3 5-7 4 4"
        stroke="#eda100"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StreakIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5c2 2.5 1 4-0.5 5.5S9 12.5 10.5 15c1 1.3 2.7 1.3 3.7 0.2"
        stroke="#1baf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20.5c3 0 5-2 5-4.7 0-2-1.2-3.3-2-4.3.3 2-1 3-2 4-1.3 1.3-1 3 0 3.7"
        stroke="#1baf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ICONS = { clock: ClockIcon, spike: SpikeIcon, streak: StreakIcon }

export default function InsightCard({ icon = 'clock', text }) {
  const Icon = ICONS[icon]
  return (
    <div className="flex items-start gap-3 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5">
      <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
        <Icon />
      </div>
      <p className="text-sm text-slate-700 leading-snug">{text}</p>
    </div>
  )
}
