import { TEXT_SIZE_LABELS } from '../data/appearance'

// Six discrete stops rather than a free-form range — the scale only has six
// values in appearance.js, and snapping to a stop is easier to hit by touch
// than landing on an exact continuous percentage. The datalist gives the
// track tick marks at each stop without labelling every one of them.
export default function TextSizeSlider({ value, onChange }) {
  const max = TEXT_SIZE_LABELS.length - 1

  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        list="text-size-stops"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Text size"
        aria-valuetext={TEXT_SIZE_LABELS[value]}
        className="w-full accent-[#2a78d6]"
      />
      <datalist id="text-size-stops">
        {TEXT_SIZE_LABELS.map((_, i) => (
          <option key={i} value={i} />
        ))}
      </datalist>
      <div className="flex justify-between px-0.5">
        <span className="text-xs font-medium text-slate-400">Small</span>
        <span className="text-xs font-medium text-slate-400">Large</span>
      </div>
    </div>
  )
}
