import StatCard from '../components/StatCard'
import SessionChart from '../components/SessionChart'
import InsightCard from '../components/InsightCard'
import {
  SESSION_STATS,
  BEST_WINDOW_LABEL,
  SESSION_START_LABEL,
  SESSION_END_LABEL,
} from '../data/sessionData'

export default function SessionSummary() {
  return (
    <>
      <p className="text-center text-xs text-slate-400 -mt-1">
        Today, {SESSION_START_LABEL} – {SESSION_END_LABEL}
      </p>

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
    </>
  )
}
