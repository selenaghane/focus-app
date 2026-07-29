// Screen Time figures. On a real build these come from Apple's Screen Time
// APIs (DeviceActivity / FamilyControls), which report per-app totals for the
// current day. The prototype ships one fixed day so the demo is repeatable.

export const SCREEN_TIME_SOURCE = 'Apple Screen Time'
export const SCREEN_TIME_SYNCED_AT = '10:41 AM'

// Minutes on each blocked app so far today. Ids line up with APP_LIST, and
// only apps actually marked blocked there belong here — otherwise the card
// counts unblocked time toward a "time on blocked apps" total.
export const BLOCKED_APP_USAGE = [
  { id: 'instagram', minutes: 48 },
  { id: 'tiktok', minutes: 32 },
  { id: 'snapchat', minutes: 22 },
]

export const BASE_USED_MIN = BLOCKED_APP_USAGE.reduce((a, b) => a + b.minutes, 0) // 102

// How long each unlock buys, and the daily cap for blocked apps. Both are
// user-editable on the companion tab.
export const UNLOCK_LENGTH_OPTIONS = [2, 5, 10, 15]
export const DEFAULT_UNLOCK_MIN = 5
export const GOAL_OPTIONS = [30, 60, 90, 120]
export const DEFAULT_GOAL_MIN = 90

// Going over the daily goal is what wears the monster down: every 5% of the
// goal spent beyond it drops the creature one preset. 20% over and it's
// completely withered.
export const PCT_OVER_PER_STAGE = 5
const STAGES_TO_ROCK_BOTTOM = 4
const PCT_OVER_AT_ROCK_BOTTOM = PCT_OVER_PER_STAGE * STAGES_TO_ROCK_BOTTOM // 20

export function minutesOver(usedMin, goalMin) {
  return Math.max(0, usedMin - goalMin)
}

export function pctOverGoal(usedMin, goalMin) {
  if (goalMin <= 0) return 0
  return (minutesOver(usedMin, goalMin) / goalMin) * 100
}

// Energy is a presentation of the same overage: 100 while inside the goal,
// hitting 0 once the student is 20% past it. Because the monster's stage is
// floor(overage / 5), this scale lands on exactly the intended preset.
export function energyFromUsage(usedMin, goalMin) {
  const pct = pctOverGoal(usedMin, goalMin)
  const energy = 100 - (pct / PCT_OVER_AT_ROCK_BOTTOM) * 100
  return Math.max(0, Math.min(100, energy))
}

export function formatMinutes(min) {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}
