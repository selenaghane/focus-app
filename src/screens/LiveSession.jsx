import { useState } from 'react'
import StatusPill from '../components/StatusPill'
import FocusGauge from '../components/FocusGauge'
import PupilChart from '../components/PupilChart'
import PupilStatRow from '../components/PupilStatRow'
import StrategyCard from '../components/StrategyCard'
import { CURRENT_SCORE, NEEDS_NUDGE } from '../data/sessionData'

export default function LiveSession() {
  const [showStrategy, setShowStrategy] = useState(NEEDS_NUDGE)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <StatusPill />
      <FocusGauge score={CURRENT_SCORE} />
      <PupilChart />
      <PupilStatRow />
      {showStrategy && <StrategyCard onDismiss={() => setShowStrategy(false)} />}
    </div>
  )
}
