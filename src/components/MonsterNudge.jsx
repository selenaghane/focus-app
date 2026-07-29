import Monster from './Monster'
import { nudgeMessage } from '../data/monsterData'

export default function MonsterNudge({ config, energy, message }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/85 rounded-2xl border border-slate-100 shadow-sm px-3 py-2.5">
      <div className="shrink-0 -my-3">
        <Monster {...config} energy={energy} size={88} />
      </div>
      <p className="text-xs text-slate-600 leading-snug flex-1 min-w-0">
        {message || nudgeMessage(energy)}
      </p>
    </div>
  )
}
