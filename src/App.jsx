import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import AppShell from './components/AppShell'
import PhoneFrame from './components/PhoneFrame'
import PhoneDevice from './components/PhoneDevice'
import TabBar from './components/TabBar'
import ScheduleSettings from './screens/ScheduleSettings'
import Settings from './screens/Settings'
import InstagramBlockScreen from './screens/InstagramBlockScreen'
import MonsterScreen from './screens/MonsterScreen'
import { DEMO_MODE } from './config'
import useHashRoute from './hooks/useHashRoute'
import useNow from './hooks/useNow'
import usePersistentState from './hooks/usePersistentState'
import useScreenTime from './hooks/useScreenTime'
import { recordUnlock } from './services/screenTime'
import { syncStatusBar } from './services/nativeShell'
import { DEFAULT_MONSTER } from './data/monsterData'
import { applyAppearance, defaultAppearance } from './data/appearance'
import {
  DEFAULT_GOAL_MIN,
  DEFAULT_UNLOCK_MIN,
  SCREEN_TIME_SOURCE,
  energyFromUsage,
} from './data/screenTimeData'
import { DEFAULT_BLOCKS, activeBlock, nextBlock } from './data/scheduleData'
import { WEEK_HISTORY, snapshotFor } from './data/screenTimeHistory'

const SCREENS = {
  schedule: ScheduleSettings,
  monster: MonsterScreen,
  settings: Settings,
}

const AVAILABLE_TABS = ['schedule', 'monster', 'settings']
const DEFAULT_TAB = 'schedule'
// The block screen isn't a tab — it takes over the whole surface, the way it
// would if the OS had thrown it up over Instagram.
// display slash demo thing
const BLOCK_ROUTE = 'blocked'

function App() {
  const now = useNow()
  const liveUsage = useScreenTime()
  const [route, navigate] = useHashRoute(DEFAULT_TAB)

  // Everything below outlives the session now. A hand-typed URL can name a
  // route that doesn't exist, so the tab is always resolved against the real
  // screen list rather than trusted.
  const [monsterConfig, setMonsterConfig] = usePersistentState(
    'monsterConfig',
    DEFAULT_MONSTER,
  )
  const [goalMin] = usePersistentState('goalMin', DEFAULT_GOAL_MIN)
  const [unlockMin] = usePersistentState('unlockMin', DEFAULT_UNLOCK_MIN)
  const [blocks, setBlocks] = usePersistentState('blocks', DEFAULT_BLOCKS)
  const [autoOn, setAutoOn] = usePersistentState('autoOn', true)
  const [appearance, setAppearance] = usePersistentState(
    'appearance',
    defaultAppearance,
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
  // Historical days aren't off a real bridge, but they're presented as
  // Screen Time figures the same way a bridge's would be, not as unlock
  // grants — so they borrow that label rather than the local-ledger one.
  const demoUsage = isToday
    ? liveUsage
    : { ...historyDays[selectedDay], native: true, sourceLabel: SCREEN_TIME_SOURCE, syncedAt: null }

  // Dark mode, text size, motion and the font are all CSS hanging off
  // attributes on <html>, so they have to be pushed out of React onto the
  // document — that's also what puts them outside the app's own subtree,
  // where the page background lives. Layout effect rather than effect, so
  // the attributes land before the browser paints instead of a frame after.
  useLayoutEffect(() => {
    applyAppearance(appearance)
    // The iOS status bar sits above the web view and doesn't know the app
    // went dark, so its text stays black on a black bar without this.
    syncStatusBar(appearance.darkMode)
  }, [appearance])

  // A hand-typed or bookmarked URL can name a tab that doesn't exist, so the
  // route is always resolved against the real screen list.
  const tab = AVAILABLE_TABS.includes(route) ? route : DEFAULT_TAB
  const Screen = SCREENS[tab]

  // Put the resolved tab in the URL when it doesn't match — a bare '/' or a
  // bookmark to a section that's since been hidden would otherwise show one
  // screen while the address bar claimed another. Replace rather than push,
  // so correcting the URL doesn't leave a dead entry in the back history.
  useEffect(() => {
    if (route === BLOCK_ROUTE) return
    // Checked against the address bar rather than against `route`, because a
    // bare '/' already reads back as the fallback tab — the two would agree
    // while the URL still said nothing at all.
    if (window.location.hash !== `#/${tab}`) navigate(tab, { replace: true })
  }, [route, tab, navigate])

  // Minutes on blocked apps, straight from the Screen Time service — or, in
  // demo mode, whichever day of the week chart is selected. How far past the
  // daily goal that lands is what wears the monster down, so scrubbing the
  // week is what drives the monster's energy in the demo.
  const usedMin = DEMO_MODE ? demoUsage.totalMin : liveUsage.totalMin
  const monsterEnergy = energyFromUsage(usedMin, goalMin)

  // The block screen belongs to whichever focus block is actually running;
  // if none is, it previews the next one so the screen still reads.
  const running = autoOn ? activeBlock(blocks, now) : null
  const upcoming = nextBlock(blocks, now)
  const shownBlock = running || upcoming?.block || null

  // Unlocking spends real minutes on a blocked app, which is what pushes the
  // day further past the goal. Staying focused simply doesn't add any.
  const handleUnlock = useCallback(() => recordUnlock(unlockMin), [unlockMin])
  const handleStayFocused = useCallback(() => {}, [])

  const screenProps = {
    config: monsterConfig,
    onConfigChange: setMonsterConfig,
    energy: monsterEnergy,
    blocks,
    onBlocksChange: setBlocks,
    autoOn,
    onAutoOnChange: setAutoOn,
    now,
    usedMin,
    goalMin,
    appearance,
    onAppearanceChange: setAppearance,
    // The week chart only makes sense as a presentation device — the
    // installed app has just the one, live, real day.
    ...(DEMO_MODE && {
      usage: demoUsage,
      week: { days: weekDays, selectedIndex: selectedDay, onSelect: setSelectedDay },
    }),
    // Demo mode already has the block screen up on its own phone, so it has
    // nowhere to navigate to.
    onOpenBlockScreen: DEMO_MODE ? undefined : () => navigate(BLOCK_ROUTE),
  }

  const blockScreenProps = {
    monsterConfig,
    monsterEnergy,
    block: shownBlock,
    isBlockRunning: Boolean(running),
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
          <Screen {...screenProps} />
          <TabBar active={tab} tabs={AVAILABLE_TABS} onChange={navigate} />
        </PhoneDevice>

        <PhoneDevice>
          <InstagramBlockScreen {...blockScreenProps} />
        </PhoneDevice>
      </PhoneFrame>
    )
  }

  // The block screen takes the whole surface with no nav: it stands in for
  // what the OS shows over a blocked app, which has no tab bar either.
  if (route === BLOCK_ROUTE) {
    return (
      <AppShell>
        <InstagramBlockScreen
          {...blockScreenProps}
          onClose={() => navigate(tab)}
        />
      </AppShell>
    )
  }

  return (
    <AppShell
      nav={<TabBar active={tab} tabs={AVAILABLE_TABS} onChange={navigate} />}
    >
      <Screen {...screenProps} />
    </AppShell>
  )
}

export default App
