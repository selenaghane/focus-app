// Permanent daily history — one record per calendar day, forever (well,
// MAX_HISTORY_DAYS), surviving what services/screenTime.js's ledger does
// not: that ledger only ever holds *today*, and discards its totals the
// moment the date rolls over (readLedger there returns a fresh empty day
// once stored.date !== today). By the time anything noticed the rollover
// had happened, yesterday's numbers would already be gone.
//
// So this store doesn't wait for a rollover to "commit" a finished day —
// there is no reliable moment to catch that. Instead recordDay() is meant
// to be called repeatedly through the day (in the real app: whenever
// screenTime's snapshot changes) and upserts by date. The entry for today
// just keeps getting overwritten with fresher numbers; once the date
// itself changes, that entry is simply never touched again and is already
// holding its final values. Nothing has to happen exactly at midnight.
//
// Separate from the ledger entirely — different storage key, no shared
// state, and recordUnlock() in services/screenTime.js is untouched. This
// is the history src/engine/adaptiveLimits.js and services/coach.js read
// as `adherenceHistory` in the real app; the shape matches what both
// already expect.

import { loadValue, saveValue } from './storage.js'
import { isAdherentDay } from '../engine/adherence.js'

const HISTORY_KEY = 'dailyHistory.days'
// The engine only ever looks at the last `window`/`baselineWindow` days
// (single-digit numbers in DEFAULT_CONFIG), so there's no functional
// reason to keep more than a few months of this around.
const MAX_HISTORY_DAYS = 90

function readHistory() {
  return loadValue(HISTORY_KEY, [])
}

function writeHistory(days) {
  saveValue(HISTORY_KEY, days)
}

// Oldest-first — the shape adaptiveLimits.js and coach.js already consume
// as `adherenceHistory`, so this can be passed straight through with no
// adapter.
export function getHistory() {
  return readHistory()
}

// Upserts one day's totals. `adherent` isn't accepted as an argument — it's
// derived here via the same isAdherentDay the engine uses, so "what counts
// as adherent" is defined in exactly one place rather than duplicated at
// every call site.
export function recordDay({ date, perApp = [], limitApplied, actualTotal }) {
  const adherent = isAdherentDay(actualTotal, limitApplied)
  const entry = { date, perApp, limitApplied, actualTotal, adherent }

  const days = readHistory()
  const idx = days.findIndex((d) => d.date === date)
  const next = idx === -1 ? [...days, entry] : days.map((d, i) => (i === idx ? entry : d))

  next.sort((a, b) => a.date.localeCompare(b.date))
  writeHistory(next.slice(-MAX_HISTORY_DAYS))
}

// Not wired to anything — here for the same reason clearStoredState exists
// on storage.js: a clean slate for testing or a reset control, should one
// ever call it.
export function clearHistory() {
  writeHistory([])
}
