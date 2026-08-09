// A stand-in for a real model: ranks apps by their average daily minutes
// over whatever usage window is available — the demo's hardcoded week, or
// just today's live ledger outside demo mode — and flags the heaviest few
// as worth limiting. Swapping this for an actual model later only means
// replacing the body of rankAppsByUsage; every caller already works in
// terms of { ...app, avgMin, recommended, blocked }.

import { APP_LIST } from './blockingData'

const RECOMMEND_MIN_AVG = 15
const MAX_RECOMMENDED = 3

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

// Highest-usage apps get flagged first, skipping ones already blocked (no
// point recommending what's already on) and ones too light to bother with.
export function withRecommendations(rankedApps, blockedIds) {
  let flagged = 0
  return rankedApps.map((app) => {
    const blocked = blockedIds.includes(app.id)
    const recommended =
      !blocked && app.avgMin >= RECOMMEND_MIN_AVG && flagged < MAX_RECOMMENDED
    if (recommended) flagged += 1
    return { ...app, blocked, recommended }
  })
}
