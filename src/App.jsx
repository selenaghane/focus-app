import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import PhoneDevice from './components/PhoneDevice'
import TabBar from './components/TabBar'
import LiveSession from './screens/LiveSession'
import Insights from './screens/Insights'
import GlassesSettings from './screens/GlassesSettings'
import ScheduleSettings from './screens/ScheduleSettings'
import InstagramBlockScreen from './screens/InstagramBlockScreen'

const SCREENS = {
  live: LiveSession,
  insights: Insights,
  glasses: GlassesSettings,
  schedule: ScheduleSettings,
}

function App() {
  const [tab, setTab] = useState('live')
  const Screen = SCREENS[tab]

  return (
    <PhoneFrame>
      <PhoneDevice>
        <Screen />
        <TabBar active={tab} onChange={setTab} />
      </PhoneDevice>

      <PhoneDevice>
        <InstagramBlockScreen />
      </PhoneDevice>
    </PhoneFrame>
  )
}

export default App
