// A stand-in for a real model: ranks apps by their average daily minutes
// over whatever usage window is available — the demo's hardcoded week, or
// just today's live ledger outside demo mode — and flags whichever cross the
// bar as worth limiting. Swapping this for an actual model later only means
// replacing the body of rankAppsByUsage; every caller already works in
// terms of { ...app, avgMin, recommended, blocked }.

import { APP_LIST } from './blockingData'

const RECOMMEND_MIN_AVG = 20

// `days` is any array of { perApp: [{ id, minutes }] } snapshots — a week of
// history, or a single day when that's all there is.
export function rankAppsByUsage(days) {
  const sums = {}
  days.forEach((day) => {
    day.perApp.forEach(({ id, minutes }) => {
      sums[id] = (sums[id] ?? 0) + minutes
    })
  })

  const dayCount = Math.max(1, days.length)
  return APP_LIST.map((app) => ({
    ...app,
    avgMin: Math.round((sums[app.id] ?? 0) / dayCount),
  })).sort((a, b) => b.avgMin - a.avgMin)
}

// Each app's recommended flag depends only on its own average and its own
// blocked state — never on another app's. Blocking Instagram shouldn't be
// able to make YouTube newly "worth limiting"; only YouTube's own numbers
// can do that.
export function withRecommendations(rankedApps, blockedIds) {
  return rankedApps.map((app) => {
    const blocked = blockedIds.includes(app.id)
    return { ...app, blocked, recommended: !blocked && app.avgMin >= RECOMMEND_MIN_AVG }
  })
}
