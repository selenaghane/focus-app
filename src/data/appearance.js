// Display preferences. Each one maps to an attribute or variable on <html>,
// which is what the rules in index.css hang off — so a setting changes the
// whole app rather than just the switch that set it.

// Six steps on the text-size slider. The scale multiplies every `--text-*`
// token and the handful of `text-[Npx]` labels in index.css — layout, icons,
// and images are untouched, so only the text itself grows or shrinks.
export const TEXT_SIZE_STEPS = [0.85, 0.925, 1, 1.075, 1.15, 1.25]
export const TEXT_SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const DEFAULT_TEXT_SIZE_INDEX = 2

function textScale(textSize) {
  return TEXT_SIZE_STEPS[textSize] ?? TEXT_SIZE_STEPS[DEFAULT_TEXT_SIZE_INDEX]
}

function prefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// First run follows the phone's own appearance setting, which is what someone
// who keeps their device in dark mode expects. After that the toggle wins,
// because it's been stored.
export function defaultAppearance() {
  return {
    darkMode: prefersDark(),
    textSize: DEFAULT_TEXT_SIZE_INDEX,
    dyslexiaFont: false,
    reduceMotion: false,
  }
}

export function applyAppearance(appearance) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  el.dataset.theme = appearance.darkMode ? 'dark' : 'light'
  el.dataset.font = appearance.dyslexiaFont ? 'dyslexia' : 'default'
  // The OS-level reduced-motion preference is honoured in CSS regardless;
  // this only lets someone additionally force it on.
  el.dataset.motion = appearance.reduceMotion ? 'reduced' : 'full'
  el.style.setProperty('--ui-text-scale', textScale(appearance.textSize))
}
