import { TEXT_SIZE_LABELS } from '../data/appearance'

// Six discrete stops rather than a free-form range — the scale only has six
// values in appearance.js, and snapping to a stop is easier to hit by touch
// than landing on an exact continuous percentage.
export default function TextSizeSlider({ value, onChange }) {
  const max = TEXT_SIZE_LABELS.length - 1

  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Text size"
        aria-valuetext={TEXT_SIZE_LABELS[value]}
        className="w-full accent-[#2a78d6]"
      />
      <div className="flex justify-between px-0.5">
        {TEXT_SIZE_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium ${
              i === value ? 'text-[#2a78d6] font-semibold' : 'text-slate-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
