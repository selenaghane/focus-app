// Screen Time constants and the maths built on them. Live usage figures come
// from services/screenTime.js instead, which is the one seam a native Screen
// Time bridge has to fill.
// Filler screentime data is in demo mode so something can be shown

// Only shown once a native bridge is genuinely supplying the numbers.
export const SCREEN_TIME_SOURCE = 'Apple Screen Time'

// The day demo mode starts from. Ids line up with APP_LIST, and only apps
// actually marked blocked there belong here — otherwise the card counts
// unblocked time toward a "time on blocked apps" total.
export const BLOCKED_APP_USAGE = [
  { id: 'instagram', minutes: 48 },
  { id: 'tiktok', minutes: 32 },
  { id: 'snapchat', minutes: 22 },
]

// How long each unlock buys, and the daily cap for blocked apps.
export const DEFAULT_UNLOCK_MIN = 5
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
