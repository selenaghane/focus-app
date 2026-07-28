// Single source of truth for the demo session's fake data, so the Live and
// Summary screens always tell the same story: strong start, a distraction
// dip around minute 30, then recovery after the intervention nudge.

// One score per minute, minute 0 = 9:52 AM, minute 48 = 10:40 AM (session end).
export const FULL_SESSION = [
  81, 85, 86, 85, 86, 88, 90, 90, 89, 88, 91, 91, 89, 88, 89, 91, 91, 88, 85,
  84, 86, 84, 80, 76, 75, 73, 68, 62, 61, 63, 65, 66, 66, 69, 73, 77, 78, 78,
  80, 83, 85, 85, 85, 87, 91, 93, 93, 92, 94,
]

export const SESSION_LENGTH_MIN = FULL_SESSION.length - 1 // 48
export const SESSION_START_LABEL = '9:52 AM'
export const SESSION_END_LABEL = '10:40 AM'

// "Now" on the Live screen — the moment the dip is detected and the
// intervention banner appears.
export const NOW_INDEX = 30
export const NOW_LABEL = '10:22 AM'
export const CURRENT_SCORE = FULL_SESSION[NOW_INDEX]

// Live screen shows the trailing 20-minute window ending at "now".
export const LIVE_WINDOW = FULL_SESSION.slice(NOW_INDEX - 20, NOW_INDEX + 1)

// The strongest, most sustained stretch of the session — the opening run,
// before the mid-session distraction.
export const BEST_WINDOW_INDICES = [0, 20]
export const BEST_WINDOW_LABEL = '9:52 – 10:12 AM'

export const SESSION_STATS = {
  totalFocusMin: 38,
  sessionLengthMin: SESSION_LENGTH_MIN,
  distractions: 6,
}

// Biomarker snapshot at "now" — readings dip alongside the focus score.
export const CURRENT_BIOMARKERS = {
  gazeOnTaskPct: 68,
  pupilEffort: 'High',
  blinkRate: 23,
  headStillnessPct: 76,
}

export function focusState(score) {
  if (score >= 78) return { label: 'Focused', className: 'text-emerald-600' }
  if (score >= 50) return { label: 'Dipping', className: 'text-amber-600' }
  return { label: 'Distracted', className: 'text-orange-600' }
}
