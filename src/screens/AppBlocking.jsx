import { useState } from 'react'
import SettingRow from '../components/SettingRow'
import AppBlockRow from '../components/AppBlockRow'
import { APP_LIST } from '../data/blockingData'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function AppBlocking() {
  const [blockingOn, setBlockingOn] = useState(true)
  const [apps, setApps] = useState(APP_LIST)

  const toggleApp = (id) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, blocked: !a.blocked } : a)),
    )
  }

  const blockedCount = apps.filter((a) => a.blocked).length

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 flex flex-col gap-4">
      <SettingRow
        label="App blocking"
        sub="Block distracting apps during scheduled focus blocks"
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

      <div className="flex flex-col gap-2">
        <SectionLabel>Social &amp; entertainment</SectionLabel>
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
      </div>
    </div>
  )
}
