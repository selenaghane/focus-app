import { useState } from 'react'
import SettingRow from './SettingRow'
import SegmentedControl from './SegmentedControl'

// PROTOTYPE: these controls hold their own state so they look and feel alive
// in a demo, but none of them restyle the app yet. Wiring dark mode up for
// real means threading a theme through every surface, which is its own pass.
export default function AppearanceSettings() {
  const [darkMode, setDarkMode] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [textSize, setTextSize] = useState('Default')

  return (
    <div className="flex flex-col gap-2">
      <SettingRow
        label="Dark mode"
        sub="Easier on the eyes for late-night study sessions"
        checked={darkMode}
        onChange={setDarkMode}
      />

      <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">Text size</span>
        <SegmentedControl
          options={['Small', 'Default', 'Large']}
          value={textSize}
          onChange={setTextSize}
        />
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
