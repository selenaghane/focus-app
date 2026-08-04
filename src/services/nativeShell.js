// Chrome that only exists inside the iOS shell.
//
// IS_NATIVE is replaced with a literal at build time, so for the web build
// every branch below is statically false and the Capacitor imports are
// dropped rather than shipped to browsers that have no use for them.
//
// Nothing here is load-bearing: each call is wrapped, because a plugin
// failing to resolve should cost a bit of polish, not the whole app.

export const IS_NATIVE = import.meta.env.VITE_NATIVE === '1'

// The launch screen is configured not to auto-hide on a timer, so that it
// covers the gap until React has actually painted rather than disappearing
// onto a half-built screen. That makes this call the thing that reveals the
// app — if it never runs, the shell's own timeout is the safety net.
export async function hideSplash() {
  if (!IS_NATIVE) return
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide()
  } catch {
    // Nothing to do: the shell hides it on its own timer.
  }
}

// Naming here is the opposite of what it looks like: Style.Dark means light
// text *for* a dark background, so dark mode wants Style.Dark.
export async function syncStatusBar(darkMode) {
  if (!IS_NATIVE) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light })
  } catch {
    // Leaves the status bar at the system default, which is still legible.
  }
}
