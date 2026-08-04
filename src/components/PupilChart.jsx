import { LIVE_WINDOW, ENGAGED_THRESHOLD_MM, isEngaged } from '../data/sessionData'
import { buildScale, Y_MAX } from '../utils/chart'

const WIDTH = 320
const HEIGHT = 120
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

export default function PupilChart() {
  const points = scale.points(LIVE_WINDOW)
  const last = points[points.length - 1]
  const engaged = isEngaged(last.mm)

  const threshold = scale.yOf(ENGAGED_THRESHOLD_MM)
  const top = scale.yOf(Y_MAX)

  return (
    <div className="rounded-2xl bg-surface/80 border border-slate-100 shadow-sm px-4 pt-3.5 pb-2.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-700">
          Pupil reactivity, last 20 min
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            engaged ? 'text-[#2a78d6]' : 'text-amber-600'
          }`}
        >
          +{last.mm.toFixed(2)} mm
        </span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        {/* Everything above the threshold counts as engaged */}
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

        <path d={scale.area(points)} fill="#2a78d6" fillOpacity="0.1" />
        <path
          d={scale.line(points)}
          fill="none"
          stroke="#2a78d6"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx={last.x}
          cy={last.y}
          r="5"
          fill={engaged ? '#2a78d6' : '#eda100'}
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>

      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>20 min ago</span>
        <span>Now</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/40 shrink-0" />
        <span className="text-[11px] text-slate-400 truncate">
          Reacting above +{ENGAGED_THRESHOLD_MM.toFixed(2)} mm
        </span>
      </div>
    </div>
  )
}
