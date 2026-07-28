import { useState } from 'react'
import SettingRow from '../components/SettingRow'
import ScheduleBlockCard from '../components/ScheduleBlockCard'
import { SCHEDULE_BLOCKS } from '../data/scheduleData'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function ScheduleSettings() {
  const [autoOn, setAutoOn] = useState(true)
  const [appBlockOn, setAppBlockOn] = useState(true)
  const [blocks, setBlocks] = useState(SCHEDULE_BLOCKS)

  const toggleBlock = (id) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 flex flex-col gap-4">
      <SettingRow
        label="Automatic scheduling"
        sub="Glasses activate during the focus blocks below, and do nothing outside them"
        checked={autoOn}
        onChange={setAutoOn}
      />

      <SettingRow
        label="App blocking"
        sub="Automatically block Instagram, TikTok, and other distracting apps during these focus blocks"
        checked={appBlockOn}
        onChange={setAppBlockOn}
      />

      <div className="flex flex-col gap-2">
        <SectionLabel>Focus blocks</SectionLabel>
        {blocks.map((b) => (
          <ScheduleBlockCard
            key={b.id}
            label={b.label}
            time={b.time}
            days={b.days}
            enabled={b.enabled}
            onToggle={() => toggleBlock(b.id)}
            disabled={!autoOn}
          />
        ))}
      </div>

      <button
        type="button"
        className="rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-semibold py-3 active:border-slate-300 transition-colors"
      >
        + Add focus block
      </button>
    </div>
  )
}
