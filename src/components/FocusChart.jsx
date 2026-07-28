import { LIVE_WINDOW } from '../data/sessionData'

const DATA = LIVE_WINDOW

const WIDTH = 320
const HEIGHT = 120
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

export default function FocusChart() {
  const points = buildPoints()
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} L ${points[0].x.toFixed(1)} ${HEIGHT - PAD_BOTTOM} Z`
  const last = points[points.length - 1]

  return (
    <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 pt-3.5 pb-2.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-700">
          Focus, last 20 min
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
        <path d={areaPath} fill="#2a78d6" fillOpacity="0.1" stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="#2a78d6"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={last.x} cy={last.y} r="5" fill="#2a78d6" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>20 min ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}
