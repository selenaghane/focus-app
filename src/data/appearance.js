// Display preferences. Each one maps to an attribute or variable on <html>,
// which is what the rules in index.css hang off — so a setting changes the
// whole app rather than just the switch that set it.

export const TEXT_SIZES = ['Small', 'Default', 'Large']

// Applied as a zoom on the app surface. The screens are laid out in fixed
// pixels throughout, so scaling the surface is what actually moves every
// label — a root font-size would leave all the `text-[11px]` sizes behind.
export const TEXT_SCALES = {
  Small: 0.9,
  Default: 1,
  Large: 1.15,
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
    textSize: 'Default',
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
  el.style.setProperty('--ui-scale', TEXT_SCALES[appearance.textSize] ?? 1)
}
