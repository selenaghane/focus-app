export const SCENES = ['Room', 'Forest', 'Space', 'Beach']

export const FUR_COLORS = [
  '#7fb3e8',
  '#8fd6b0',
  '#f4b8c4',
  '#f6c667',
  '#b9a7e6',
  '#f2957a',
]

export const HEAD_FEATURE_COLORS = ['#f2b134', '#2a78d6', '#1baf7a', '#e8607a']

export const TEXTURES = ['smooth', 'curly', 'fuzzy', 'spiky']
export const HEAD_FEATURES = ['horns', 'antennae', 'spikes']

// The monster runs on an energy meter out of 100. Social media time drains
// it; focused time gives it back. 100 = thriving, 0 = lifeless.
export const MAX_ENERGY = 100
export const DEFAULT_ENERGY = 100

// Energy rounds to one of five presets rather than sliding continuously, so
// the change is legible: the monster visibly *becomes* a different creature.
export const MONSTER_STAGES = [
  { id: 'thriving', label: 'Thriving', blurb: 'Full of beans.' },
  { id: 'good', label: 'Doing well', blurb: 'Happy and alert.' },
  { id: 'tired', label: 'A bit tired', blurb: 'Starting to flag.' },
  { id: 'drained', label: 'Drained', blurb: 'Running on empty.' },
  { id: 'exhausted', label: 'Exhausted', blurb: 'Barely awake.' },
]

// 100 -> stage 0, 0 -> stage 4. Floors rather than rounds, so a stage is only
// lost once its full share of the drop has actually been used up — that keeps
// this in step with the "each 5% over the goal costs one stage" rule.
export function stageFromEnergy(energy) {
  const clamped = Math.max(0, Math.min(MAX_ENERGY, energy))
  const perStage = MAX_ENERGY / (MONSTER_STAGES.length - 1)
  const stage = Math.floor((MAX_ENERGY - clamped) / perStage)
  return Math.max(0, Math.min(MONSTER_STAGES.length - 1, stage))
}

export function stageInfo(energy) {
  return MONSTER_STAGES[stageFromEnergy(energy)]
}

export const NUDGE_MESSAGES_HEALTHY = [
  "You've got this! I believe in you!",
  'Stay strong — we can focus together!',
]

export const NUDGE_MESSAGES_DRAINED = [
  "I'm getting sleepy... let's focus together?",
  'All this scrolling wears me out a little...',
]

export function nudgeMessage(energy) {
  const pool = stageFromEnergy(energy) >= 2 ? NUDGE_MESSAGES_DRAINED : NUDGE_MESSAGES_HEALTHY
  return pool[0]
}

export const DEFAULT_MONSTER = {
  name: 'Fluffernaut',
  furColor: FUR_COLORS[0],
  texture: 'fuzzy',
  eyeCount: 2,
  headFeature: 'horns',
  headFeatureColor: HEAD_FEATURE_COLORS[0],
  scene: 'Room',
}
