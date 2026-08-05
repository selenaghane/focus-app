import { focusState } from '../data/sessionData'

export default function FocusGauge({ score }) {
  const size = 176
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const { label, className } = focusState(score)

  return (
    <div className="self-center flex flex-col items-center gap-1.5">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
        Focus level
      </span>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#dbeafe"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a78d6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-900 tabular-nums">
            {score}
          </span>
          <span className="text-[11px] text-slate-400 -mt-1">out of 100</span>
          <span className={`mt-1.5 text-sm font-semibold ${className}`}>
            {label}
          </span>
        </div>
      </div>

      <span className="text-[11px] text-slate-400">
        From task-evoked pupil response
      </span>
    </div>
  )
}
