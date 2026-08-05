import { useEffect, useState } from 'react'

const PHONE_W = 390
const PHONE_H = 844

// On a real phone the browser viewport is only ~660px tall, so an 844px frame
// can't fit. Scale it down to whatever does fit — but never up, so desktop
// keeps the frame at exactly 390x844 for screenshots.
function fittedScale(padding) {
  if (typeof window === 'undefined') return 1
  const w = (window.innerWidth - padding * 2) / PHONE_W
  const h = (window.innerHeight - padding * 2) / PHONE_H
  return Math.min(1, w, h)
}

export default function PhoneFrame({ children }) {
  const [scale, setScale] = useState(() => fittedScale(16))

  useEffect(() => {
    const measure = () => {
      // Tighter gutters once we're squeezed, so more of the phone survives.
      const padding = window.innerWidth < 900 ? 12 : 32
      setScale(fittedScale(padding))
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  return (
    <div
      className="min-h-screen w-full flex flex-wrap items-center justify-center gap-6 md:gap-12 bg-surface p-3 md:p-8"
      style={{ '--phone-scale': scale }}
    >
      {children}
    </div>
  )
}
