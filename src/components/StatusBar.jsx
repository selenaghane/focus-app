function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <rect x="0" y="7" width="3" height="5" rx="0.8" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="7" rx="0.8" fill="currentColor" />
      <rect x="9" y="3" width="3" height="9" rx="0.8" fill="currentColor" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="currentColor" />
    </svg>
  )
}

function BatteryIcon({ pct = 100 }) {
  const fillWidth = Math.max(0, Math.min(17, (pct / 100) * 17))
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="20"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width={fillWidth} height="8" rx="1.5" fill="currentColor" />
      <rect
        x="21.5"
        y="4"
        width="1.8"
        height="4"
        rx="0.8"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}

export default function StatusBar({ time = '6:07', battery = 67 }) {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-slate-900 select-none">
      <span className="text-[calc(15px*var(--ui-text-scale,1))] font-semibold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        <SignalIcon />
        <BatteryIcon pct={battery} />
      </div>
    </div>
  )
}
