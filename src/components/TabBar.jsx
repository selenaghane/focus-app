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

function SummaryIcon({ active }) {
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

function BlockingIcon({ active }) {
  const color = active ? '#2a78d6' : '#94a3b8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="M6.5 17.5l11-11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { id: 'live', label: 'Live', Icon: LiveIcon },
  { id: 'summary', label: 'Summary', Icon: SummaryIcon },
  { id: 'glasses', label: 'Glasses', Icon: GlassesIcon },
  { id: 'schedule', label: 'Schedule', Icon: ScheduleIcon },
  { id: 'blocking', label: 'Blocking', Icon: BlockingIcon },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="shrink-0 bg-white/90 backdrop-blur border-t border-slate-100 pt-2 pb-6 flex justify-around">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1"
          >
            <Icon active={isActive} />
            <span
              className={`text-[11px] font-medium ${
                isActive ? 'text-[#2a78d6]' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
