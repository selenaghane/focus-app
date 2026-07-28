import { useId } from 'react'
import { lighten, darken } from '../utils/color'

const BODY_PATH =
  'M 100 20 C 140 20 165 55 165 95 C 165 130 155 165 100 172 C 45 165 35 130 35 95 C 35 55 60 20 100 20 Z'

function polar(cx, cy, rx, ry, deg) {
  const a = (deg * Math.PI) / 180
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) }
}

function TextureOverlay({ texture, furColor }) {
  if (texture === 'smooth') return null

  const N = 12
  const points = Array.from({ length: N }, (_, i) => {
    const angle = (360 / N) * i - 90
    return { ...polar(100, 100, 66, 80, angle), angle }
  })

  return (
    <g>
      {points.map((p, i) => {
        if (texture === 'fuzzy') {
          const rad = (p.angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={p.x + 9 * Math.cos(rad)}
              y2={p.y + 9 * Math.sin(rad)}
              stroke={furColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          )
        }
        if (texture === 'spiky') {
          return (
            <polygon
              key={i}
              points="0,-6 13,0 0,6"
              fill={furColor}
              transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}
            />
          )
        }
        // curly
        return (
          <path
            key={i}
            d="M0 0 q 7 -7 0 -13 q -7 6 0 13"
            fill="none"
            stroke={furColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}
          />
        )
      })}
    </g>
  )
}

function HeadFeature({ headFeature, headFeatureColor }) {
  if (headFeature === 'horns') {
    return (
      <g fill={headFeatureColor}>
        <path d="M 68 28 Q 60 8 74 4 Q 72 20 78 30 Z" />
        <path d="M 132 28 Q 140 8 126 4 Q 128 20 122 30 Z" />
      </g>
    )
  }
  if (headFeature === 'spikes') {
    return (
      <g fill={headFeatureColor}>
        <polygon points="78,22 84,2 90,22" />
        <polygon points="93,18 100,-2 107,18" />
        <polygon points="110,22 116,2 122,22" />
      </g>
    )
  }
  // curls
  return (
    <g fill="none" stroke={headFeatureColor} strokeWidth="4" strokeLinecap="round">
      <path d="M 76 22 q 8 -14 0 -20 q -8 8 2 20" />
      <path d="M 100 16 q 8 -14 0 -20 q -8 8 2 20" />
      <path d="M 124 22 q 8 -14 0 -20 q -8 8 2 20" />
    </g>
  )
}

function Eye({ cx, r = 16, energy, furColor, id }) {
  const lidHeight = (energy / 3) * (r * 1.35)
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy="82" r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy="82" r={r} fill="#fff" />
      <circle cx={cx} cy="85" r={r * 0.48} fill="#2c2c2c" />
      <circle cx={cx - r * 0.2} cy="77" r={r * 0.16} fill="#fff" opacity="0.85" />
      {energy > 0 && (
        <rect
          x={cx - r}
          y={82 - r}
          width={r * 2}
          height={lidHeight}
          fill={furColor}
          clipPath={`url(#${id})`}
        />
      )}
    </g>
  )
}

function Mouth({ expression, energy }) {
  const d = energy * 3
  const paths = {
    happy: `M 82 ${146 + d} Q 100 ${164 - d * 0.6} 118 ${146 + d}`,
    goofy: `M 80 ${146 + d} Q 92 ${166 - d * 0.5} 102 ${150 + d} Q 112 142 120 ${148 + d}`,
    meh: `M 85 ${151 + d} L 115 ${151 + d}`,
    sad: `M 82 ${153 + d} Q 100 ${139 + d} 118 ${153 + d}`,
  }
  return (
    <path
      d={paths[expression] || paths.happy}
      fill="none"
      stroke="#3a2e2e"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  )
}

function Aura({ energy }) {
  const sparkleOpacity = Math.max(0, 1 - energy * 0.45)
  const zzzOpacity = Math.min(1, energy * 0.42)
  return (
    <g>
      <g opacity={sparkleOpacity}>
        <path d="M 150 30 l 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#ffd76a" />
        <path d="M 40 45 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#8fd0ff" />
      </g>
      <g opacity={zzzOpacity}>
        <text x="140" y="35" fontSize="14" fontWeight="700" fill="#94a3b8">z</text>
        <text x="150" y="24" fontSize="18" fontWeight="700" fill="#94a3b8">Z</text>
        <text x="163" y="14" fontSize="22" fontWeight="700" fill="#94a3b8">Z</text>
      </g>
    </g>
  )
}

export default function Monster({
  furColor = '#7fb3e8',
  texture = 'smooth',
  eyeCount = 2,
  expression = 'happy',
  headFeature = 'horns',
  headFeatureColor = '#f2b134',
  energy = 0,
  size = 176,
}) {
  const uid = useId()
  const bellyColor = lighten(furColor, 0.28)
  const footColor = darken(furColor, 0.16)
  const slumpRotate = energy * 2.5
  const slumpShift = energy * 2

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        filter: `saturate(${1 - energy * 0.22}) brightness(${1 - energy * 0.08})`,
      }}
    >
      <g transform={`rotate(${slumpRotate} 100 110) translate(0 ${slumpShift})`}>
        {/* Feet */}
        <ellipse cx="76" cy="178" rx="15" ry="9" fill={footColor} />
        <ellipse cx="124" cy="178" rx="15" ry="9" fill={footColor} />

        {/* Body */}
        <path d={BODY_PATH} fill={furColor} />

        <TextureOverlay texture={texture} furColor={furColor} />

        {/* Belly */}
        <ellipse cx="100" cy="122" rx="36" ry="46" fill={bellyColor} />

        <HeadFeature headFeature={headFeature} headFeatureColor={headFeatureColor} />

        {eyeCount === 1 ? (
          <Eye cx={100} r={22} energy={energy} furColor={furColor} id={`${uid}-eye`} />
        ) : (
          <>
            <Eye cx={78} energy={energy} furColor={furColor} id={`${uid}-eye-l`} />
            <Eye cx={122} energy={energy} furColor={furColor} id={`${uid}-eye-r`} />
          </>
        )}

        <Mouth expression={expression} energy={energy} />

        <Aura energy={energy} />
      </g>
    </svg>
  )
}
