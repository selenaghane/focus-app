import SegmentedControl from './SegmentedControl'
import {
  GOAL_OPTIONS,
  UNLOCK_LENGTH_OPTIONS,
  PCT_OVER_PER_STAGE,
  formatMinutes,
} from '../data/screenTimeData'

function FieldLabel({ children }) {
  return (
    <span className="text-[calc(11px*var(--ui-text-scale,1))] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

export default function ScreenTimeSettings({
  goalMin,
  onGoalChange,
  unlockMin,
  onUnlockChange,
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Daily goal on blocked apps</FieldLabel>
        <SegmentedControl
          options={GOAL_OPTIONS.map(formatMinutes)}
          value={formatMinutes(goalMin)}
          onChange={(v) => onGoalChange(GOAL_OPTIONS[GOAL_OPTIONS.map(formatMinutes).indexOf(v)])}
        />
        <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 px-1 leading-snug">
          Every {PCT_OVER_PER_STAGE}% past this goal costs your monster one
          stage of energy.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Unlock length</FieldLabel>
        <SegmentedControl
          options={UNLOCK_LENGTH_OPTIONS.map((m) => `${m} min`)}
          value={`${unlockMin} min`}
          onChange={(v) => onUnlockChange(Number(v.replace(' min', '')))}
        />
        <span className="text-[calc(11px*var(--ui-text-scale,1))] text-slate-400 px-1 leading-snug">
          How long a blocked app stays open each time you unlock it.
        </span>
      </div>
    </div>
  )
}
