import StatCard from '../components/StatCard'
import SessionChart from '../components/SessionChart'
import InsightCard from '../components/InsightCard'
import {
  SESSION_STATS,
  BEST_WINDOW_LABEL,
  SESSION_START_LABEL,
  SESSION_END_LABEL,
  LONGEST_LAPSE_LABEL,
} from '../data/sessionData'

export default function SessionSummary() {
  return (
    <>
      <p className="text-center text-xs text-slate-400 -mt-1">
        Today, {SESSION_START_LABEL} – {SESSION_END_LABEL}
      </p>

      <div className="flex gap-2">
        <StatCard
          label="Time engaged"
          value={`${SESSION_STATS.minutesEngaged} min`}
          sub={`of ${SESSION_STATS.sessionLengthMin} min session`}
        />
        <StatCard label="Attention lapses" value={SESSION_STATS.lapses} />
      </div>

      <StatCard label="Best focus window" value={BEST_WINDOW_LABEL} wide />

      <div className="flex flex-col gap-2">
        <InsightCard
          icon="clock"
          text={`Longest engaged stretch: ${SESSION_STATS.longestStreak} minutes.`}
        />
        <InsightCard
          icon="spike"
          text={`You had your longest distracted period at ${LONGEST_LAPSE_LABEL}.`}
        />
      </div>

      <SessionChart />
    </>
  )
}
