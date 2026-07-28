import { useState } from 'react'

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-1 py-1"
      >
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  )
}
