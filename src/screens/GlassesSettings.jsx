import { useState } from 'react'
import GlassesDeviceCard from '../components/GlassesDeviceCard'
import SettingRow from '../components/SettingRow'
import SegmentedControl from '../components/SegmentedControl'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function GlassesSettings() {
  const [remindersOn, setRemindersOn] = useState(true)
  const [intensity, setIntensity] = useState('Medium')
  const [ambientGlow, setAmbientGlow] = useState(true)
  const [quietBreaks, setQuietBreaks] = useState(true)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 flex flex-col gap-4">
      <GlassesDeviceCard />

      <div className="flex flex-col gap-2">
        <SectionLabel>During focus sessions</SectionLabel>
        <SettingRow
          label="Focus reminders"
          sub="A gentle buzz on the frame when attention starts to dip"
          checked={remindersOn}
          onChange={setRemindersOn}
        />
        <div
          className={`bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2 transition-opacity ${
            remindersOn ? '' : 'opacity-40'
          }`}
        >
          <span className="text-sm font-semibold text-slate-700">
            Reminder intensity
          </span>
          <SegmentedControl
            options={['Low', 'Medium', 'High']}
            value={intensity}
            onChange={setIntensity}
            disabled={!remindersOn}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Extra cues</SectionLabel>
        <SettingRow
          label="Ambient glow"
          sub="Subtle lens tint when focus drops, no buzz needed"
          checked={ambientGlow}
          onChange={setAmbientGlow}
        />
        <SettingRow
          label="Quiet during breaks"
          sub="Pause all reminders while you're on a scheduled break"
          checked={quietBreaks}
          onChange={setQuietBreaks}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 min-w-0 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-slate-400">Firmware</span>
          <span className="text-sm font-bold text-slate-900">v2.4.1</span>
          <span className="text-[11px] text-emerald-600">Up to date</span>
        </div>
        <div className="flex-1 min-w-0 bg-white/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-slate-400">Last synced</span>
          <span className="text-sm font-bold text-slate-900">Just now</span>
          <span className="text-[11px] text-slate-400">Auto-sync on</span>
        </div>
      </div>
    </div>
  )
}
