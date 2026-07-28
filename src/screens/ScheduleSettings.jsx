import { useState } from 'react'
import SettingRow from '../components/SettingRow'
import ScheduleBlockCard from '../components/ScheduleBlockCard'
import Collapsible from '../components/Collapsible'
import AppBlockRow from '../components/AppBlockRow'
import { SCHEDULE_BLOCKS } from '../data/scheduleData'
import { APP_LIST } from '../data/blockingData'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function ScheduleSettings() {
  const [autoOn, setAutoOn] = useState(true)
  const [blocks, setBlocks] = useState(SCHEDULE_BLOCKS)
  const [blockingOn, setBlockingOn] = useState(true)
  const [apps, setApps] = useState(APP_LIST)

  const toggleBlock = (id) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    )
  }

  const toggleApp = (id) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, blocked: !a.blocked } : a)),
    )
  }

  const blockedCount = apps.filter((a) => a.blocked).length

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <SettingRow
        label="Automatic scheduling"
        sub="Glasses activate during the focus blocks below, and do nothing outside them"
        checked={autoOn}
        onChange={setAutoOn}
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

      <Collapsible title="App blocking">
        <SettingRow
          label="App blocking"
          sub="Block distracting apps during these focus blocks"
          checked={blockingOn}
          onChange={setBlockingOn}
        />

        <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            Currently blocked
          </span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            {blockedCount} of {apps.length} apps
          </span>
        </div>

        {apps.map((a) => (
          <AppBlockRow
            key={a.id}
            name={a.name}
            color={a.color}
            letter={a.letter}
            textDark={a.textDark}
            blocked={a.blocked}
            onToggle={() => toggleApp(a.id)}
            disabled={!blockingOn}
          />
        ))}
      </Collapsible>
    </div>
  )
}
