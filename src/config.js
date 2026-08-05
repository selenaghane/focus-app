// How this build is being presented.
//
// Presenting the idea on a laptop wants something the installed app can't be:
// a pinned clock so screenshots are reproducible, a day of usage already on
// the clock so the screens have something to show, and both the app and a
// blocked app visible at once. That's a presentation mode, kept off the
// default path.
//
//   /            the app, on the real clock, remembering real state
//   /?demo=1     presentation: pinned clock, seeded usage, phone + block screen
//
// Read once at startup so every module agrees for the lifetime of the
// session; flipping mode mid-session would leave stale state behind.
const params =
  typeof window === 'undefined'
    ? new URLSearchParams()
    : new URLSearchParams(window.location.search)

export const DEMO_MODE = params.has('demo') && params.get('demo') !== '0'
