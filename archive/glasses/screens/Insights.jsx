import { useState } from 'react'
import SegmentedControl from '../components/SegmentedControl'
import SessionSummary from './SessionSummary'
import TrendsView from './TrendsView'

export default function Insights() {
  const [view, setView] = useState('This session')

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2.5">
        <h1 className="text-lg font-bold text-slate-900">Insights</h1>
        <SegmentedControl
          options={['This session', 'Over time']}
          value={view}
          onChange={setView}
        />
      </div>

      {view === 'This session' ? <SessionSummary /> : <TrendsView />}
    </div>
  )
}
