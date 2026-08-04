import usePersistentState from '../hooks/usePersistentState'
import GlassesDeviceCard from '../components/GlassesDeviceCard'
import SettingRow from '../components/SettingRow'
import SegmentedControl from '../components/SegmentedControl'
import AppearanceSettings from '../components/AppearanceSettings'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function GlassesSettings({ appearance, onAppearanceChange }) {
  const [remindersOn, setRemindersOn] = usePersistentState('remindersOn', true)
  const [intensity, setIntensity] = usePersistentState(
    'reminderIntensity',
    'Medium',
  )

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
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
          className={`bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-2 transition-opacity ${
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
        <SectionLabel>Appearance</SectionLabel>
        <AppearanceSettings
          appearance={appearance}
          onChange={onAppearanceChange}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 min-w-0 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-slate-400">Firmware</span>
          <span className="text-sm font-bold text-slate-900">v2.4.1</span>
          <span className="text-[11px] text-emerald-600">Up to date</span>
        </div>
        <div className="flex-1 min-w-0 bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-slate-400">Last synced</span>
          <span className="text-sm font-bold text-slate-900">Just now</span>
          <span className="text-[11px] text-slate-400">Auto-sync on</span>
        </div>
      </div>

    </div>
  )
}
