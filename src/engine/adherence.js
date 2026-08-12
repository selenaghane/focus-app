// Rolling adherence: how consistently actual usage has stayed at or under
// whatever limit was in force, over some trailing window of days. This is
// the one thing adaptiveLimits.js consults before letting a limit tighten
// further — it doesn't decide policy itself, just measures the history.
//
// Pure — no I/O, no React, no imports from services or UI.

// A single day counts as adherent when actual usage didn't exceed that
// day's limit. Kept separate from the rolling calculation so a caller
// building history entries (e.g. the daily-history store in Step 4) has one
// obvious place to compute the flag it stores.
export function isAdherentDay(actualUsage, limit) {
  return actualUsage <= limit
}

// `history` is any array of past days carrying an `.adherent` boolean,
// oldest first — the shape the daily-history store persists. Only the last
// `window` entries count; a history shorter than `window` is judged on
// whatever exists rather than padded or rejected.
//
// No history at all means no proof of adherence yet, so this returns 0
// (not 1) — the gate in adaptiveLimits.js is conservative by design: a
// limit only tightens once sustained adherence has actually been observed,
// and an empty track record hasn't observed anything.
export function rollingAdherenceRate(history, window) {
  if (!history || history.length === 0) return 0
  const recent = history.slice(-window)
  const adherentCount = recent.filter((day) => day.adherent).length
  return adherentCount / recent.length
}
