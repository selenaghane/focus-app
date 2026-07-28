import { SESSION_START_LABEL, SESSION_END_LABEL } from '../data/sessionData'

export default function SummaryHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-0.5">
      <h1 className="text-lg font-bold text-slate-900">Session Summary</h1>
      <p className="text-xs text-slate-400">
        Today, {SESSION_START_LABEL} – {SESSION_END_LABEL}
      </p>
    </div>
  )
}
