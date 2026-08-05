import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from '../services/screenTime'

// Today's usage, from whichever source is available — the local unlock ledger
// now, a native Screen Time bridge later. Components get re-rendered when the
// numbers change or the day rolls over, without knowing which is which.
export default function useScreenTime() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
