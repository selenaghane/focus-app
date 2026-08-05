import AppIcon from './AppIcon'
import { UNLOCK_REASONS, REASONS_THEME } from '../data/trendsData'

// The block screen makes the student type a justification before unlocking an
// app (see MIN_WORDS in InstagramBlockScreen).
// Those words are the only qualitative data the product collects, so they get
// shown back rather than thrown away.
export default function UnlockReasonsCard() {
  return (
    <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-slate-700">
          In your own words
        </span>
        <span className="text-[11px] text-slate-400">
          What you wrote to unlock an app
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {UNLOCK_REASONS.map((r) => (
          <li key={r.id} className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <AppIcon id={r.app} size={14} />
              <span className="text-[11px] font-semibold text-slate-400">
                {r.day}
              </span>
            </span>
            <p className="text-[12px] text-slate-600 leading-snug border-l-2 border-slate-100 pl-2.5 italic">
              &ldquo;{r.text}&rdquo;
            </p>
          </li>
        ))}
      </ul>

      <p className="text-[11.5px] text-slate-500 leading-snug bg-sky-50/70 rounded-xl px-3 py-2.5">
        {REASONS_THEME}
      </p>
    </div>
  )
}
