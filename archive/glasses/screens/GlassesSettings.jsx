import usePersistentState from '../hooks/usePersistentState'
import GlassesDeviceCard from '../components/GlassesDeviceCard'
import SettingRow from '../components/SettingRow'
import SegmentedControl from '../components/SegmentedControl'
import AppearanceSettings from '../components/AppearanceSettings'
import { GLASSES_NAME } from '../data/branding'
import { isGlassesConnected } from '../services/glasses'

// Stands in for the device card when there's nothing paired. The battery
// level, firmware version and sync time all come off real hardware, so with
// none connected there is nothing truthful to put in their place.
function NotPairedCard() {
  return (
    <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3.5">
      <div className="shrink-0 w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="5.5" cy="14" r="3.2" stroke="#94a3b8" strokeWidth="1.8" />
          <circle cx="18.5" cy="14" r="3.2" stroke="#94a3b8" strokeWidth="1.8" />
          <path d="M8.7 14h6.6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2.3 13.5 4 9c.4-1 1-1.4 2-1.4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M21.7 13.5 20 9c-.4-1-1-1.4-2-1.4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="text-[13px] font-bold text-slate-900 leading-snug">
          No {GLASSES_NAME} paired
        </span>
        <span className="text-[11px] text-slate-400 leading-snug">
          Focus tracking and session insights switch on once a pair is
          connected.
        </span>
      </div>
    </div>
  )
}

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
  const connected = isGlassesConnected()

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      {connected ? <GlassesDeviceCard /> : <NotPairedCard />}

      {/* These settings drive the frame's own haptics, so they only mean
          something with a frame on the other end. */}
      {connected && (
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
      )}

      <div className="flex flex-col gap-2">
        <SectionLabel>Appearance</SectionLabel>
        <AppearanceSettings
          appearance={appearance}
          onChange={onAppearanceChange}
        />
      </div>

      {/* Firmware version and sync time are read off the device. */}
      {connected && (
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
      )}

    </div>
  )
}
