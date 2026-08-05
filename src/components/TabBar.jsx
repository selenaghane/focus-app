function ScheduleIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15" rx="2.4" stroke={color} strokeWidth="1.8" />
      <path d="M3.5 9.5h17" stroke={color} strokeWidth="1.8" />
      <path d="M8 3v3.5M16 3v3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12.3v3.2l2.2 1.3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MonsterIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c4 0 6.5 3 6.5 7 0 5-3 10-6.5 10S5.5 15 5.5 10c0-4 2.5-7 6.5-7Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <circle cx="9.3" cy="10" r="1.1" fill={color} />
      <circle cx="14.7" cy="10" r="1.1" fill={color} />
      <path d="M9.5 14c1 1 4 1 5 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 2.8v2.1M12 19.1v2.1M21.2 12h-2.1M4.9 12H2.8M18.5 5.5l-1.5 1.5M7 17l-1.5 1.5M18.5 18.5 17 17M7 7 5.5 5.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const TABS = [
  { id: 'schedule', label: 'Schedule', Icon: ScheduleIcon },
  { id: 'monster', label: 'MediaMonster', Icon: MonsterIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
]

// Always the bottom bar. This is a phone app, and the tab bar belongs where
// a thumb can reach it at every width.
export default function TabBar({ active, tabs, onChange }) {
  // `tabs` names the sections that have something real behind them; App works
  // that out. Without it, every section shows — which is what the demo wants.
  const visible = tabs ? TABS.filter((t) => tabs.includes(t.id)) : TABS

  return (
    <nav
      aria-label="Sections"
      className="tab-bar-safe shrink-0 bg-surface/90 backdrop-blur border-t border-slate-100 pt-2 flex justify-around"
    >
      {visible.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            data-flat
            className="flex flex-col items-center gap-0.5 px-1 py-1"
          >
            <Icon active={isActive} />
            <span
              className={`text-[11px] font-medium whitespace-nowrap ${
                isActive ? 'text-[#2a78d6]' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
