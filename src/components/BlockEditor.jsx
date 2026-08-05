import { useState } from 'react'
import {
  DAY_LABELS,
  formatDuration,
  toTimeInput,
  fromTimeInput,
} from '../data/scheduleData'

function FieldLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

const TIME_INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-surface px-3 py-2.5 text-sm text-slate-700 tabular-nums outline-none focus:border-[#2a78d6] transition-colors'

export default function BlockEditor({ block, isNew, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState(block)

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const toggleDay = (i) =>
    set({ days: draft.days.map((d, idx) => (idx === i ? (d ? 0 : 1) : d)) })

  const setTime = (key) => (e) => {
    const min = fromTimeInput(e.target.value)
    if (min !== null) set({ [key]: min })
  }

  const hasName = draft.label.trim().length > 0
  const hasDays = draft.days.some(Boolean)
  const endsAfterStart = draft.endMin > draft.startMin
  const valid = hasName && hasDays && endsAfterStart

  const problem = !hasName
    ? 'Give the block a name.'
    : !endsAfterStart
      ? 'The end time needs to be after the start time.'
      : !hasDays
        ? 'Pick at least one day.'
        : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 px-1 py-1"
        >
          Cancel
        </button>
        <h2 className="text-sm font-bold text-slate-900">
          {isNew ? 'New focus block' : 'Edit focus block'}
        </h2>
        <button
          type="button"
          onClick={() => onSave({ ...draft, label: draft.label.trim() })}
          disabled={!valid}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            valid
              ? 'text-[#2a78d6] bg-sky-50 active:bg-sky-100'
              : 'text-slate-300 bg-slate-50'
          }`}
        >
          Save
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Name</FieldLabel>
        <input
          type="text"
          value={draft.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="e.g. Homework block"
          maxLength={28}
          className="w-full rounded-xl border border-slate-200 bg-surface px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#2a78d6] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Time</FieldLabel>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={toTimeInput(draft.startMin)}
            onChange={setTime('startMin')}
            aria-label="Start time"
            className={TIME_INPUT_CLASS}
          />
          <span className="text-slate-300 text-sm shrink-0">to</span>
          <input
            type="time"
            value={toTimeInput(draft.endMin)}
            onChange={setTime('endMin')}
            aria-label="End time"
            className={TIME_INPUT_CLASS}
          />
        </div>
        {endsAfterStart && (
          <span className="text-[11px] text-slate-400 px-1">
            {formatDuration(draft.startMin, draft.endMin)} of focus time
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Repeat</FieldLabel>
        <div className="flex gap-1.5 justify-between px-0.5">
          {DAY_LABELS.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              aria-pressed={Boolean(draft.days[i])}
              className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${
                draft.days[i]
                  ? 'bg-[#2a78d6] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {problem && (
        <span className="text-[11px] text-amber-600 px-1">{problem}</span>
      )}

      {!isNew && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-1 rounded-2xl border border-rose-100 bg-rose-50/60 text-rose-500 text-sm font-semibold py-3 active:bg-rose-100 transition-colors"
        >
          Delete block
        </button>
      )}
    </div>
  )
}
