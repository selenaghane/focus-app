import { useCallback, useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import PhoneFrame from './components/PhoneFrame'
import PhoneDevice from './components/PhoneDevice'
import InsightsScreen from './screens/InsightsScreen'
import InstagramBlockScreen from './screens/InstagramBlockScreen'
import { DEMO_MODE } from './config'
import useHashRoute from './hooks/useHashRoute'
import usePersistentState from './hooks/usePersistentState'
import useScreenTime from './hooks/useScreenTime'
import { recordUnlock } from './services/screenTime'
import { APP_LIST } from './data/blockingData'
import { DEFAULT_GOAL_MIN, DEFAULT_UNLOCK_MIN } from './data/screenTimeData'
import { WEEK_HISTORY, snapshotFor } from './data/screenTimeHistory'

const DEFAULT_ROUTE = 'insights'
// The block screen takes over the whole surface, the way it would if the OS
// had thrown it up over Instagram — it isn't part of the normal flow.
const BLOCK_ROUTE = 'blocked'

function App() {
  const liveUsage = useScreenTime()
  const [route, navigate] = useHashRoute(DEFAULT_ROUTE)

  const [goalMin] = usePersistentState('goalMin', DEFAULT_GOAL_MIN)
  const [unlockMin] = usePersistentState('unlockMin', DEFAULT_UNLOCK_MIN)
  // Only the ids are stored, not whole app records: that way adding an app to
  // APP_LIST later actually shows up for people who already have state
  // saved, instead of being masked by a stale copy of the old list.
  const [blockedIds, setBlockedIds] = usePersistentState(
    'blockedAppIds',
    APP_LIST.filter((a) => a.blocked).map((a) => a.id),
  )

  // Demo-only: which day of the week chart is selected. Six hardcoded days
  // plus "Today" (the real, live ledger) — index 6 is "Today", so the demo
  // opens on the same live behaviour it always has.
  const [selectedDay, setSelectedDay] = useState(WEEK_HISTORY.length)
  const historyDays = WEEK_HISTORY.map((entry) => ({
    label: entry.day,
    ...snapshotFor(entry),
  }))
  const weekDays = [...historyDays, { label: 'Today', ...liveUsage }]
  const isToday = selectedDay === weekDays.length - 1
  const demoUsage = isToday ? liveUsage : historyDays[selectedDay]

  // The window Insights ranks apps against — the demo's week of history plus
  // today, or just today outside demo mode, which is all a browser without a
  // native bridge can ever really know.
  const usageDays = DEMO_MODE ? weekDays : [{ perApp: liveUsage.perApp }]
  const toggleApp = useCallback(
    (id) =>
      setBlockedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [setBlockedIds],
  )

  // A hand-typed or bookmarked URL can name a route that doesn't exist
  // anymore (an old tab, say) — anything but the block screen normalizes
  // back to the one real screen there is.
  useEffect(() => {
    if (route === BLOCK_ROUTE) return
    if (window.location.hash !== `#/${DEFAULT_ROUTE}`) {
      navigate(DEFAULT_ROUTE, { replace: true })
    }
  }, [route, navigate])

  // Minutes on blocked apps, straight from the Screen Time service — or, in
  // demo mode, whichever day of the week chart is selected.
  const usedMin = DEMO_MODE ? demoUsage.totalMin : liveUsage.totalMin

  // Unlocking spends real minutes on a blocked app, which is what pushes the
  // day further past the goal. Staying focused simply doesn't add any.
  const handleUnlock = useCallback(() => recordUnlock(unlockMin), [unlockMin])
  const handleStayFocused = useCallback(() => {}, [])

  const screenProps = {
    days: usageDays,
    blockedIds,
    onToggleApp: toggleApp,
    usedMin,
    goalMin,
    // The week chart only makes sense as a presentation device — the
    // installed app has just the one, live, real day.
    ...(DEMO_MODE && {
      usage: demoUsage,
      week: { days: weekDays, selectedIndex: selectedDay, onSelect: setSelectedDay },
    }),
  }

  const blockScreenProps = {
    unlockMin,
    onUnlock: handleUnlock,
    onStayFocused: handleStayFocused,
  }

  // Demo mode draws two phones side by side, one running the app and one
  // showing what a blocked app looks like. Seeing both at once is the
  // clearest way to explain the idea on a laptop, which is worth a layout the
  // installed app has no use for.
  if (DEMO_MODE) {
    return (
      <PhoneFrame>
        <PhoneDevice>
          <InsightsScreen {...screenProps} />
        </PhoneDevice>

        <PhoneDevice>
          <InstagramBlockScreen {...blockScreenProps} />
        </PhoneDevice>
      </PhoneFrame>
    )
  }

  // The block screen takes the whole surface with no nav: it stands in for
  // what the OS shows over a blocked app.
  if (route === BLOCK_ROUTE) {
    return (
      <AppShell>
        <InstagramBlockScreen
          {...blockScreenProps}
          onClose={() => navigate(DEFAULT_ROUTE)}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <InsightsScreen {...screenProps} />
    </AppShell>
  )
}

export default App
