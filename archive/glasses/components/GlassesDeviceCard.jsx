function GlassesIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="5.5" cy="14" r="3.2" stroke="#2a78d6" strokeWidth="1.8" />
      <circle cx="18.5" cy="14" r="3.2" stroke="#2a78d6" strokeWidth="1.8" />
      <path d="M8.7 14h6.6" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.3 13.5 4 9c.4-1 1-1.4 2-1.4" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21.7 13.5 20 9c-.4-1-1-1.4-2-1.4" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BluetoothIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 7l10 10-5 5V2l5 5L7 17"
        stroke="#2a78d6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniBatteryIcon({ pct }) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
      <rect x="0.5" y="0.5" width="16" height="9" rx="2" stroke="#94a3b8" strokeOpacity="0.5" />
      <rect x="1.5" y="1.5" width={Math.max(0, (14 * pct) / 100)} height="7" rx="1" fill="#2a78d6" />
      <rect x="17" y="3" width="1.6" height="4" rx="0.6" fill="#94a3b8" fillOpacity="0.5" />
    </svg>
  )
}

import { GLASSES_NAME } from '../data/branding'

export default function GlassesDeviceCard({ ownerName = 'Selena', batteryPct = 82 }) {
  return (
    <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3.5">
      <div className="shrink-0 w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center">
        <GlassesIcon />
      </div>
      <div className="min-w-0 flex-1 flex items-center gap-2">
        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-sky-50">
          <BluetoothIcon />
        </span>
        <span className="text-[13px] font-bold text-slate-900 leading-snug">
          Connected to {ownerName}&rsquo;s {GLASSES_NAME}
        </span>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        <MiniBatteryIcon pct={batteryPct} />
        <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
          {batteryPct}%
        </span>
      </div>
    </div>
  )
}
