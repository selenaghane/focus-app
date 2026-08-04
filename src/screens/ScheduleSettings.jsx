import { useState } from 'react'
import usePersistentState from '../hooks/usePersistentState'
import SettingRow from '../components/SettingRow'
import ScheduleBlockCard from '../components/ScheduleBlockCard'
import BlockEditor from '../components/BlockEditor'
import Collapsible from '../components/Collapsible'
import AppBlockRow from '../components/AppBlockRow'
import {
  createBlock,
  isBlockActive,
  activeBlock,
  nextBlock,
  whenLabel,
  formatTime,
  nowFromClock,
} from '../data/scheduleData'
import { APP_LIST } from '../data/blockingData'

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

function StatusBanner({ blocks, autoOn, now }) {
  if (!autoOn) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
        <span className="text-xs text-slate-400">
          Automatic scheduling is off — the glasses stay quiet all day.
        </span>
      </div>
    )
  }

  const running = activeBlock(blocks, now)
  if (running) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-emerald-700">
          {running.label} is running now
        </span>
        <span className="text-[11px] text-emerald-600/80 tabular-nums">
          Until {formatTime(running.endMin)} · blocked apps are paused
        </span>
      </div>
    )
  }

  const next = nextBlock(blocks, now)
  if (!next) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
        <span className="text-xs text-slate-400">
          No focus blocks scheduled — add one below.
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-[#2a78d6]">
        Next: {next.block.label}
      </span>
      <span className="text-[11px] text-[#2a78d6]/70 tabular-nums">
        {whenLabel(next, now)} at {formatTime(next.block.startMin)}
      </span>
    </div>
  )
}

export default function ScheduleSettings({
  blocks,
  onBlocksChange,
  autoOn,
  onAutoOnChange,
  onOpenBlockScreen,
  now = nowFromClock(),
}) {
  const [editing, setEditing] = useState(null) // { block, isNew } | null
  const [blockingOn, setBlockingOn] = usePersistentState('appBlockingOn', true)
  // Only the ids are stored, not whole app records: that way adding an app to
  // APP_LIST later actually shows up for people who already have state saved,
  // instead of being masked by a stale copy of the old list.
  const [blockedIds, setBlockedIds] = usePersistentState(
    'blockedAppIds',
    APP_LIST.filter((a) => a.blocked).map((a) => a.id),
  )
  const apps = APP_LIST.map((a) => ({ ...a, blocked: blockedIds.includes(a.id) }))

  const toggleBlock = (id) =>
    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    )

  const saveBlock = (updated) => {
    onBlocksChange(
      editing.isNew
        ? [...blocks, updated]
        : blocks.map((b) => (b.id === updated.id ? updated : b)),
    )
    setEditing(null)
  }

  const deleteBlock = () => {
    onBlocksChange(blocks.filter((b) => b.id !== editing.block.id))
    setEditing(null)
  }

  const toggleApp = (id) =>
    setBlockedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const blockedCount = apps.filter((a) => a.blocked).length

  if (editing) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4">
        <BlockEditor
          block={editing.block}
          isNew={editing.isNew}
          onSave={saveBlock}
          onCancel={() => setEditing(null)}
          onDelete={deleteBlock}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <StatusBanner blocks={blocks} autoOn={autoOn} now={now} />

      {onOpenBlockScreen && (
        <button
          type="button"
          data-flat
          onClick={onOpenBlockScreen}
          className="rounded-2xl bg-surface/80 border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-0.5 text-left"
        >
          <span className="text-sm font-semibold text-slate-700">
            Open the block screen
          </span>
          <span className="text-[11px] text-slate-400 leading-snug">
            What you see when you reach for a blocked app during a focus block
          </span>
        </button>
      )}

      <SettingRow
        label="Automatic scheduling"
        sub="Glasses activate during the focus blocks below, and do nothing outside them"
        checked={autoOn}
        onChange={onAutoOnChange}
      />

      <div className="flex flex-col gap-2">
        <SectionLabel>Focus blocks</SectionLabel>
        {blocks.length === 0 && (
          <span className="text-xs text-slate-400 px-1 py-2">
            No blocks yet — add your first one below.
          </span>
        )}
        {blocks.map((b) => (
          <ScheduleBlockCard
            key={b.id}
            block={b}
            active={autoOn && isBlockActive(b, now)}
            onToggle={() => toggleBlock(b.id)}
            onEdit={() => setEditing({ block: b, isNew: false })}
            disabled={!autoOn}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setEditing({ block: createBlock(), isNew: true })}
        className="rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-semibold py-3 active:border-slate-300 active:text-slate-500 transition-colors"
      >
        + Add focus block
      </button>

      <Collapsible title="App blocking">
        <SettingRow
          label="App blocking"
          sub="Block distracting apps during these focus blocks"
          checked={blockingOn}
          onChange={setBlockingOn}
        />

        <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            Currently blocked
          </span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            {blockedCount} of {apps.length} apps
          </span>
        </div>

        {apps.map((a) => (
          <AppBlockRow
            key={a.id}
            id={a.id}
            name={a.name}
            blocked={a.blocked}
            onToggle={() => toggleApp(a.id)}
            disabled={!blockingOn}
          />
        ))}
      </Collapsible>
    </div>
  )
}
