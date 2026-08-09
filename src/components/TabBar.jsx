function InsightsIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.5 3.9L17.4 8.4l-3.9 1.5L12 13.8l-1.5-3.9L6.6 8.4l3.9-1.5L12 3z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 13l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
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
      <path
        d="M9.6 3.4h4.8l.6 2.6a7 7 0 0 1 1.8 1l2.5-.9 2.4 4.2-2 1.7a7 7 0 0 1 0 2l2 1.7-2.4 4.2-2.5-.9a7 7 0 0 1-1.8 1l-.6 2.6H9.6l-.6-2.6a7 7 0 0 1-1.8-1l-2.5.9-2.4-4.2 2-1.7a7 7 0 0 1 0-2l-2-1.7 2.4-4.2 2.5.9a7 7 0 0 1 1.8-1z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.7" />
    </svg>
  )
}

const TABS = [
  { id: 'insights', label: 'Insights', Icon: InsightsIcon },
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
              className={`text-[calc(11px*var(--ui-text-scale,1))] font-medium whitespace-nowrap ${
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
