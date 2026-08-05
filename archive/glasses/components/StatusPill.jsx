import { GLASSES_NAME } from '../data/branding'

export default function StatusPill() {
  return (
    <div className="self-center flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full pl-2.5 pr-3.5 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-slate-600">
        {GLASSES_NAME} connected
      </span>
    </div>
  )
}
