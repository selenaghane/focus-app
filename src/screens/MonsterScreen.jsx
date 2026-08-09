import { useState } from 'react'
import MonsterCompanionView from '../components/MonsterCompanionView'
import MonsterCustomizeView from '../components/MonsterCustomizeView'

export default function MonsterScreen({
  config,
  onConfigChange,
  energy,
  usedMin,
  goalMin,
  onGoalChange,
  unlockMin,
  onUnlockChange,
  onOpenBlockScreen,
  usage,
  week,
}) {
  const [view, setView] = useState('companion')
  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">My Media Monster</h1>
        <button
          type="button"
          onClick={() => setView(view === 'companion' ? 'customize' : 'companion')}
          className="text-xs font-semibold text-[#2a78d6] bg-sky-50 px-3 py-1.5 rounded-full active:bg-sky-100 transition-colors"
        >
          {view === 'companion' ? 'Customize' : 'Done'}
        </button>
      </div>

      {view === 'companion' ? (
        <MonsterCompanionView
          config={config}
          energy={energy}
          usedMin={usedMin}
          goalMin={goalMin}
          onGoalChange={onGoalChange}
          unlockMin={unlockMin}
          onUnlockChange={onUnlockChange}
          usage={usage}
          week={week}
        />
      ) : (
        <MonsterCustomizeView config={config} onChange={onConfigChange} />
      )}

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
          <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 leading-snug">
            What you see when you reach for a blocked app during a focus block
          </span>
        </button>
      )}
    </div>
  )
}