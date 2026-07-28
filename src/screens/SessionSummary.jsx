import SummaryHeader from '../components/SummaryHeader'
import StatCard from '../components/StatCard'
import SessionChart from '../components/SessionChart'
import InsightCard from '../components/InsightCard'
import { SESSION_STATS, BEST_WINDOW_LABEL } from '../data/sessionData'

export default function SessionSummary() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 flex flex-col gap-4">
      <SummaryHeader />

      <div className="flex gap-2">
        <StatCard
          label="Total focus time"
          value={`${SESSION_STATS.totalFocusMin} min`}
          sub={`of ${SESSION_STATS.sessionLengthMin} min session`}
        />
        <StatCard
          label="Distractions"
          value={SESSION_STATS.distractions}
          sub="brief look-aways"
        />
      </div>

      <SessionChart />

      <StatCard label="Best focus window" value={BEST_WINDOW_LABEL} wide />

      <div className="flex flex-col gap-2">
        <InsightCard icon="clock" text="You focus best in 25-minute bursts." />
        <InsightCard icon="spike" text="Distractions peaked around minute 30." />
        <InsightCard
          icon="streak"
          text="Longest distraction-free streak: 14 minutes."
        />
      </div>
    </div>
  )
}
