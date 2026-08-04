// Focus block scheduling. Times are stored as minutes since midnight so the
// app can actually reason about them — which block is running, which is next
// — rather than just printing a string.

export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Demo mode runs against a pinned clock so screenshots stay deterministic and
// the block screen always has a block to belong to. The app itself uses
// `nowFromClock()` via the useNow hook; only `?demo=1` reaches for this.
export const DEMO_NOW = { day: 0, min: 16 * 60 + 20 } // Monday, 4:20 PM

export function nowFromClock(date = new Date()) {
  return {
    day: (date.getDay() + 6) % 7, // JS weeks start Sunday; ours start Monday
    min: date.getHours() * 60 + date.getMinutes(),
  }
}

export const DEFAULT_BLOCKS = [
  {
    id: 'morning-study',
    label: 'Morning study',
    startMin: 8 * 60,
    endMin: 9 * 60 + 30,
    days: [1, 1, 1, 1, 1, 0, 0],
    enabled: true,
  },
  {
    id: 'homework',
    label: 'Homework block',
    startMin: 16 * 60,
    endMin: 17 * 60 + 30,
    days: [1, 1, 1, 1, 1, 0, 0],
    enabled: true,
  },
  {
    id: 'weekend-reading',
    label: 'Weekend reading',
    startMin: 10 * 60,
    endMin: 11 * 60,
    days: [0, 0, 0, 0, 0, 1, 1],
    enabled: false,
  },
]

export function createBlock() {
  return {
    id: `block-${Date.now()}`,
    label: '',
    startMin: 15 * 60,
    endMin: 16 * 60,
    days: [1, 1, 1, 1, 1, 0, 0],
    enabled: true,
  }
}

export function formatTime(min) {
  const total = ((min % 1440) + 1440) % 1440
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`
}

export function formatRange(startMin, endMin) {
  const sameMeridiem = Math.floor(startMin / 60) < 12 === Math.floor(endMin / 60) < 12
  const start = sameMeridiem
    ? formatTime(startMin).replace(/\s[AP]M$/, '')
    : formatTime(startMin)
  return `${start} – ${formatTime(endMin)}`
}

export function formatDuration(startMin, endMin) {
  const mins = Math.max(0, endMin - startMin)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export function daysSummary(days) {
  const count = days.filter(Boolean).length
  if (count === 0) return 'No days selected'
  if (count === 7) return 'Every day'
  const isWeekdays = days.every((d, i) => (i < 5 ? d === 1 : d === 0))
  if (isWeekdays) return 'Weekdays'
  const isWeekends = days.every((d, i) => (i >= 5 ? d === 1 : d === 0))
  if (isWeekends) return 'Weekends'
  return days
    .map((d, i) => (d ? DAY_LABELS[i] : null))
    .filter(Boolean)
    .join(' ')
}

export function isBlockActive(block, now) {
  return Boolean(
    block.enabled &&
      block.days[now.day] &&
      now.min >= block.startMin &&
      now.min < block.endMin,
  )
}

export function activeBlock(blocks, now) {
  return blocks.find((b) => isBlockActive(b, now)) || null
}

// Nearest upcoming block, searching forward through the week.
export function nextBlock(blocks, now) {
  const live = blocks.filter((b) => b.enabled && b.days.some(Boolean))
  let best = null

  live.forEach((b) => {
    for (let offset = 0; offset < 7; offset += 1) {
      const day = (now.day + offset) % 7
      if (!b.days[day]) continue
      const minutesAway = offset * 1440 + b.startMin - now.min
      if (minutesAway <= 0) continue
      if (!best || minutesAway < best.minutesAway) {
        best = { block: b, minutesAway, day }
      }
      break
    }
  })

  return best
}

export function whenLabel(next, now) {
  if (!next) return null
  if (next.day === now.day && next.minutesAway < 1440) return 'today'
  if (next.day === (now.day + 1) % 7) return 'tomorrow'
  return DAY_NAMES[next.day]
}

// <input type="time"> speaks "HH:MM".
export function toTimeInput(min) {
  const h = Math.floor(min / 60)
  return `${String(h).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

export function fromTimeInput(value) {
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}
