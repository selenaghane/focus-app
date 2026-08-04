import { useCallback, useEffect, useLayoutEffect } from 'react'
import AppShell from './components/AppShell'
import PhoneFrame from './components/PhoneFrame'
import PhoneDevice from './components/PhoneDevice'
import TabBar from './components/TabBar'
import LiveSession from './screens/LiveSession'
import Insights from './screens/Insights'
import GlassesSettings from './screens/GlassesSettings'
import ScheduleSettings from './screens/ScheduleSettings'
import InstagramBlockScreen from './screens/InstagramBlockScreen'
import MonsterScreen from './screens/MonsterScreen'
import { DEMO_MODE } from './config'
import useHashRoute from './hooks/useHashRoute'
import useNow from './hooks/useNow'
import usePersistentState from './hooks/usePersistentState'
import useScreenTime from './hooks/useScreenTime'
import { recordUnlock } from './services/screenTime'
import { isGlassesConnected } from './services/glasses'
import { DEFAULT_MONSTER } from './data/monsterData'
import { applyAppearance, defaultAppearance } from './data/appearance'
import {
  DEFAULT_GOAL_MIN,
  DEFAULT_UNLOCK_MIN,
  energyFromUsage,
} from './data/screenTimeData'
import { DEFAULT_BLOCKS, activeBlock, nextBlock } from './data/scheduleData'

const SCREENS = {
  live: LiveSession,
  insights: Insights,
  glasses: GlassesSettings,
  schedule: ScheduleSettings,
  monster: MonsterScreen,
}

const TAB_ORDER = ['live', 'insights', 'glasses', 'schedule', 'monster']

// Live and Insights are nothing but glasses telemetry — a focus score, pupil
// reactivity, and the trends built from them. With no glasses there is no
// reading to show, so they stay out of the app rather than displaying the
// sample figures as if they were measurements.
const GLASSES_ONLY_TABS = ['live', 'insights']

// Which tab to land on, best first. The head of this list is usually
// available; when it isn't, the next real screen takes over.
const LANDING_ORDER = ['live', 'schedule', 'monster', 'glasses']

// Fixed for the session: the bridge is installed before the app mounts, and
// demo mode is read from the URL at startup.
const GLASSES_CONNECTED = isGlassesConnected()
const AVAILABLE_TABS = TAB_ORDER.filter(
  (id) => GLASSES_CONNECTED || !GLASSES_ONLY_TABS.includes(id),
)
const DEFAULT_TAB = LANDING_ORDER.find((id) => AVAILABLE_TABS.includes(id))
// The block screen isn't a tab — it takes over the whole surface, the way it
// would if the OS had thrown it up over Instagram.
const BLOCK_ROUTE = 'blocked'

function App() {
  const now = useNow()
  const usage = useScreenTime()
  const [route, navigate] = useHashRoute(DEFAULT_TAB)

  // Everything below outlives the session now. A hand-typed URL can name a
  // route that doesn't exist, so the tab is always resolved against the real
  // screen list rather than trusted.
  const [monsterConfig, setMonsterConfig] = usePersistentState(
    'monsterConfig',
    DEFAULT_MONSTER,
  )
  const [goalMin, setGoalMin] = usePersistentState('goalMin', DEFAULT_GOAL_MIN)
  const [unlockMin, setUnlockMin] = usePersistentState(
    'unlockMin',
    DEFAULT_UNLOCK_MIN,
  )
  const [blocks, setBlocks] = usePersistentState('blocks', DEFAULT_BLOCKS)
  const [autoOn, setAutoOn] = usePersistentState('autoOn', true)
  const [appearance, setAppearance] = usePersistentState(
    'appearance',
    defaultAppearance,
  )

  // Dark mode, text size, motion and the font are all CSS hanging off
  // attributes on <html>, so they have to be pushed out of React onto the
  // document — that's also what puts them outside the app's own subtree,
  // where the page background lives. Layout effect rather than effect, so
  // the attributes land before the browser paints instead of a frame after.
  useLayoutEffect(() => {
    applyAppearance(appearance)
  }, [appearance])

  // A hand-typed or bookmarked URL can name a tab that doesn't exist, or one
  // that's hidden because the hardware behind it isn't connected, so the
  // route is always resolved against what's actually available.
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

  // Minutes on blocked apps today, straight from the Screen Time service.
  // How far past the daily goal that lands is what wears the monster down.
  const usedMin = usage.totalMin
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
    onGoalChange: setGoalMin,
    unlockMin,
    onUnlockChange: setUnlockMin,
    appearance,
    onAppearanceChange: setAppearance,
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
