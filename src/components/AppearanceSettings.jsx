import SettingRow from './SettingRow'
import TextSizeSlider from './TextSizeSlider'
import { defaultAppearance } from '../data/appearance'

// Each control writes one field of the stored appearance object; App pushes
// that onto <html>, where the rules in index.css pick it up. Nothing here
// keeps its own copy, so the switches always show what's actually applied.
export default function AppearanceSettings({
  appearance = defaultAppearance(),
  onChange,
}) {
  const { darkMode, textSize, dyslexiaFont, reduceMotion } = appearance
  const set = (field) => (value) => onChange?.({ ...appearance, [field]: value })

  const setDarkMode = set('darkMode')
  const setTextSize = set('textSize')
  const setDyslexiaFont = set('dyslexiaFont')
  const setReduceMotion = set('reduceMotion')

  return (
    <div className="flex flex-col gap-2">
      <SettingRow
        label="Dark mode"
        sub="Easier on the eyes for late-night study sessions"
        checked={darkMode}
        onChange={setDarkMode}
      />

      <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">Text size</span>
        <TextSizeSlider value={textSize} onChange={setTextSize} />
      </div>

      <SettingRow
        label="Dyslexia-friendly font"
        sub="Weighted letterforms that are harder to flip or blur"
        checked={dyslexiaFont}
        onChange={setDyslexiaFont}
      />

      <SettingRow
        label="Reduce motion"
        sub="Turn off bounces and slide-in animations"
        checked={reduceMotion}
        onChange={setReduceMotion}
      />
    </div>
  )
}
