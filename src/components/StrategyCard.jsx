import { useState } from 'react'
import { STRATEGIES } from '../data/strategiesData'

function VibrationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="4" width="8" height="16" rx="2" stroke="#94a3b8" strokeWidth="1.8" />
      <path d="M4 9v6M20 9v6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="#1baf7a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function StrategyCard({ onDismiss }) {
  const [strategy] = useState(
    () => STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
  )
  const [done, setDone] = useState(false)

  const handleDone = () => {
    setDone(true)
    setTimeout(() => onDismiss?.(), 2200)
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4 flex items-center gap-2.5">
        <CheckIcon />
        <span className="text-sm font-semibold text-emerald-700">
          Nice — logged.
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <VibrationIcon />
        Your glasses just buzzed
      </div>
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
          {strategy.emoji}
        </div>
        <p className="text-sm font-semibold text-slate-700 leading-snug">
          {strategy.text}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDone}
        className="self-start bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm active:bg-emerald-600 transition-colors"
      >
        Done
      </button>
    </div>
  )
}
