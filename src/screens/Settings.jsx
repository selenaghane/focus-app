import AppearanceSettings from '../components/AppearanceSettings'

function SectionLabel({ children }) {
  return (
    <span className="text-[calc(11px*var(--ui-text-scale,1))] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function Settings({ appearance, onAppearanceChange }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <h1 className="text-lg font-bold text-slate-900 px-1">Settings</h1>

      <div className="flex flex-col gap-2">
        <SectionLabel>Appearance</SectionLabel>
        <AppearanceSettings
          appearance={appearance}
          onChange={onAppearanceChange}
        />
      </div>
    </div>
  )
}