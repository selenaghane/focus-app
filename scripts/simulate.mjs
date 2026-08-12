// Tuning harness for src/engine/adaptiveLimits.js. Runs the engine over all
// 30 days of every persona in src/data/synthetic/ and prints a day-by-day
// table — this is what DEFAULT_CONFIG (and each persona's targetMin) gets
// tuned against before any of this touches the real app.
//
// Usage:
//   npm run simulate
//   npm run simulate -- --persona=late-night-tiktok --target=30
//   npm run simulate -- --stepSize=8 --threshold=0.7
//
// Any DEFAULT_CONFIG key (stepSize, recoveryFactor, window, threshold,
// baselineWindow, initialCut) can be overridden the same way --target
// overrides targetMin.

import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_CONFIG, calibrateInitialLimit, nextTotalLimit } from '../src/engine/adaptiveLimits.js'
import { isAdherentDay } from '../src/engine/adherence.js'

const SYNTHETIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'synthetic')

// Per-persona floor, overridable in bulk with --target. Real defaults would
// come from wherever the app collects a user's own target; these are just
// starting points for tuning.
const TARGET_MIN_BY_PERSONA = {
  'late-night-tiktok': 20,
  'steady-instagram': 20,
  'weekend-blowup': 20,
}

function parseArgs(argv) {
  const args = {}
  for (const raw of argv) {
    const match = /^--([^=]+)=(.*)$/.exec(raw)
    if (match) args[match[1]] = match[2]
  }
  return args
}

function buildConfig(args) {
  const config = { ...DEFAULT_CONFIG }
  for (const key of Object.keys(DEFAULT_CONFIG)) {
    if (args[key] !== undefined) config[key] = Number(args[key])
  }
  return config
}

async function loadPersonas(only) {
  const files = (await readdir(SYNTHETIC_DIR)).filter(
    (f) => f.endsWith('.json') && f !== 'index.json' && (!only || f === `${only}.json`),
  )
  return Promise.all(
    files.map(async (file) => JSON.parse(await readFile(join(SYNTHETIC_DIR, file), 'utf8'))),
  )
}

function round1(n) {
  return Math.round(n * 10) / 10
}

function average(values) {
  return values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length
}

// Walks one persona's 30 days: an unenforced baseline window, then the
// engine taking over — each row is the limit that was actually in force
// that day and why, not the limit being computed for the day after.
function simulatePersona(persona, targetMin, config) {
  const { baselineWindow } = config
  const baselineDays = persona.days.slice(0, baselineWindow)
  const baselineActuals = baselineDays.map((d) => d.totalMin)

  const rows = baselineDays.map((day, i) => ({
    day: i + 1,
    date: day.date,
    limit: '—',
    actual: day.totalMin,
    adherent: '—',
    note: 'baseline (observing, unenforced)',
  }))

  let currentLimit = calibrateInitialLimit(baselineActuals, targetMin, config)
  let note = `initial limit calibrated from ${baselineWindow}-day baseline avg`
  const history = []

  const remaining = persona.days.slice(baselineWindow)
  for (let i = 0; i < remaining.length; i += 1) {
    const day = remaining[i]
    const limitToday = currentLimit
    const adherent = isAdherentDay(day.totalMin, limitToday)

    rows.push({
      day: baselineWindow + i + 1,
      date: day.date,
      limit: round1(limitToday),
      actual: day.totalMin,
      adherent: adherent ? 'yes' : 'no',
      note,
    })

    history.push({ adherent })
    const result = nextTotalLimit(currentLimit, day.totalMin, history, targetMin, config)
    currentLimit = result.limit
    note = result.reason
  }

  return { rows, baselineAvg: average(baselineActuals), initialLimit: rows[baselineWindow]?.limit ?? null }
}

function printTable(persona, targetMin, config, { rows, baselineAvg, initialLimit }) {
  console.log(`\n=== ${persona.label} (${persona.id}) — targetMin=${targetMin} ===`)
  console.log(
    `config: stepSize=${config.stepSize} recoveryFactor=${config.recoveryFactor} ` +
      `window=${config.window} threshold=${config.threshold} ` +
      `baselineWindow=${config.baselineWindow} initialCut=${config.initialCut}`,
  )
  console.log(
    `baseline: days 1-${config.baselineWindow}, avg ${round1(baselineAvg)} min/day -> initial limit ${initialLimit}`,
  )
  console.log('')

  const cols = [
    ['day', 4],
    ['date', 12],
    ['limit', 7],
    ['actual', 7],
    ['adherent', 9],
    ['note', 70],
  ]
  console.log(cols.map(([name, w]) => String(name).padEnd(w)).join(' '))
  console.log(cols.map(([, w]) => '-'.repeat(w)).join(' '))

  rows.forEach((row) => {
    console.log(
      cols.map(([name, w]) => String(row[name]).padEnd(w)).join(' '),
    )
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const config = buildConfig(args)
  const personas = await loadPersonas(args.persona)

  if (personas.length === 0) {
    console.error(args.persona ? `No persona found matching "${args.persona}"` : 'No personas found')
    process.exitCode = 1
    return
  }

  personas.forEach((persona) => {
    const targetMin = args.target !== undefined ? Number(args.target) : TARGET_MIN_BY_PERSONA[persona.id] ?? 20
    printTable(persona, targetMin, config, simulatePersona(persona, targetMin, config))
  })
}

main()
