// A week of demo screen time, shown only in presentation mode (?demo=1) so
// the weekly chart on the Screen Time card has six days to look back on.
// "Today" isn't in here — it stays live off the real ledger in
// services/screenTime.js, same as outside demo mode.
//
// Replace these with real numbers off a phone's Settings > Screen Time >
// See All Activity > This Week (tap a day for its per-app breakdown).

// Totals trend down over the week (163 -> 84) the way a real cut-back
// actually looks: not a clean staircase. Wed ticks up slightly off Tue and
// Fri ticks up off Thu before the drop resumes on Sat.
export const WEEK_HISTORY = [
  { day: 'Mon', apps: { instagram: 61, tiktok: 47, snapchat: 33, youtube: 22 } },
  { day: 'Tue', apps: { instagram: 52, tiktok: 39, snapchat: 28, youtube: 17, discord: 12 } },
  { day: 'Wed', apps: { instagram: 58, tiktok: 44, snapchat: 31, youtube: 18 } },
  { day: 'Thu', apps: { instagram: 43, tiktok: 31, snapchat: 24, youtube: 21 } },
  { day: 'Fri', apps: { instagram: 46, tiktok: 35, snapchat: 19, youtube: 14, discord: 13 } },
  { day: 'Sat', apps: { instagram: 29, tiktok: 22, snapchat: 17, youtube: 16 } },
]

// Same shape useScreenTime() produces, so a historical day and the live
// ledger can be swapped into ScreenTimeCard interchangeably.
export function snapshotFor(entry) {
  const perApp = Object.entries(entry.apps)
    .map(([id, minutes]) => ({ id, minutes }))
    .filter((a) => a.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  return {
    perApp,
    totalMin: perApp.reduce((sum, a) => sum + a.minutes, 0),
  }
}
