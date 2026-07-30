import StatCard from '../components/StatCard'
import TrendsChart from '../components/TrendsChart'
import RecommendationsCard from '../components/RecommendationsCard'
import BreakResponseCard from '../components/BreakResponseCard'
import UnlockReasonsCard from '../components/UnlockReasonsCard'
import { FOCUS_STREAK_DAYS, FOCUS_STREAK_BEST } from '../data/trendsData'

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

      <RecommendationsCard />

      <BreakResponseCard />

      <UnlockReasonsCard />
    </>
  )
}
