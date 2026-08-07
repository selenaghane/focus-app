function mix(channel, target, percent) {
  return Math.round(channel + (target - channel) * percent)
}

function adjustHex(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const target = percent > 0 ? 255 : 0
  const p = Math.abs(percent)
  const channels = [mix(r, target, p), mix(g, target, p), mix(b, target, p)]
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function lighten(hex, percent = 0.28) {
  return adjustHex(hex, percent)
}

export function darken(hex, percent = 0.18) {
  return adjustHex(hex, -percent)
}