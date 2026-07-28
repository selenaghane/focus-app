import StatCard from '../components/StatCard'
import TrendsChart from '../components/TrendsChart'
import StrategyRankCard from '../components/StrategyRankCard'
import CoachInsightCard from '../components/CoachInsightCard'
import { FOCUS_STREAK_DAYS, FOCUS_STREAK_BEST, COACH_INSIGHT } from '../data/trendsData'

export default function TrendsView() {
  return (
    <>
      <TrendsChart />

      <StatCard
        label="Focus streak"
        value={`${FOCUS_STREAK_DAYS} days in a row`}
        sub={`Personal best: ${FOCUS_STREAK_BEST} days`}
        wide
      />

      <StrategyRankCard />

      <CoachInsightCard text={COACH_INSIGHT} />
    </>
  )
}
