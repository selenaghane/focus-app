import { CURRENT_BIOMARKERS } from '../data/sessionData'

export default function BiomarkerRow() {
  const metrics = [
    { label: 'Gaze', value: `${CURRENT_BIOMARKERS.gazeOnTaskPct}%`, sub: 'on-task' },
    { label: 'Pupil', value: CURRENT_BIOMARKERS.pupilEffort, sub: 'effort' },
    { label: 'Blinks', value: CURRENT_BIOMARKERS.blinkRate, sub: '/ min' },
    { label: 'Stillness', value: `${CURRENT_BIOMARKERS.headStillnessPct}%`, sub: 'head' },
  ]

  return (
    <div className="flex gap-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex-1 min-w-0 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-2.5 py-3 flex flex-col items-center text-center gap-0.5"
        >
          <span className="text-[10px] font-medium text-slate-400 truncate w-full">
            {m.label}
          </span>
          <span className="text-base font-bold text-slate-900 tabular-nums">
            {m.value}
          </span>
          <span className="text-[10px] text-slate-400 truncate w-full">
            {m.sub}
          </span>
        </div>
      ))}
    </div>
  )
}
