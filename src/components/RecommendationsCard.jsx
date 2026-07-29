import {
  BEST_WINDOW_LABEL,
  SESSION_STATS,
  DEEPEST_DIP_LABEL,
} from '../data/sessionData'
import {
  DAILY_FOCUS,
  BREAK_NUDGES_SENT,
  BREAK_NUDGES_TAKEN,
  RECOVERY_WITH_BREAK_MIN,
  RECOVERY_WITHOUT_BREAK_MIN,
} from '../data/trendsData'

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#2a78d6" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="7.5" stroke="#2a78d6" strokeWidth="1.8" />
      <path d="M9.5 3.5h5M12 9.5V13" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BuzzIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="4" width="8" height="16" rx="2.4" stroke="#2a78d6" strokeWidth="1.8" />
      <path d="M4 9.5v5M20 9.5v5" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 16.5 9.5 11l3.5 3.5L20 7"
        stroke="#2a78d6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.5 7H20v4.5" stroke="#2a78d6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Suggestions are read off the same data the charts show, so the advice can
// never contradict what the student is looking at.
function buildTips() {
  const gain = DAILY_FOCUS[DAILY_FOCUS.length - 1] - DAILY_FOCUS[0]
  const ignored = BREAK_NUDGES_SENT - BREAK_NUDGES_TAKEN
  const costOfIgnoring = RECOVERY_WITHOUT_BREAK_MIN - RECOVERY_WITH_BREAK_MIN

  // Round the engaged-stretch figure up to a sensible working block.
  const stretch = SESSION_STATS.longestStreak
  const suggestedBlock = Math.max(15, Math.ceil((stretch * 2) / 5) * 5)

  return [
    {
      Icon: ClockIcon,
      title: `Put your hardest work at ${BEST_WINDOW_LABEL.split('–')[0].trim()}`,
      body: `${BEST_WINDOW_LABEL} is your strongest stretch. Schedule the subject you avoid most into that window.`,
    },
    {
      Icon: TimerIcon,
      title: `Work in ${suggestedBlock}-minute blocks`,
      body: `Your attention holds about ${stretch} minutes at a time before it slips. Short deliberate breaks beat pushing through.`,
    },
    {
      Icon: BuzzIcon,
      title: 'Actually get up when it buzzes',
      body: `You ignored ${ignored} of ${BREAK_NUDGES_SENT} nudges. Breaking straight away gets you back on task in ${RECOVERY_WITH_BREAK_MIN} minutes; pushing through costs about ${costOfIgnoring} more.`,
    },
    {
      Icon: TrendIcon,
      title: `Protect the run around ${DEEPEST_DIP_LABEL}`,
      body: `That's when you dip hardest. A planned break just before it tends to prevent the crash. You're up ${gain} points in two weeks — worth keeping.`,
    },
  ]
}

export default function RecommendationsCard() {
  const tips = buildTips()

  return (
    <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-slate-700">
          What to try next
        </span>
        <span className="text-[11px] text-slate-400">
          Built from your last two weeks
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {tips.map(({ Icon, title, body }) => (
          <li key={title} className="flex gap-2.5">
            <span className="shrink-0 w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center mt-0.5">
              <Icon />
            </span>
            <span className="min-w-0 flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-slate-700 leading-snug">
                {title}
              </span>
              <span className="text-[11.5px] text-slate-400 leading-snug">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
