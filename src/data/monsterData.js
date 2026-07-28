export const GREETINGS = [
  'Hi! Ready to focus?',
  "Yay, you're back!",
  "Let's crush it today!",
  'Missed you!',
]

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
export const EXPRESSIONS = ['happy', 'goofy', 'meh', 'sad']
export const HEAD_FEATURES = ['horns', 'curls', 'spikes']

export const NUDGE_MESSAGES_LOW_ENERGY = [
  "You've got this! I believe in you!",
  'Stay strong — we can focus together!',
]

export const NUDGE_MESSAGES_HIGH_ENERGY = [
  "I'm getting sleepy... let's focus together?",
  'All this unlocking wears me out a little...',
]

export function nudgeMessage(energy) {
  const pool = energy >= 2 ? NUDGE_MESSAGES_HIGH_ENERGY : NUDGE_MESSAGES_LOW_ENERGY
  return pool[0]
}

export const DEFAULT_MONSTER = {
  name: 'Fluffernaut',
  furColor: FUR_COLORS[0],
  texture: 'smooth',
  eyeCount: 2,
  expression: 'happy',
  headFeature: 'horns',
  headFeatureColor: HEAD_FEATURE_COLORS[0],
  scene: 'Room',
}
