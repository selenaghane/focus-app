function LiveIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h3l2 6 4-14 2 9 1.5-4H21"
        stroke={active ? '#2a78d6' : '#94a3b8'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InsightsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="12" width="3.2" height="8" rx="1" fill={active ? '#2a78d6' : '#94a3b8'} />
      <rect x="10.4" y="7" width="3.2" height="13" rx="1" fill={active ? '#2a78d6' : '#94a3b8'} />
      <rect x="16.8" y="4" width="3.2" height="16" rx="1" fill={active ? '#2a78d6' : '#94a3b8'} />
    </svg>
  )
}

function GlassesIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="5.5" cy="14" r="3.2" stroke={color} strokeWidth="1.8" />
      <circle cx="18.5" cy="14" r="3.2" stroke={color} strokeWidth="1.8" />
      <path d="M8.7 14h6.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.3 13.5 4 9c.4-1 1-1.4 2-1.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21.7 13.5 20 9c-.4-1-1-1.4-2-1.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

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

import { APP_NAME } from '../data/branding'

const TABS = [
  { id: 'live', label: 'Live', Icon: LiveIcon },
  { id: 'insights', label: 'Insights', Icon: InsightsIcon },
  { id: 'glasses', label: 'Glasses', Icon: GlassesIcon },
  { id: 'schedule', label: 'Schedule', Icon: ScheduleIcon },
  { id: 'monster', label: 'MediaMonster', Icon: MonsterIcon },
]

// Bottom bar on a phone, left rail on a wide display. Same buttons either
// way — only the axis and the chrome change, so there's one nav to maintain.
export default function TabBar({ active, onChange }) {
  return (
    <nav
      aria-label="Sections"
      className="tab-bar-safe shrink-0 bg-surface/90 backdrop-blur border-t border-slate-100 pt-2 flex justify-around
                 lg:h-full lg:w-60 lg:flex-col lg:justify-start lg:gap-1 lg:border-t-0 lg:border-r lg:px-3 lg:pt-7"
    >
      <span className="hidden lg:block px-3 pb-5 text-base font-bold text-slate-900">
        {APP_NAME}
      </span>

      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            data-flat
            className={`flex flex-col items-center gap-0.5 px-1 py-1
                        lg:w-full lg:flex-row lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2.5 lg:justify-start
                        ${isActive ? 'lg:bg-sky-50' : 'lg:hover:bg-slate-50'}`}
          >
            <Icon active={isActive} />
            <span
              className={`text-[11px] font-medium whitespace-nowrap lg:text-sm ${
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
