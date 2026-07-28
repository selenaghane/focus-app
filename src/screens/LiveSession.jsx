import StatusPill from '../components/StatusPill'
import FocusGauge from '../components/FocusGauge'
import FocusChart from '../components/FocusChart'
import BiomarkerRow from '../components/BiomarkerRow'
import { CURRENT_SCORE } from '../data/sessionData'

export default function LiveSession() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 flex flex-col gap-4">
      <StatusPill />
      <FocusGauge score={CURRENT_SCORE} />
      <FocusChart />
      <BiomarkerRow />
    </div>
  )
}
