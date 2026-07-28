import { FULL_SESSION, BEST_WINDOW_INDICES, NOW_INDEX } from '../data/sessionData'

const DATA = FULL_SESSION

const WIDTH = 320
const HEIGHT = 112
const PAD_X = 4
const PAD_TOP = 10
const PAD_BOTTOM = 10

function buildPoints() {
  const min = Math.min(...DATA) - 5
  const max = Math.max(...DATA) + 5
  const range = max - min
  const innerW = WIDTH - PAD_X * 2
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM

  return DATA.map((v, i) => {
    const x = PAD_X + (i / (DATA.length - 1)) * innerW
    const y = PAD_TOP + innerH - ((v - min) / range) * innerH
    return { x, y, v }
  })
}

export default function SessionChart() {
  const points = buildPoints()
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} L ${points[0].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} Z`
  const last = points[points.length - 1]
  const hlStart = points[BEST_WINDOW_INDICES[0]].x
  const hlEnd = points[BEST_WINDOW_INDICES[1]].x
  const nowPoint = points[NOW_INDEX]

  return (
    <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 pt-3.5 pb-2.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-700">
          Focus, full session
        </span>
        <span className="text-sm font-bold text-[#2a78d6] tabular-nums">
          {last.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={WIDTH}
            y1={PAD_TOP + f * (HEIGHT - PAD_TOP - PAD_BOTTOM)}
            y2={PAD_TOP + f * (HEIGHT - PAD_TOP - PAD_BOTTOM)}
            stroke="#e1e0d9"
            strokeWidth="1"
          />
        ))}
        <rect
          x={hlStart}
          y={PAD_TOP}
          width={hlEnd - hlStart}
          height={HEIGHT - PAD_TOP - PAD_BOTTOM}
          fill="#1baf7a"
          fillOpacity="0.08"
        />
        <path d={areaPath} fill="#2a78d6" fillOpacity="0.1" stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="#2a78d6"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          x1={nowPoint.x}
          x2={nowPoint.x}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="#c98500"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          opacity="0.6"
        />
        <circle cx={nowPoint.x} cy={nowPoint.y} r="4" fill="#eda100" stroke="#fff" strokeWidth="2" />
        <circle cx={last.x} cy={last.y} r="5" fill="#2a78d6" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>9:52 AM</span>
        <span>10:40 AM</span>
      </div>
      <div className="flex items-center gap-3.5 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/40" />
          <span className="text-[11px] text-slate-400">Best focus window</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] text-slate-400">Nudge sent</span>
        </div>
      </div>
    </div>
  )
}
