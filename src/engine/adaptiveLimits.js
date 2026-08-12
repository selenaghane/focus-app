// The adaptive limit engine: given how someone's actually used a blocked
// app (or all of them combined) against whatever limit was in force, decide
// what tomorrow's limit should be.
//
// Pure — no I/O, no React, no imports from services or UI. Every function
// here is a plain transformation of numbers and plain-object history it's
// handed; nothing reads storage, the clock, or app state. That's what makes
// scripts/simulate.mjs able to run this over 30 days of synthetic data
// exactly the same way the real app eventually will.
//
// THE CORE RULE
//   actual <= limit  -> the limit can step down, but only once rolling
//                       adherence over the trailing window clears the gate.
//                       Never goes below targetMin — once there, it holds.
//   actual >  limit  -> the limit jumps partway toward what actually
//                       happened, unconditionally (no adherence gate on
//                       the way up — a blown limit should react immediately,
//                       not wait for permission).
//
// THE FLOOR
//   targetMin is a per-user value passed in by the caller, not a constant
//   here — one person's realistic floor is another's still-too-high
//   starting point. The engine only ever descends toward it and holds.
//
// PER-APP VS TOTAL
//   The core function (`nextLimit`) only ever sees three numbers and a
//   history array — it has no idea whether it's tracking one app or every
//   blocked app summed together. `nextTotalLimit` / `nextAppLimit` are
//   identical thin wrappers that exist purely so call sites read with
//   intent; neither adds logic the other doesn't have.

import { rollingAdherenceRate } from './adherence.js'

// Every tunable in one place, so scripts/simulate.mjs has one object to
// sweep while tuning against the synthetic personas.
export const DEFAULT_CONFIG = {
  // Minutes shaved off the limit on a day that earns a decrease.
  stepSize: 5,
  // Fraction of an overage recovered toward actual usage on an over day —
  // 0.5 means a limit that's blown by 40 minutes jumps up 20.
  recoveryFactor: 0.5,
  // Trailing days considered for the rolling-adherence gate.
  window: 7,
  // Rolling adherence rate (0-1) required before a decrease is allowed.
  threshold: 0.8,
  // Days of unenforced observation before an initial limit is calibrated.
  baselineWindow: 7,
  // Fraction below the observed baseline average the initial limit starts
  // at — 0.1 means starting 10% under what the baseline period showed.
  initialCut: 0.1,
}

function round1(n) {
  return Math.round(n * 10) / 10
}

// Turns a baseline period's daily totals into an initial limit, once the
// baseline window has actually elapsed — this replaces the old fixed
// DEFAULT_GOAL_MIN starting point with one calibrated to how this specific
// user (or app) actually behaves before any limit ever applied.
//
// `baselineActuals` is the raw per-day usage recorded during that
// unenforced window — nothing enforces a limit yet, so there's nothing to
// gate here, only an average to compute. Still clamped to targetMin: no
// initial limit should start below the floor the engine is meant to
// descend toward.
export function calibrateInitialLimit(baselineActuals, targetMin, config = DEFAULT_CONFIG) {
  const days = baselineActuals.length
  const baselineAvg = days === 0 ? targetMin : baselineActuals.reduce((sum, v) => sum + v, 0) / days
  return Math.max(targetMin, baselineAvg * (1 - config.initialCut))
}

// The generic core. `adherenceHistory` is oldest-first, each entry
// carrying at least `.adherent` (see adherence.js) — it's whatever history
// the caller is tracking, total or per-app, and this function never
// inspects it beyond that one field.
//
// Returns { limit, action, reason } rather than a bare number: simulate.mjs
// wants to print why a day moved the way it did, and deriving that
// separately from the same inputs would just be this logic duplicated.
export function nextLimit(currentLimit, actualUsage, adherenceHistory, targetMin, config = DEFAULT_CONFIG) {
  const { stepSize, recoveryFactor, window, threshold } = config

  if (actualUsage > currentLimit) {
    const overage = actualUsage - currentLimit
    return {
      limit: currentLimit + recoveryFactor * overage,
      action: 'increase',
      reason: `over by ${round1(overage)}m — recovered ${Math.round(recoveryFactor * 100)}% of the gap toward actual`,
    }
  }

  const rate = rollingAdherenceRate(adherenceHistory, window)
  if (rate < threshold) {
    return {
      limit: currentLimit,
      action: 'hold',
      reason: `adherent today, but rolling adherence ${Math.round(rate * 100)}% is under the ${Math.round(threshold * 100)}% gate`,
    }
  }

  if (currentLimit <= targetMin) {
    return { limit: targetMin, action: 'hold', reason: 'already at target floor' }
  }

  return {
    limit: Math.max(targetMin, currentLimit - stepSize),
    action: 'decrease',
    reason: `adherent with sufficient history — stepped down ${stepSize}m`,
  }
}

// Thin, intent-revealing wrappers. Both delegate to the same core; the
// distinction is entirely in what the caller passes as `actualUsage` and
// `adherenceHistory` (a total across all blocked apps, or one app's own
// numbers) — nothing about "apps" is known below this line.
export function nextTotalLimit(currentLimit, actualUsage, adherenceHistory, targetMin, config = DEFAULT_CONFIG) {
  return nextLimit(currentLimit, actualUsage, adherenceHistory, targetMin, config)
}

export function nextAppLimit(currentLimit, actualUsage, adherenceHistory, targetMin, config = DEFAULT_CONFIG) {
  return nextLimit(currentLimit, actualUsage, adherenceHistory, targetMin, config)
}
