import Monster from './Monster'
import MonsterScene from './MonsterScene'
import SegmentedControl from './SegmentedControl'
import {
  FUR_COLORS,
  HEAD_FEATURE_COLORS,
  TEXTURES,
  HEAD_FEATURES,
  SCENES,
  MAX_ENERGY,
} from '../data/monsterData'

function FieldLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1">
      {children}
    </span>
  )
}

function ColorSwatches({ colors, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap px-1">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={c}
          className={`w-8 h-8 rounded-full border-2 transition-transform ${
            value === c ? 'border-[#2a78d6] scale-110' : 'border-white'
          } shadow-sm`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  )
}

export default function MonsterCustomizeView({ config, onChange }) {
  const set = (patch) => onChange({ ...config, ...patch })

  return (
    <div className="flex flex-col gap-4">
      <MonsterScene scene={config.scene}>
        <Monster {...config} energy={MAX_ENERGY} />
      </MonsterScene>

      <div className="bg-surface/80 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-slate-400">Name</span>
        <input
          value={config.name}
          onChange={(e) => set({ name: e.target.value })}
          maxLength={16}
          className="text-sm font-semibold text-slate-800 outline-none border-b border-slate-200 focus:border-[#2a78d6] pb-1 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Fur color</FieldLabel>
        <ColorSwatches
          colors={FUR_COLORS}
          value={config.furColor}
          onChange={(v) => set({ furColor: v })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Fur texture</FieldLabel>
        <SegmentedControl
          options={TEXTURES}
          value={config.texture}
          onChange={(v) => set({ texture: v })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Eyes</FieldLabel>
        <SegmentedControl
          options={['1 eye', '2 eyes']}
          value={config.eyeCount === 1 ? '1 eye' : '2 eyes'}
          onChange={(v) => set({ eyeCount: v === '1 eye' ? 1 : 2 })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Head feature</FieldLabel>
        <SegmentedControl
          options={HEAD_FEATURES}
          value={config.headFeature}
          onChange={(v) => set({ headFeature: v })}
        />
        <ColorSwatches
          colors={HEAD_FEATURE_COLORS}
          value={config.headFeatureColor}
          onChange={(v) => set({ headFeatureColor: v })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Scene</FieldLabel>
        <SegmentedControl
          options={SCENES}
          value={config.scene}
          onChange={(v) => set({ scene: v })}
        />
      </div>
    </div>
  )
}
