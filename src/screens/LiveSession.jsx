import { useState } from 'react'
import StatusPill from '../components/StatusPill'
import FocusGauge from '../components/FocusGauge'
import FocusChart from '../components/FocusChart'
import BiomarkerRow from '../components/BiomarkerRow'
import StrategyCard from '../components/StrategyCard'
import { CURRENT_SCORE, IS_DIPPING } from '../data/sessionData'

export default function LiveSession() {
  const [showStrategy, setShowStrategy] = useState(IS_DIPPING)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <StatusPill />
      <FocusGauge score={CURRENT_SCORE} />
      <FocusChart />
      <BiomarkerRow />
      {showStrategy && (
        <StrategyCard onDismiss={() => setShowStrategy(false)} />
      )}
    </div>
  )
}
