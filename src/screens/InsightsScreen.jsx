import AppInsightRow from '../components/AppInsightRow'
import { rankAppsByUsage, withRecommendations } from '../data/recommendations'

// `days` is the usage window recommendations are ranked against — the
// demo's week of history plus today, or just today outside demo mode.
export default function InsightsScreen({ days, blockedIds, onToggleApp }) {
  const apps = withRecommendations(rankAppsByUsage(days), blockedIds)
  const recommendedCount = apps.filter((a) => a.recommended).length

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold text-slate-900">Insights</h1>
        <p className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 leading-snug">
          {recommendedCount > 0
            ? `Based on recent usage, ${recommendedCount === 1 ? "there's one app" : `there are ${recommendedCount} apps`} worth limiting. You have the final say — toggle any app on or off below.`
            : "Based on recent usage, nothing stands out enough to flag. Toggle any app on or off below."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {apps.map((a) => (
          <AppInsightRow
            key={a.id}
            id={a.id}
            name={a.name}
            avgMin={a.avgMin}
            recommended={a.recommended}
            blocked={a.blocked}
            onToggle={() => onToggleApp(a.id)}
          />
        ))}
      </div>
    </div>
  )
}
