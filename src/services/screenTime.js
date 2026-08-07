// The one place the app talks to Screen Time.
//
// Every "how long has been spent on blocked apps today" figure in the UI
// comes through this module, so there is exactly one seam to replace when the
// app gets a native shell — no screen, card or hook has to change.
//
// THE NATIVE CONTRACT
// A native shell sets `globalThis.__focusScreenTime` before the app mounts:
//
//   getTodayUsage(): { date: 'YYYY-MM-DD',
//                      apps: { [appId]: minutes },
//                      syncedAt?: string }
//   subscribe?(fn):  () => void      // called when the OS reports new totals
//
// On iOS that object is backed by DeviceActivity + FamilyControls (which need
// a Screen Time authorisation prompt and a paid developer account); on
// Android, UsageStatsManager. Nothing sets it today, so the app falls through
// to the local ledger below.
//
// THE LOCAL LEDGER
// A browser cannot see time spent in other apps. What it can see is the
// minutes this app handed out itself, so unlock grants are recorded here and
// counted as usage. That is a real, honest number — just an incomplete one,
// which is why the UI labels it as recorded on-device rather than as Screen
// Time until a bridge shows up.

import { DEMO_MODE } from '../config'
import { BLOCKED_APP_USAGE, SCREEN_TIME_SOURCE } from '../data/screenTimeData'
import { loadValue, saveValue } from './storage'

const LEDGER_KEY = 'screenTime.ledger'
const LOCAL_SOURCE = 'unlocks recorded on this device'
const REFRESH_MS = 60_000

// Local calendar day. toISOString() would roll the day over at UTC midnight,
export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function seededApps() {
  return BLOCKED_APP_USAGE.reduce((acc, a) => ({ ...acc, [a.id]: a.minutes }), {})
}

function emptyLedger(date) {
  // A day starts at zero. Demo mode starts mid-afternoon with a day's worth
  // of scrolling already banked, so the screens have something to show.
  //demo mode not used anymore or for real product, leaving in case need to demo again
  return { date, apps: DEMO_MODE ? seededApps() : {} }
}

function readLedger(now) {
  const today = todayKey(now)
  const stored = loadValue(LEDGER_KEY, null)
  // Rolling over on *read* rather than on write means an app left open
  // overnight starts the new day clean, without needing to have been touched
  // at midnight.
  if (!stored || stored.date !== today) return emptyLedger(today)
  return stored
}

function nativeBridge() {
  return globalThis.__focusScreenTime ?? null
}

export function hasNativeScreenTime() {
  return Boolean(nativeBridge())
}

function computeSnapshot(now = new Date()) {
  const bridge = nativeBridge()
  const raw = bridge ? bridge.getTodayUsage() : readLedger(now)
  const apps = raw?.apps ?? {}

  const perApp = Object.entries(apps)
    .map(([id, minutes]) => ({ id, minutes }))
    .filter((a) => a.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  return {
    date: raw?.date ?? todayKey(now),
    perApp,
    totalMin: perApp.reduce((sum, a) => sum + a.minutes, 0),
    native: Boolean(bridge),
    sourceLabel: bridge ? SCREEN_TIME_SOURCE : LOCAL_SOURCE,
    syncedAt: raw?.syncedAt ?? null,
  }
}

// --- external store ---------------------------------------------------
// useSyncExternalStore requires getSnapshot to return a stable object, so the
// snapshot is cached and only replaced when something has genuinely changed.
// Rebuilding it on every call would re-render forever.

let snapshot = computeSnapshot()
const listeners = new Set()
let timer = null
let stopNative = null

function sameSnapshot(a, b) {
  return (
    a.date === b.date &&
    a.totalMin === b.totalMin &&
    a.native === b.native &&
    a.syncedAt === b.syncedAt &&
    a.perApp.length === b.perApp.length &&
    a.perApp.every((x, i) => x.id === b.perApp[i].id && x.minutes === b.perApp[i].minutes)
  )
}

function refresh() {
  const next = computeSnapshot()
  if (sameSnapshot(snapshot, next)) return
  snapshot = next
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  if (!timer) {
    // The day rolls over, and a native bridge gets fresh totals from the OS,
    // while the app is just sitting open. Poll slowly rather than trusting
    // the snapshot taken at startup.
    timer = setInterval(refresh, REFRESH_MS)
    stopNative = nativeBridge()?.subscribe?.(refresh) ?? null
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) return
    clearInterval(timer)
    timer = null
    stopNative?.()
    stopNative = null
  }
}

export function getSnapshot() {
  return snapshot
}

// --- writes -----------------------------------------------------------

// Spending an unlock costs real minutes on a blocked app. With a native
// bridge the OS reports that time itself, so recording it here as well would
// double-count it.
export function recordUnlock(minutes, appId = 'instagram', now = new Date()) {
  if (nativeBridge() || !(minutes > 0)) return
  const ledger = readLedger(now)
  saveValue(LEDGER_KEY, {
    ...ledger,
    apps: { ...ledger.apps, [appId]: (ledger.apps[appId] ?? 0) + minutes },
  })
  refresh()
}

export function clearUsage(now = new Date()) {
  saveValue(LEDGER_KEY, { date: todayKey(now), apps: {} })
  refresh()
}
