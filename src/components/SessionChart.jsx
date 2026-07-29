import {
  PHASIC_MM,
  BEST_WINDOW_INDICES,
  NUDGE_INDEX,
  ENGAGED_THRESHOLD_MM,
  SESSION_START_LABEL,
  SESSION_END_LABEL,
  SESSION_STATS,
} from '../data/sessionData'
import { buildScale, Y_MAX } from '../utils/chart'

const WIDTH = 320
const HEIGHT = 112
const PAD_X = 4
const PAD_TOP = 10
const PAD_BOTTOM = 10

const scale = buildScale({
  width: WIDTH,
  height: HEIGHT,
  padX: PAD_X,
  padTop: PAD_TOP,
  padBottom: PAD_BOTTOM,
})

export default function SessionChart() {
  const points = scale.points(PHASIC_MM)
  const hlStart = points[BEST_WINDOW_INDICES[0]].x
  const hlEnd = points[BEST_WINDOW_INDICES[1]].x
  const nudgePoint = points[NUDGE_INDEX]

  const threshold = scale.yOf(ENGAGED_THRESHOLD_MM)
  const top = scale.yOf(Y_MAX)

  return (
    <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 pt-3.5 pb-2.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-700">
          Pupil reactivity, full session
        </span>
        <span className="text-sm font-bold text-[#2a78d6] tabular-nums">
          +{SESSION_STATS.avgPhasic.toFixed(2)} mm avg
        </span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        <rect
          x={0}
          y={top}
          width={WIDTH}
          height={threshold - top}
          fill="#1baf7a"
          fillOpacity="0.09"
        />
        <line
          x1={0}
          x2={WIDTH}
          y1={threshold}
          y2={threshold}
          stroke="#1baf7a"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />

        {/* Best sustained stretch */}
        <rect
          x={hlStart}
          y={PAD_TOP}
          width={hlEnd - hlStart}
          height={HEIGHT - PAD_TOP - PAD_BOTTOM}
          fill="#1baf7a"
          fillOpacity="0.07"
        />

        <path d={scale.area(points)} fill="#2a78d6" fillOpacity="0.1" />
        <path
          d={scale.line(points)}
          fill="none"
          stroke="#2a78d6"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <line
          x1={nudgePoint.x}
          x2={nudgePoint.x}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="#c98500"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          opacity="0.6"
        />
        <circle cx={nudgePoint.x} cy={nudgePoint.y} r="4" fill="#eda100" stroke="#fff" strokeWidth="2" />
      </svg>

      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>{SESSION_START_LABEL}</span>
        <span>{SESSION_END_LABEL}</span>
      </div>

      <div className="flex items-center gap-3.5 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/40" />
          <span className="text-[11px] text-slate-400">Reacting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] text-slate-400">Nudge sent</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-snug mt-1.5">
        Each lapse is a flat stretch below the line — moments your pupil
        stopped reacting. Pupil size on its own doesn&rsquo;t count as a lapse:
        a bigger or smaller baseline can mean either thing.
      </p>
    </div>
  )
}
