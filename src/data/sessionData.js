// Single source of truth for the demo session.
//
// The glasses measure ONE thing: pupil diameter, sampled once a minute and
// corrected for ambient light. That raw signal is split into the two
// components the pupillometry literature actually uses:
//
//   TONIC  — slow background arousal (baseline diameter, mm)
//   PHASIC — task-evoked dilation above that baseline (mm)
//
// Everything else on screen is derived from these two, so no screen can
// imply a sensor the hardware doesn't have.
//
// Calibration notes (see references in the Glasses tab):
//   - Task-evoked responses run ~0.2–0.5 mm; ~0.5 mm is about the ceiling,
//     and high- vs low-load conditions differ by ~0.38 mm.
//   - Off-task/mind-wandering states show FLATTER task-evoked responses —
//     the most consistent finding in the sustained-attention literature.
//   - Distractible states run a HIGHER tonic baseline. In ADHD specifically,
//     tonic pupil is larger while phasic dilation is suppressed, consistent
//     with an over-driven locus coeruleus–norepinephrine system.
// So the lapse below is modelled as phasic collapsing WHILE tonic climbs.

// Tonic baseline diameter, mm. Minute 0 = 9:52 AM, minute 48 = 10:40 AM.
// Teen at a desk under normal indoor light; drifts slowly, climbs as
// attention becomes exploratory, settles again after the nudge.
export const TONIC_MM = [
  4.62, 4.6, 4.58, 4.61, 4.59, 4.57, 4.63, 4.6, 4.58, 4.56,
  4.59, 4.57, 4.6, 4.62, 4.65, 4.63, 4.61, 4.64, 4.68, 4.71,
  4.69, 4.74, 4.79, 4.85, 4.9, 4.94, 4.99, 5.03, 5.06, 5.04,
  5.01, 4.98, 4.95, 4.91, 4.86, 4.82, 4.79, 4.76, 4.74, 4.71,
  4.69, 4.67, 4.68, 4.65, 4.63, 4.61, 4.62, 4.6, 4.59,
]

// Task-evoked dilation above own baseline, mm. This is the engagement signal.
export const PHASIC_MM = [
  0.41, 0.43, 0.44, 0.42, 0.45, 0.46, 0.29, 0.43, 0.44, 0.45,
  0.47, 0.46, 0.44, 0.42, 0.42, 0.4, 0.45, 0.43, 0.38, 0.37,
  0.26, 0.33, 0.3, 0.26, 0.23, 0.2, 0.17, 0.14, 0.12, 0.13,
  0.16, 0.18, 0.19, 0.22, 0.25, 0.27, 0.28, 0.29, 0.31, 0.34,
  0.36, 0.38, 0.27, 0.39, 0.42, 0.44, 0.45, 0.43, 0.46,
]

// A response at or above this counts as genuinely engaging with the work.
export const ENGAGED_THRESHOLD_MM = 0.3
// The reported ceiling for task-evoked responses — the top of the chart.
export const PHASIC_MAX_MM = 0.55

// Tonic above this reads as the distractible, scanning mode rather than
// settled task engagement.
export const TONIC_ELEVATED_MM = 4.8

// Map task-evoked amplitude onto a 0–100 score: a flat 0.05 mm response is
// near-zero engagement, a full 0.50 mm response is close to 100.
export function scoreFromPhasic(mm) {
  return Math.max(0, Math.min(100, Math.round(20 + (mm - 0.05) * 190)))
}

export function isEngaged(mm) {
  return mm >= ENGAGED_THRESHOLD_MM
}

export const FULL_SESSION = PHASIC_MM.map(scoreFromPhasic)

// One sample per minute, so the session is as long as the series. Using
// length-1 here would let "31 engaged minutes" sit inside a "48 minute"
// session that actually has 49 measured minutes.
export const SESSION_LENGTH_MIN = PHASIC_MM.length // 49

const SESSION_START_MIN = 9 * 60 + 52

function clock(minuteOffset) {
  const t = SESSION_START_MIN + minuteOffset
  const h24 = Math.floor(t / 60)
  const m = t % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`
}

export const SESSION_START_LABEL = clock(0)
export const SESSION_END_LABEL = clock(SESSION_LENGTH_MIN)

// The glasses buzzed here, three minutes before "now".
export const NUDGE_INDEX = 30
export const NUDGE_LABEL = clock(NUDGE_INDEX)

// "Now" on the Live screen — climbing back out of the trough.
export const NOW_INDEX = 33
export const NOW_LABEL = clock(NOW_INDEX)
export const CURRENT_PHASIC = PHASIC_MM[NOW_INDEX]
export const CURRENT_TONIC = TONIC_MM[NOW_INDEX]
export const CURRENT_SCORE = scoreFromPhasic(CURRENT_PHASIC)
export const TONIC_IS_ELEVATED = CURRENT_TONIC > TONIC_ELEVATED_MM
// Same rule as everything else: the frame buzzes when the pupil isn't reacting.
export const NEEDS_NUDGE = !isEngaged(CURRENT_PHASIC)

// Live screen shows the trailing 20-minute window ending at "now".
export const LIVE_WINDOW = PHASIC_MM.slice(NOW_INDEX - 20, NOW_INDEX + 1)

function engagementStats(series) {
  let minutesEngaged = 0
  let lapses = 0
  let streak = 0
  let longestStreak = 0
  let wasEngaged = true

  series.forEach((mm) => {
    if (isEngaged(mm)) {
      minutesEngaged += 1
      streak += 1
      longestStreak = Math.max(longestStreak, streak)
    } else {
      if (wasEngaged) lapses += 1
      streak = 0
    }
    wasEngaged = isEngaged(mm)
  })

  return {
    minutesEngaged,
    lapses,
    longestStreak,
    engagedPct: Math.round((minutesEngaged / series.length) * 100),
  }
}

export const LIVE_STATS = engagementStats(PHASIC_MM.slice(0, NOW_INDEX + 1))
export const PEAK_PHASIC = Math.max(...PHASIC_MM)

const avgPhasic = PHASIC_MM.reduce((a, b) => a + b, 0) / PHASIC_MM.length
const avgTonic = TONIC_MM.reduce((a, b) => a + b, 0) / TONIC_MM.length

export const SESSION_STATS = {
  ...engagementStats(PHASIC_MM),
  sessionLengthMin: SESSION_LENGTH_MIN,
  avgPhasic: +avgPhasic.toFixed(2),
  avgTonic: +avgTonic.toFixed(2),
  peakPhasic: +PEAK_PHASIC.toFixed(2),
}

// Flattest response of the session — the deepest lapse.
const lowIndex = PHASIC_MM.indexOf(Math.min(...PHASIC_MM))
export const DEEPEST_DIP_LABEL = clock(lowIndex)

// The longest unbroken stretch where reactivity stayed flat, labelled by the
// minute inside it that bottomed out.
function longestLapse(series) {
  let best = null
  let start = -1

  series.forEach((mm, i) => {
    if (isEngaged(mm)) {
      start = -1
      return
    }
    if (start < 0) start = i
    const len = i - start + 1
    if (!best || len > best.len) best = { start, len }
  })

  if (!best) return null
  const slice = series.slice(best.start, best.start + best.len)
  const lowOffset = slice.indexOf(Math.min(...slice))
  return { ...best, lowIndex: best.start + lowOffset }
}

const lapse = longestLapse(PHASIC_MM)
export const LONGEST_LAPSE_LABEL = lapse ? clock(lapse.lowIndex) : null
export const LONGEST_LAPSE_MIN = lapse ? lapse.len : 0

// Peak tonic — how far the background arousal drifted while off task.
export const PEAK_TONIC = +Math.max(...TONIC_MM).toFixed(2)

// The best sustained 20 minutes, found rather than hand-picked.
const WINDOW = 20
let bestStart = 0
let bestMean = -1
for (let i = 0; i + WINDOW < FULL_SESSION.length; i++) {
  const slice = FULL_SESSION.slice(i, i + WINDOW + 1)
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length
  if (mean > bestMean) {
    bestMean = mean
    bestStart = i
  }
}
export const BEST_WINDOW_INDICES = [bestStart, bestStart + WINDOW]
export const BEST_WINDOW_LABEL = `${clock(bestStart)} – ${clock(bestStart + WINDOW)}`

// The word on the gauge has to agree with the millimetre rule the rest of the
// app uses, so both band edges are DERIVED from reactivity thresholds rather
// than picked as round numbers. Otherwise a minute could be counted as
// "reacting" on the chart while the gauge called it "Dipping".
export const FOCUSED_SCORE = scoreFromPhasic(ENGAGED_THRESHOLD_MM) // 68
export const DRIFTING_BELOW_MM = 0.2
export const DRIFTING_SCORE = scoreFromPhasic(DRIFTING_BELOW_MM) // 49

export function focusState(score) {
  if (score >= FOCUSED_SCORE) return { label: 'Focused', className: 'text-emerald-600' }
  if (score >= DRIFTING_SCORE) return { label: 'Dipping', className: 'text-amber-600' }
  return { label: 'Drifting', className: 'text-orange-600' }
}
