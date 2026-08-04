// Sample 2-week trend data for the "Over time" Insights view — a gentle
// upward trend (58 -> 74) with realistic day-to-day noise. Replaced by real
// figures once there's glasses hardware to read from.

export const DAILY_FOCUS = [58, 61, 59, 63, 65, 62, 66, 68, 67, 70, 69, 72, 71, 74]

export const FOCUS_STREAK_DAYS = 6
export const FOCUS_STREAK_BEST = 9

// There is exactly one intervention in the product: the frame buzzes when
// reactivity goes flat, and that means "get up and take a break". These are
// the numbers on how well that single loop works.
// Volume has to square with the session data: ~4 lapses per session across
// roughly 13 sessions in a fortnight lands near 50, not single digits.
export const BREAK_NUDGES_SENT = 52
export const BREAK_NUDGES_TAKEN = 35
export const RECOVERY_WITH_BREAK_MIN = 3
// Matches the demo session exactly: buzzed at 10:22, reacting again at 10:30.
// An investor can count it off the chart.
export const RECOVERY_WITHOUT_BREAK_MIN = 8

// The qualitative half of the picture: what the student actually typed on the
// block screen to unlock an app. Their own words, kept so patterns surface.
export const UNLOCK_REASONS = [
  {
    id: 'thu',
    day: 'Thursday',
    app: 'instagram',
    text: "I keep thinking about whether Maya replied about the group project and I genuinely can't concentrate until I know, because if she hasn't started her part then there's no point me doing mine tonight.",
  },
  {
    id: 'tue',
    day: 'Tuesday',
    app: 'tiktok',
    text: 'Everyone at lunch was quoting something and I have no idea what they meant. I know that sounds like a stupid reason but I keep drifting off thinking about it instead of the homework in front of me.',
  },
  {
    id: 'mon',
    day: 'Monday',
    app: 'instagram',
    text: "I've done two worksheets already and I think I've earned ten minutes, although I'm aware I told myself the same thing an hour ago and then lost most of the afternoon.",
  },
]

// A read on the above, in plain language rather than a metric.
export const REASONS_THEME =
  'Most of your unlocks are about not missing a conversation, not boredom. Telling friends when you’re studying may do more than any app setting.'
