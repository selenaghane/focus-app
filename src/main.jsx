import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { hideSplash } from './services/nativeShell'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Reveal the app only once there's something painted to reveal. Two frames
// out rather than one: the first commit lands the DOM, the second is when
// the browser has actually put it on screen.
requestAnimationFrame(() => requestAnimationFrame(hideSplash))

// Web build only. In dev a service worker just serves stale modules and
// fights HMR; in the native shell every asset is already on disk, so caching
// them again buys nothing and adds a second layer that can go stale between
// app updates. A failed registration isn't worth surfacing — the app works
// fine without one, it simply won't open with no network.
if (
  import.meta.env.PROD &&
  import.meta.env.VITE_NATIVE !== '1' &&
  'serviceWorker' in navigator
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {})
  })
}