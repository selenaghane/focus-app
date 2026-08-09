// A week of demo screen time, shown only in presentation mode (?demo=1) so
// the weekly chart on the Screen Time card has six days to look back on.
// "Today" isn't in here — it stays live off the real ledger in
// services/screenTime.js, same as outside demo mode.
//
// Replace these with real numbers off a phone's Settings > Screen Time >
// See All Activity > This Week (tap a day for its per-app breakdown).

export const WEEK_HISTORY = [
  { day: 'Mon', apps: { instagram: 41, tiktok: 26, youtube: 12 } },
  { day: 'Tue', apps: { instagram: 58, tiktok: 44, snapchat: 20 } },
  { day: 'Wed', apps: { instagram: 22, tiktok: 15 } },
  { day: 'Thu', apps: { instagram: 65, tiktok: 50, snapchat: 28, discord: 14 } },
  { day: 'Fri', apps: { instagram: 47, tiktok: 33, snapchat: 18 } },
  { day: 'Sat', apps: { instagram: 72, tiktok: 58, youtube: 35, snapchat: 24 } },
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
