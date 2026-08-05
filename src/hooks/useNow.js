import { useEffect, useState } from 'react'
import { DEMO_MODE } from '../config'
import { DEMO_NOW, nowFromClock } from '../data/scheduleData'

const TICK_MS = 15_000

// The schedule's sense of "now", following the wall clock so focus blocks
// start and end when they say they will. Demo mode pins it instead, which is
// what keeps screenshots reproducible.
export default function useNow() {
  const [now, setNow] = useState(() => (DEMO_MODE ? DEMO_NOW : nowFromClock()))

  useEffect(() => {
    if (DEMO_MODE) return undefined

    const tick = () =>
      setNow((prev) => {
        const next = nowFromClock()
        // Hold the previous object while the minute hasn't turned over, so a
        // schedule that hasn't moved doesn't re-render the tree four times a
        // minute.
        return next.day === prev.day && next.min === prev.min ? prev : next
      })

    const id = setInterval(tick, TICK_MS)
    // A backgrounded tab has its timers throttled or paused outright, so the
    // clock can be badly stale by the time someone looks at the app again.
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [])

  return now
}
