// The one place the app asks "what should tomorrow look like." Everything
// else — screens, the engine, storage — stays the same regardless of which
// coach answers; this module is the seam.
//
// SELECTION
// Mirrors config.js's DEMO_MODE exactly: one constant, read once, checked
// directly where it's used — no provider, no factory, no registry. When a
// real backend exists, flipping USE_API_COACH is the entire migration.
//
// THE TWO COACHES
// MockCoach is deterministic rules over the same usage/adherence shapes the
// engine already works with — no model call, nothing to tune at runtime.
// ApiCoach is a stub: the real implementation will call a backend this
// project owns, which is what's allowed to hold a model API key. That key
// must never live here — client code only ever talks to my own server.
//
// INPUT SHAPES
//   usageSummary:  { date, totalMin, limitToday, targetMin,
//                    perApp?: [{id, minutes}],
//                    sessions?: [{app, start, minutes}] }
//     `sessions` is optional because the real ledger (services/screenTime.js)
//     doesn't currently record timestamps, only per-app totals — the
//     late-night check just skips itself without that data. The synthetic
//     personas (src/data/synthetic/) carry it, which is what exercises that
//     path today.
//   adherenceHistory: oldest-first array of past days, the same shape
//     Step 4's daily-history store persists —
//     { date, perApp, limitApplied, actualTotal, adherent } — and the same
//     shape adherence.js/adaptiveLimits.js already consume via `.adherent`.
//     MockCoach also reads `.actualTotal`/`.limitApplied` where present for
//     richer pattern detection; entries missing those still work, since the
//     engine itself only ever needed `.adherent`.

import { DEFAULT_CONFIG, nextTotalLimit } from '../engine/adaptiveLimits.js'
import { rollingAdherenceRate } from '../engine/adherence.js'
import { formatMinutes } from '../data/screenTimeData.js'

const LATE_NIGHT_START_HOUR = 23 // 11pm
const LATE_NIGHT_END_HOUR = 4 // 4am
const LATE_NIGHT_SHARE_THRESHOLD = 0.5 // >=50% of today's minutes late-night

const CHRONIC_WINDOW = 7
const CHRONIC_ADHERENCE_CEILING = 0.3 // rolling adherence at/below this reads as chronic

const IMPROVING_WINDOW = 6 // must be even — split into two equal halves
const IMPROVING_DELTA = 0.34 // recent half needs to clear the earlier half by this much

function lateNightShare(sessions, totalMin) {
  if (!sessions?.length || !(totalMin > 0)) return 0
  const lateMin = sessions.reduce((sum, s) => {
    const hour = new Date(s.start).getHours()
    const isLate = hour >= LATE_NIGHT_START_HOUR || hour < LATE_NIGHT_END_HOUR
    return isLate ? sum + s.minutes : sum
  }, 0)
  return lateMin / totalMin
}

// Not enough history to call a pattern "chronic" or "improving" yet just
// reads as neither — a two-day-old account shouldn't get the harshest
// intervention because two days both went over.
function isChronicOverage(history) {
  if (history.length < CHRONIC_WINDOW) return false
  return rollingAdherenceRate(history, CHRONIC_WINDOW) <= CHRONIC_ADHERENCE_CEILING
}

function isImprovingStreak(history) {
  if (history.length < IMPROVING_WINDOW) return false
  const recent = history.slice(-IMPROVING_WINDOW)
  const half = IMPROVING_WINDOW / 2
  const earlierRate = rollingAdherenceRate(recent.slice(0, half), half)
  const laterRate = rollingAdherenceRate(recent.slice(half), half)
  return laterRate - earlierRate >= IMPROVING_DELTA
}

function buildMessage(interventionType, tomorrowLimit) {
  const limitLabel = formatMinutes(Math.round(tomorrowLimit))
  if (interventionType === 'shield') {
    return `This has been a rough stretch, so tomorrow locks down harder — a ${limitLabel} limit — until a few good days build back up.`
  }
  if (interventionType === 'pause') {
    return `A lot of today happened really late. Tomorrow, blocked apps pause earlier in the evening — limit's ${limitLabel}.`
  }
  return `Tomorrow's limit is ${limitLabel}. Keep it up.`
}

export const MockCoach = {
  // Deterministic — same inputs always produce the same plan. Layered on
  // top of the engine rather than duplicating its math: nextTotalLimit
  // decides the number, this decides how hard to lean on it and what to
  // say about it.
  async getDailyPlan(usageSummary, adherenceHistory = []) {
    const { totalMin, limitToday, targetMin, sessions } = usageSummary

    const { limit: tomorrowTotal, action, reason } = nextTotalLimit(
      limitToday,
      totalMin,
      adherenceHistory,
      targetMin,
      DEFAULT_CONFIG,
    )

    const chronic = isChronicOverage(adherenceHistory)
    const lateNightHeavy = lateNightShare(sessions, totalMin) >= LATE_NIGHT_SHARE_THRESHOLD
    const improving = !chronic && isImprovingStreak(adherenceHistory)

    let interventionType
    let rationale

    if (chronic) {
      interventionType = 'shield'
      rationale = `Rolling adherence over the last ${CHRONIC_WINDOW} days has stayed at or below ${Math.round(CHRONIC_ADHERENCE_CEILING * 100)}% — a nudge hasn't been enough, so tomorrow blocks more aggressively.`
    } else if (lateNightHeavy) {
      interventionType = 'pause'
      rationale = 'Most of today\'s usage happened late at night — an earlier evening pause addresses the pattern, not just the total.'
    } else if (improving) {
      interventionType = 'nudge'
      rationale = `Adherence has been climbing over the last ${IMPROVING_WINDOW} days — a light touch is enough to keep that going.`
    } else {
      interventionType = 'nudge'
      rationale = `Nothing unusual today — the engine's own ${action} carries this on its own. ${reason}.`
    }

    return {
      tomorrowLimits: { total: Math.round(tomorrowTotal) },
      interventionType,
      rationale,
      messageToUser: buildMessage(interventionType, tomorrowTotal),
    }
  },
}

// Talks to a backend this project owns — never a model provider directly,
// so no API key ever has to live in client code. Nothing to call yet.
export const ApiCoach = {
  async getDailyPlan() {
    throw new Error('ApiCoach.getDailyPlan is not implemented yet — no backend to call')
  },
}

// Same pattern as DEMO_MODE: a single constant, checked once, right where
// it's used. Nothing sets this true yet — flip it once ApiCoach actually
// has a backend to reach.
const USE_API_COACH = false

export function getDailyPlan(usageSummary, adherenceHistory = []) {
  const coach = USE_API_COACH ? ApiCoach : MockCoach
  return coach.getDailyPlan(usageSummary, adherenceHistory)
}
