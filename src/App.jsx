import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import TabBar from './components/TabBar'
import LiveSession from './screens/LiveSession'
import SessionSummary from './screens/SessionSummary'
import GlassesSettings from './screens/GlassesSettings'
import ScheduleSettings from './screens/ScheduleSettings'
import AppBlocking from './screens/AppBlocking'

const SCREENS = {
  live: LiveSession,
  summary: SessionSummary,
  glasses: GlassesSettings,
  schedule: ScheduleSettings,
  blocking: AppBlocking,
}

function App() {
  const [tab, setTab] = useState('live')
  const Screen = SCREENS[tab]

  return (
    <PhoneFrame>
      <Screen />
      <TabBar active={tab} onChange={setTab} />
    </PhoneFrame>
  )
}

export default App
