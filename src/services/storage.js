// Everything the app remembers between launches: the schedule, the monster,
// the day's usage and every setting.
//
// It all lives under one versioned key. When a shape changes, bump
// SCHEMA_VERSION and stale data is dropped in exactly one place, rather than
// half-migrated objects lingering in people's browsers.
// Github reload currently resets it though

import { DEMO_MODE } from '../config'

const STORAGE_KEY = 'focus-app.state'
const SCHEMA_VERSION = 1

// Safari in private mode throws on localStorage rather than returning null,
// and a web view can have storage disabled outright. Every touch is guarded
// and degrades to a memory-only store: settings then last for the session
// only, instead of crashing the app.
//
// Demo mode starts in that state deliberately. A walkthrough should always
// open on the day the screens are built around rather than carrying over
// whatever the last one clicked, and it must not overwrite the state of
// anyone who has actually been using the app.
let memoryOnly = DEMO_MODE ? {} : null

function readAll() {
  if (memoryOnly) return memoryOnly
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    // A version we don't recognise is treated as absent. Losing a stored
    // preference is a much smaller harm than rendering against a shape the
    // current code doesn't understand.
    if (parsed?.version !== SCHEMA_VERSION) return {}
    return parsed.data ?? {}
  } catch {
    memoryOnly = {}
    return memoryOnly
  }
}

function writeAll(data) {
  if (memoryOnly) {
    memoryOnly = data
    return
  }
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, data }),
    )
  } catch {
    memoryOnly = data
  }
}

export function loadValue(key, fallback) {
  const value = readAll()[key]
  return value === undefined ? fallback : value
}

export function saveValue(key, value) {
  writeAll({ ...readAll(), [key]: value })
}

// Used by the reset control in settings, and handy when a demo needs a clean
// slate. Clears our key only — nothing else in the origin's storage.
export function clearStoredState() {
  if (DEMO_MODE) {
    memoryOnly = {}
    return
  }
  memoryOnly = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    memoryOnly = {}
  }
}