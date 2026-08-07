import { useId } from 'react'
import { lighten, darken } from '../utils/color'
import { stageFromEnergy, DEFAULT_ENERGY } from '../data/monsterData'

// Five discrete conditions, from thriving to lifeless. Energy rounds to one
// of these rather than sliding continuously, so each step is clearly visible.
// Mood is NOT customisable — it belongs to the energy meter alone, so time
// spent on blocked apps is the only thing that makes the monster sadder and
// greyer. `lid` is the fraction of the eye covered.
const STAGE_PRESETS = [
  { lid: 0, slump: 0, droop: 0, saturate: 1.1, brightness: 1.03, sparkle: 1, zzz: 0, mouth: 'goofy' },
  { lid: 0.1, slump: 0.8, droop: 1, saturate: 1, brightness: 1, sparkle: 0.5, zzz: 0, mouth: 'happy' },
  { lid: 0.34, slump: 2.4, droop: 2.5, saturate: 0.68, brightness: 0.99, sparkle: 0, zzz: 0.3, mouth: 'meh' },
  { lid: 0.58, slump: 4.6, droop: 4, saturate: 0.34, brightness: 0.95, sparkle: 0, zzz: 0.7, mouth: 'sad' },
  { lid: 0.8, slump: 7, droop: 5.5, saturate: 0, brightness: 0.9, sparkle: 0, zzz: 1, mouth: 'sad' },
]

const CX = 100
const CY = 100
const RX = 60
const RY = 66

// Each texture is defined by how far apart its edge tufts sit, how far they
// stick out, whether they come to a point, and how irregular the whole
// outline is. The silhouette IS the texture.
//
// `smooth` is short plush fur rather than bare skin: lots of small, even
// bumps on a near-perfect round body — visibly furry, but no spikes.
// uniform texture unlike spikes, so smooth will always look smooth, simple, & clean
const EDGE = {
  smooth: { spacing: 10, push: 3.2, jagged: false, irregular: 0.18 },
  curly: { spacing: 17, push: 9, jagged: false, irregular: 0.75 },
  fuzzy: { spacing: 8, push: 11, jagged: true, irregular: 1 },
  spiky: { spacing: 19, push: 19, jagged: true, irregular: 1 },
}

function ellipsePerimeter(rx, ry) {
  return 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2)
}

// Deterministic pseudo-random in [0,1) — keeps the fur irregular but identical
// on every re-render, so the monster never shimmers.
function rand(i, seed) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

// A furry blob outline, reusable for the body and the arms so they match.
function blobPath(cx, cy, rx, ry, texture, pear = 0) {
  const { spacing, push, jagged, irregular } = EDGE[texture] || EDGE.smooth
  const n = Math.max(8, Math.round(ellipsePerimeter(rx, ry) / spacing))
  const scale = Math.min(1, Math.max(rx, ry) / 34)
  const out = push * scale

  const pt = (i) => {
    // Uneven angular spacing and radius so the base outline isn't a clean ring.
    // `irregular` dials that back, which is what keeps smooth fur tidy.
    const a =
      ((360 / n) * (i + (rand(i, 4) - 0.5) * 0.3 * irregular) - 90) *
      (Math.PI / 180)
    const wobble = 1 + (rand(i, 1) - 0.5) * 0.06 * irregular
    const widen = (1 + pear * Math.max(0, Math.sin(a))) * wobble
    return { x: cx + rx * widen * Math.cos(a), y: cy + ry * widen * Math.sin(a) }
  }

  const pts = Array.from({ length: n }, (_, i) => pt(i))
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`

  for (let i = 0; i < n; i++) {
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const mx = (p1.x + p2.x) / 2
    const my = (p1.y + p2.y) / 2
    const dx = mx - cx
    const dy = my - cy
    const len = Math.hypot(dx, dy) || 1
    // Each tuft gets its own length and lean, so no two look alike.
    const k = out * (1 + (rand(i, 2) - 0.5) * 1.05 * irregular)
    const lean =
      (rand(i, 3) - 0.5) *
      Math.hypot(p2.x - p1.x, p2.y - p1.y) *
      0.55 *
      irregular
    const ox = mx + (dx / len) * k - (dy / len) * lean
    const oy = my + (dy / len) * k + (dx / len) * lean
    d += jagged
      ? ` L ${ox.toFixed(1)} ${oy.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      : ` Q ${ox.toFixed(1)} ${oy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return `${d} Z`
}

function HeadFeature({ headFeature, headFeatureColor }) {
  const stripe = darken(headFeatureColor, 0.32)
  if (headFeature === 'horns') {
    return (
      <g>
        <g fill={headFeatureColor}>
          <path d="M 74 36 Q 56 28 55 4 Q 71 13 84 33 Z" />
          <path d="M 126 36 Q 144 28 145 4 Q 129 13 116 33 Z" />
        </g>
        <g stroke={stripe} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M 66 26 Q 71 22 76 25" />
          <path d="M 60 15 Q 64 12 68 15" />
          <path d="M 134 26 Q 129 22 124 25" />
          <path d="M 140 15 Q 136 12 132 15" />
        </g>
      </g>
    )
  }
  if (headFeature === 'spikes') {
    return (
      <g fill={headFeatureColor}>
        <path d="M 72 34 L 80 6 L 88 32 Z" />
        <path d="M 90 30 L 100 0 L 110 30 Z" />
        <path d="M 112 32 L 120 6 L 128 34 Z" />
      </g>
    )
  }
  // antennae with bobble tips
  return (
    <g>
      <g fill="none" stroke={headFeatureColor} strokeWidth="3" strokeLinecap="round">
        <path d="M 82 30 Q 72 16 63 9" />
        <path d="M 118 30 Q 128 16 137 9" />
      </g>
      <circle cx="61" cy="7" r="6" fill={headFeatureColor} />
      <circle cx="139" cy="7" r="6" fill={headFeatureColor} />
      <circle cx="59" cy="5" r="2" fill={lighten(headFeatureColor, 0.5)} />
      <circle cx="137" cy="5" r="2" fill={lighten(headFeatureColor, 0.5)} />
    </g>
  )
}

function Eye({ cx, cy, r, lid, furColor, id }) {
  const lidHeight = lid * (r * 2.05)
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#fff" />
      <circle cx={cx} cy={cy + r * 0.1} r={r * 0.6} fill="#1f1c1c" />
      <circle cx={cx - r * 0.22} cy={cy - r * 0.24} r={r * 0.24} fill="#fff" />
      <circle cx={cx + r * 0.26} cy={cy + r * 0.3} r={r * 0.1} fill="#fff" opacity="0.9" />
      {lid > 0 && (
        <rect
          x={cx - r - 1}
          y={cy - r - 1}
          width={r * 2 + 2}
          height={lidHeight}
          fill={furColor}
          clipPath={`url(#${id})`}
        />
      )}
    </g>
  )
}

function Mouth({ expression, droop, uid }) {
  const dy = droop

  if (expression === 'goofy') {
    // Big open laugh: dark interior, jagged white teeth along the top, tongue.
    const shape = 'M 70 124 Q 100 114 130 124 Q 128 162 100 165 Q 72 162 70 124 Z'
    return (
      <g transform={`translate(0 ${dy})`}>
        <defs>
          <clipPath id={`${uid}-m`}>
            <path d={shape} />
          </clipPath>
        </defs>
        <path d={shape} fill="#4f2029" />
        <ellipse cx="100" cy="168" rx="20" ry="13" fill="#f2748c" clipPath={`url(#${uid}-m)`} />
        <path
          d="M 68 118 L 78 134 L 86 118 L 94 134 L 102 118 L 110 134 L 118 118 L 126 133 L 133 118 L 133 110 L 68 110 Z"
          fill="#fff"
          clipPath={`url(#${uid}-m)`}
        />
      </g>
    )
  }

  if (expression === 'happy') {
    // Closed wide grin with two fangs poking down over the lip.
    return (
      <g transform={`translate(0 ${dy})`}>
        <path
          d="M 74 126 Q 100 154 126 126"
          fill="none"
          stroke="#2f2a2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M 84 132 L 95 136 L 88 149 Z" fill="#fff" />
        <path d="M 116 132 L 105 136 L 112 149 Z" fill="#fff" />
      </g>
    )
  }

  const simple = {
    meh: 'M 84 136 L 116 136',
    sad: 'M 80 144 Q 100 126 120 144',
  }
  return (
    <path
      d={simple[expression] || simple.meh}
      fill="none"
      stroke="#2f2a2a"
      strokeWidth="4.2"
      strokeLinecap="round"
      transform={`translate(0 ${dy})`}
    />
  )
}

function Aura({ sparkle, zzz }) {
  return (
    <g>
      <g opacity={sparkle}>
        <path d="M 168 34 l 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#ffd76a" />
        <path d="M 26 48 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#8fd0ff" />
      </g>
      <g opacity={zzz}>
        <text x="156" y="38" fontSize="14" fontWeight="700" fill="#94a3b8">z</text>
        <text x="166" y="26" fontSize="18" fontWeight="700" fill="#94a3b8">Z</text>
        <text x="179" y="15" fontSize="22" fontWeight="700" fill="#94a3b8">Z</text>
      </g>
    </g>
  )
}

export default function Monster({
  furColor = '#7fb3e8',
  texture = 'smooth',
  eyeCount = 2,
  headFeature = 'horns',
  headFeatureColor = '#f2b134',
  energy = DEFAULT_ENERGY,
  size = 176,
}) {
  const uid = useId()
  const preset = STAGE_PRESETS[stageFromEnergy(energy)]
  const bellyColor = lighten(furColor, 0.28)
  const footColor = darken(furColor, 0.2)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        filter: `saturate(${preset.saturate}) brightness(${preset.brightness})`,
        transition: 'filter 0.4s ease',
      }}
    >
      <g transform={`rotate(${preset.slump} 100 110) translate(0 ${preset.slump * 0.8})`}>
        {/* Feet */}
        <ellipse cx="77" cy="176" rx="17" ry="9.5" fill={footColor} />
        <ellipse cx="123" cy="176" rx="17" ry="9.5" fill={footColor} />

        {/* Stubby arms, same fur treatment as the body, tucked into its sides */}
        <path d={blobPath(41, 128, 12, 14, texture)} fill={furColor} />
        <path d={blobPath(159, 128, 12, 14, texture)} fill={furColor} />

        {/* Body */}
        <path d={blobPath(CX, CY, RX, RY, texture, 0.1)} fill={furColor} />

        {/* Low, wide tummy patch */}
        <ellipse cx="100" cy="145" rx="35" ry="19" fill={bellyColor} />

        <HeadFeature headFeature={headFeature} headFeatureColor={headFeatureColor} />

        {/* Blush */}
        <ellipse cx="60" cy="115" rx="10" ry="5.5" fill="#f4849e" opacity="0.5" />
        <ellipse cx="140" cy="115" rx="10" ry="5.5" fill="#f4849e" opacity="0.5" />

        {eyeCount === 1 ? (
          <Eye cx={100} cy={80} r={35} lid={preset.lid} furColor={furColor} id={`${uid}-eye`} />
        ) : (
          <>
            <Eye cx={76} cy={78} r={24} lid={preset.lid} furColor={furColor} id={`${uid}-eye-l`} />
            <Eye cx={124} cy={78} r={24} lid={preset.lid} furColor={furColor} id={`${uid}-eye-r`} />
          </>
        )}

        <Mouth expression={preset.mouth} droop={preset.droop} uid={uid} />

        <Aura sparkle={preset.sparkle} zzz={preset.zzz} />
      </g>
    </svg>
  )
}
