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
  const [monsterEnergy, setMonsterEnergy] = useState(0)
  const Screen = SCREENS[tab]

  const handleUnlock = () => setMonsterEnergy((e) => Math.min(3, e + 1))
  const handleStayFocused = () => setMonsterEnergy((e) => Math.max(0, e - 1))

  return (
    <PhoneFrame>
      <PhoneDevice>
        <Screen
          config={monsterConfig}
          onConfigChange={setMonsterConfig}
          energy={monsterEnergy}
        />
        <TabBar active={tab} onChange={setTab} />
      </PhoneDevice>

      <PhoneDevice>
        <InstagramBlockScreen
          monsterConfig={monsterConfig}
          monsterEnergy={monsterEnergy}
          onUnlock={handleUnlock}
          onStayFocused={handleStayFocused}
        />
      </PhoneDevice>
    </PhoneFrame>
  )
}

export default App
