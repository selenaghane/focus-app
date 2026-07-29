import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import PhoneDevice from './components/PhoneDevice'
import TabBar from './components/TabBar'
import LiveSession from './screens/LiveSession'
import Insights from './screens/Insights'
import GlassesSettings from './screens/GlassesSettings'
import ScheduleSettings from './screens/ScheduleSettings'
import InstagramBlockScreen from './screens/InstagramBlockScreen'
import MonsterScreen from './screens/MonsterScreen'
import { DEFAULT_MONSTER } from './data/monsterData'
import {
  BASE_USED_MIN,
  DEFAULT_GOAL_MIN,
  DEFAULT_UNLOCK_MIN,
  energyFromUsage,
} from './data/screenTimeData'
import {
  DEFAULT_BLOCKS,
  DEMO_NOW,
  activeBlock,
  nextBlock,
} from './data/scheduleData'

const SCREENS = {
  live: LiveSession,
  insights: Insights,
  glasses: GlassesSettings,
  schedule: ScheduleSettings,
  monster: MonsterScreen,
}

function App() {
  const [tab, setTab] = useState('live')
  const [monsterConfig, setMonsterConfig] = useState(DEFAULT_MONSTER)
  // Minutes on blocked apps today, from Screen Time. The monster's condition
  // is derived from how far past the daily goal this lands.
  const [usedMin, setUsedMin] = useState(BASE_USED_MIN)
  const [goalMin, setGoalMin] = useState(DEFAULT_GOAL_MIN)
  const [unlockMin, setUnlockMin] = useState(DEFAULT_UNLOCK_MIN)
  const monsterEnergy = energyFromUsage(usedMin, goalMin)
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS)
  const [autoOn, setAutoOn] = useState(true)
  const Screen = SCREENS[tab]

  // The block screen belongs to whichever focus block is actually running;
  // if none is, it previews the next one so the mockup still reads.
  const running = autoOn ? activeBlock(blocks, DEMO_NOW) : null
  const upcoming = nextBlock(blocks, DEMO_NOW)
  const shownBlock = running || upcoming?.block || null

  // Unlocking spends real minutes on a blocked app, which is what pushes the
  // day further past the goal. Staying focused simply doesn't add any.
  const handleUnlock = () => setUsedMin((m) => m + unlockMin)
  const handleStayFocused = () => {}

  return (
    <PhoneFrame>
      <PhoneDevice>
        <Screen
          config={monsterConfig}
          onConfigChange={setMonsterConfig}
          energy={monsterEnergy}
          blocks={blocks}
          onBlocksChange={setBlocks}
          autoOn={autoOn}
          onAutoOnChange={setAutoOn}
          now={DEMO_NOW}
          usedMin={usedMin}
          goalMin={goalMin}
          onGoalChange={setGoalMin}
          unlockMin={unlockMin}
          onUnlockChange={setUnlockMin}
        />
        <TabBar active={tab} onChange={setTab} />
      </PhoneDevice>

      <PhoneDevice>
        <InstagramBlockScreen
          monsterConfig={monsterConfig}
          monsterEnergy={monsterEnergy}
          block={shownBlock}
          unlockMin={unlockMin}
          onUnlock={handleUnlock}
          onStayFocused={handleStayFocused}
        />
      </PhoneDevice>
    </PhoneFrame>
  )
}

export default App
