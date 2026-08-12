// Synthetic screen-time logs for a handful of fake teen personas, 30 days
// each. This is the test harness for anything downstream that reads usage
// data — the Insights recommendation logic, a future real model, a demo —
// without needing anyone's actual phone.
//
// Run with `npm run synthetic-data`. Output is seeded (see PERSONA_SEED
// below), so re-running on the same day reproduces byte-identical files
// until a persona's shape actually changes — real randomness would make
// every diff noisy for no reason.
//
// Each day is a list of sessions (app + start timestamp + minutes), plus
// the same perApp/totalMin rollup services/screenTime.js already produces,
// so this can drop into the app's existing shapes without a translation
// layer.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'synthetic')
const DAY_COUNT = 30
const DAY_MS = 24 * 60 * 60 * 1000

// --- seeded RNG ----------------------------------------------------------
// mulberry32: small, deterministic, plenty good for fake usage data. Each
// persona/day pair gets its own seed so adding a persona never reshuffles
// the days already generated for the others.
function mulberry32(seed) {
  let a = seed
  return function rand() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFor(personaIndex, dayIndex) {
  return personaIndex * 100_000 + dayIndex
}

function randInt(rand, min, max) {
  return Math.floor(min + rand() * (max - min + 1))
}

// True with probability `p` (0–1).
function chance(rand, p) {
  return rand() < p
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

// A session starting at `startMin` minutes past that day's midnight.
// `startMin` can run past 1440 for a late-night session that doesn't start
// until after midnight by the clock — it still belongs to the day someone
// would call "today" while they're scrolling, not the calendar date the
// timestamp lands on.
function sessionAt(dayStart, startMin, minutes, app) {
  const start = new Date(dayStart.getTime() + startMin * 60_000)
  return { app, start: start.toISOString(), minutes }
}

function rollUp(sessions) {
  const sums = {}
  sessions.forEach(({ app, minutes }) => {
    sums[app] = (sums[app] ?? 0) + minutes
  })
  const perApp = Object.entries(sums)
    .map(([id, minutes]) => ({ id, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
  return { perApp, totalMin: perApp.reduce((sum, a) => sum + a.minutes, 0) }
}

// --- personas --------------------------------------------------------
// `genDay(rand, dow)` returns raw sessions as { app, startMin, minutes }
// relative to that day's midnight; dow is 0 (Sunday) – 6 (Saturday).

const PERSONAS = [
  {
    id: 'late-night-tiktok',
    label: 'Late-night TikTok scroller',
    blurb:
      'Barely touches her phone by day, then one long TikTok binge well past midnight most nights.',
    genDay(rand) {
      const sessions = []

      // A snapchat check-in or two during the afternoon/evening.
      if (chance(rand, 0.7)) {
        sessions.push({
          app: 'snapchat',
          startMin: randInt(rand, 15 * 60, 20 * 60 + 30),
          minutes: randInt(rand, 3, 12),
        })
      }
      if (chance(rand, 0.35)) {
        sessions.push({
          app: 'snapchat',
          startMin: randInt(rand, 20 * 60 + 30, 22 * 60),
          minutes: randInt(rand, 2, 8),
        })
      }

      // Some nights there's a smaller warm-up session before the main one.
      if (chance(rand, 0.25)) {
        sessions.push({
          app: 'tiktok',
          startMin: randInt(rand, 19 * 60, 21 * 60 + 30),
          minutes: randInt(rand, 10, 30),
        })
      }

      // The main event: starts late, sometimes past midnight (negative
      // startMin relative to the *next* day — here it's just late in this
      // one, 22:30–25:30 i.e. up to 1:30am).
      sessions.push({
        app: 'tiktok',
        startMin: randInt(rand, 22 * 60 + 30, 25 * 60 + 30),
        minutes: randInt(rand, 35, 150),
      })

      // Sometimes a youtube rabbit hole follows right after.
      if (chance(rand, 0.2)) {
        sessions.push({
          app: 'youtube',
          startMin: randInt(rand, 24 * 60, 26 * 60 + 30),
          minutes: randInt(rand, 12, 45),
        })
      }

      return sessions
    },
  },

  {
    id: 'steady-instagram',
    label: 'Steady all-day Instagram user',
    blurb:
      'Checks Instagram in short bursts all day long — mornings, lunch, after school, before bed — with very little day-to-day variance.',
    genDay(rand) {
      const sessions = [
        { app: 'instagram', startMin: randInt(rand, 7 * 60, 8 * 60 + 15), minutes: randInt(rand, 5, 15) },
        { app: 'instagram', startMin: randInt(rand, 12 * 60, 13 * 60 + 15), minutes: randInt(rand, 8, 18) },
        { app: 'instagram', startMin: randInt(rand, 15 * 60 + 30, 17 * 60 + 15), minutes: randInt(rand, 10, 25) },
        { app: 'instagram', startMin: randInt(rand, 19 * 60 + 30, 21 * 60 + 45), minutes: randInt(rand, 15, 35) },
      ]

      // A light tiktok habit, present some days and not others.
      if (chance(rand, 0.3)) {
        sessions.push({
          app: 'tiktok',
          startMin: randInt(rand, 16 * 60, 22 * 60),
          minutes: randInt(rand, 10, 25),
        })
      }

      return sessions
    },
  },

  {
    id: 'weekend-blowup',
    label: 'Fine on weekdays, blows up on weekends',
    blurb:
      'Barely opens anything Monday–Friday, then loses most of Saturday and Sunday to Instagram, TikTok, YouTube and Snapchat.',
    genDay(rand, dow) {
      const isWeekend = dow === 0 || dow === 6
      if (!isWeekend) {
        // A fully offline day now and then; otherwise one short evening
        // session on whichever app happens to catch their eye.
        if (chance(rand, 0.15)) return []
        return [
          {
            app: pick(rand, ['instagram', 'tiktok', 'youtube']),
            startMin: randInt(rand, 19 * 60, 21 * 60 + 30),
            minutes: randInt(rand, 10, 35),
          },
        ]
      }

      // Weekend: several sessions scattered across the whole day.
      const apps = ['instagram', 'tiktok', 'youtube', 'snapchat']
      const sessionCount = randInt(rand, 3, 6)
      const sessions = []
      for (let i = 0; i < sessionCount; i += 1) {
        sessions.push({
          app: pick(rand, apps),
          startMin: randInt(rand, 10 * 60, 23 * 60 + 30),
          minutes: randInt(rand, 15, 70),
        })
      }
      return sessions
    },
  },
]

// --- generate ----------------------------------------------------------

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

function generatePersona(persona, personaIndex, today) {
  const days = []

  for (let offset = DAY_COUNT - 1; offset >= 0; offset -= 1) {
    const dayStart = new Date(today.getTime() - offset * DAY_MS)
    const rand = mulberry32(seedFor(personaIndex, offset))
    const raw = persona.genDay(rand, dayStart.getDay())
    const sessions = raw
      .map(({ app, startMin, minutes }) => sessionAt(dayStart, startMin, minutes, app))
      .sort((a, b) => a.start.localeCompare(b.start))

    days.push({ date: isoDate(dayStart), sessions, ...rollUp(sessions) })
  }

  return { id: persona.id, label: persona.label, blurb: persona.blurb, days }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  // Midnight today — the log always covers "the last 30 days" relative to
  // whenever this is run, rather than a date that goes stale in the repo.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const index = []

  for (const [personaIndex, persona] of PERSONAS.entries()) {
    const data = generatePersona(persona, personaIndex, today)
    const file = `${persona.id}.json`
    await writeFile(join(OUT_DIR, file), `${JSON.stringify(data, null, 2)}\n`)

    const avgMin = Math.round(
      data.days.reduce((sum, d) => sum + d.totalMin, 0) / data.days.length,
    )
    console.log(`wrote src/data/synthetic/${file} (avg ${avgMin} min/day)`)

    index.push({ id: persona.id, label: persona.label, blurb: persona.blurb, file })
  }

  await writeFile(
    join(OUT_DIR, 'index.json'),
    `${JSON.stringify({ generatedAt: today.toISOString(), dayCount: DAY_COUNT, personas: index }, null, 2)}\n`,
  )
  console.log('wrote src/data/synthetic/index.json')
}

main()
