# Focus app

A phone app for staying off distracting apps: scheduled focus blocks, a
justification gate in front of anything blocked, a companion creature whose
health tracks how far past your daily screen-time goal you are, and a screen
for the paired glasses.

React + Vite + Tailwind. It installs to a home screen and runs offline.

## Running it

```sh
npm install
npm run dev        # the app
npm run build      # production build
npm run icons      # regenerate the home-screen icons in public/
```

`npm run dev` serves the app itself. Add `?demo=1` for presentation mode — two
phones side by side, a clock pinned to Monday afternoon and a seeded day of
usage, so the idea can be shown end to end on a laptop. It never writes to
disk, so a walkthrough always opens on the same day and can't disturb real
state.

## How it behaves

- **Fills the device screen**, with safe-area insets keeping content clear of
  the notch and home indicator. Past 1024px the tab bar becomes a left rail
  and the content takes a readable column beside it.
- **The appearance controls do what they say.** Dark mode re-themes every
  surface, text size scales the whole UI, reduce motion stops the animations
  (on top of the OS setting, which is always honoured), and the dyslexia
  option switches to wide letterforms with looser tracking.
- **Runs on the wall clock.** Focus blocks start and end when they say they
  will.
- **Remembers.** Schedule, blocked apps, goal, unlock length and the monster
  all persist; today's usage resets at local midnight.
- **Every tab has a URL**, so reload and the back button behave.
- **Installs.** Manifest, icons and an offline service worker; on iOS,
  Share → Add to Home Screen.
- **Gates unlocks** behind sixty typed words, with pasting refused.

## What needs the native build

A web build cannot put itself in front of Instagram — interception is the one
capability that has to come from native code, and the app says so on the block
screen rather than implying otherwise. Until then usage is counted from the
unlocks the app hands out itself: a real number, just an incomplete one, and
labelled as such on the Screen Time card.

The pupil and focus figures on the Live and Insights screens are sample data
from `src/data/`, pending glasses hardware to read from.

## The seams

Two modules are where the native work lands. Nothing else needs to change.

**`src/services/screenTime.js`** — everything the UI knows about time spent on
blocked apps. A native shell sets `globalThis.__focusScreenTime` before the app
mounts, with `getTodayUsage()` and an optional `subscribe()`; the file documents
the exact shape. With no bridge present it falls back to the local unlock
ledger. Screens read it through `useScreenTime()` and can't tell the
difference.

**`src/services/storage.js`** — one versioned key holding everything that
survives a launch. Bump `SCHEMA_VERSION` when a shape changes and stale data is
dropped in one place. It degrades to memory when storage is unavailable, so
private-mode Safari doesn't crash the app.

## Getting to a native build

The web app is the shell, so this is additive rather than a rewrite:

1. Wrap it with Capacitor (`@capacitor/ios`). The existing build output becomes
   the web view's contents unchanged.
2. Write a small plugin exposing iOS **FamilyControls** + **DeviceActivity**,
   and have it install `globalThis.__focusScreenTime` on startup. That fills in
   real per-app totals — the app's usage numbers become complete with no UI
   changes.
3. Use **ManagedSettings** shields for the actual interception, with the
   justification screen as the shield's action. This is the part that needs a
   paid developer account and a Family Controls entitlement from Apple.
4. Android is the same shape: `UsageStatsManager` for totals, an accessibility
   or overlay service for the shield.

Steps 1 and 2 stand alone and are worth doing first — usage stops depending on
self-reported unlocks well before shields exist.

## Deploying

`npm run deploy` builds and publishes `dist/` to GitHub Pages. The build is
served from a repo subpath, so `vite.config.js` sets `base` accordingly and the
manifest, icons and service worker scope all derive from it.
