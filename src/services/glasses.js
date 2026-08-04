// Whether there is a real pair of glasses to talk to.
//
// Same shape as services/screenTime.js: one seam, asked in one place. A native
// shell — or a Web Bluetooth pairing flow — sets `globalThis.__focusGlasses`
// before the app mounts:
//
//   isConnected(): boolean
//   getDevice():   { name, batteryPct, firmware, lastSyncedAt }
//   getSession():  { focusScore, pupilSeries, ... }
//
// Nothing sets it today, so there is no pupil telemetry to show. The screens
// built on it are hidden rather than filled with the sample figures in
// src/data/ — those stay on disk, still wired to their components, for demo
// mode and for building against once hardware exists. Flip this seam and they
// come back.

import { DEMO_MODE } from '../config'

function bridge() {
  return globalThis.__focusGlasses ?? null
}

export function isGlassesConnected() {
  // Demo mode is showing the finished product to a room, sample data and all.
  if (DEMO_MODE) return true
  return Boolean(bridge()?.isConnected?.())
}

export function getGlassesDevice() {
  return bridge()?.getDevice?.() ?? null
}
