// The weekly bar chart on the Screen Time card, styled after iOS Screen
// Time's own "This Week" view. Each bar is tappable — tapping one is how the
// rest of the phone (the app list below, the goal bar, the monster's energy)
// switches to that day, so this doubles as the demo's day scrubber.
export default function WeekChart({ days, goalMin, selectedIndex, onSelect }) {
  const maxMin = Math.max(goalMin, ...days.map((d) => d.totalMin), 1)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end justify-between gap-1.5 h-16">
        {days.map((d, i) => {
          const isOver = d.totalMin > goalMin
          const selected = i === selectedIndex
          return (
            <button
              key={d.label}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={selected}
              aria-label={`${d.label}, ${d.totalMin} minutes`}
              className="flex-1 h-full flex flex-col items-center justify-end"
            >
              <span
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isOver ? 'bg-amber-400' : 'bg-[#2a78d6]'
                } ${selected ? 'opacity-100' : 'opacity-35 active:opacity-70'}`}
                style={{ height: `${Math.max(6, (d.totalMin / maxMin) * 100)}%` }}
              />
            </button>
          )
        })}
      </div>
      <div className="flex justify-between gap-1.5">
        {days.map((d, i) => (
          <span
            key={d.label}
            className={`flex-1 text-center text-[calc(10px*var(--ui-text-scale,1))] font-semibold tabular-nums ${
              i === selectedIndex ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
