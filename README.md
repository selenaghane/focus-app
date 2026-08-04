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

- **Is a phone app at every width.** One column capped to phone width, tab bar
  along the bottom, safe-area insets keeping content clear of the notch and
  home indicator. On a desktop browser it centres against a flat surround —
  no bezel, no shadow, nothing pretending to be hardware. What's on screen
  there is what ships.
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

The Live and Insights screens are nothing but glasses telemetry — a focus
score, pupil reactivity, and the trends built from them — and there is no
hardware to read yet. They're hidden rather than filled with invented numbers,
as is the paired-device card on the Glasses tab. The sample figures stay in
`src/data/`, still wired to their components; connecting a pair brings both
tabs straight back.

## The seams

Two modules are where the native work lands. Nothing else needs to change.

**`src/services/screenTime.js`** — everything the UI knows about time spent on
blocked apps. A native shell sets `globalThis.__focusScreenTime` before the app
mounts, with `getTodayUsage()` and an optional `subscribe()`; the file documents
the exact shape. With no bridge present it falls back to the local unlock
ledger. Screens read it through `useScreenTime()` and can't tell the
difference.

**`src/services/glasses.js`** — whether there's a real pair to talk to. Same
shape: a shell sets `globalThis.__focusGlasses` with `isConnected()`,
`getDevice()` and `getSession()`. Everything downstream of the glasses is
gated on it, so the screens that need hardware appear the moment it reports
connected — and demo mode reports connected, which is how `?demo=1` still
shows the whole product.

**`src/services/storage.js`** — one versioned key holding everything that
survives a launch. Bump `SCHEMA_VERSION` when a shape changes and stale data is
dropped in one place. It degrades to memory when storage is unavailable, so
private-mode Safari doesn't crash the app.

## The iOS app

Capacitor wraps this build in a native shell. `ios/` is a real Xcode project,
committed, with the app icon, launch screens and Info.plist already set up.

```sh
npm run build:ios    # native build + copy into the Xcode project
npm run ios          # the same, then open Xcode
```

The two builds differ, which is why they're separate commands. The web build
is served from a repo subpath and registers an offline service worker; the
native one is served from `capacitor://localhost` at the root and skips the
worker, since its assets are already on disk. Running `npm run build` and
copying that into the shell gives a blank screen — every asset path would be
prefixed with `/focus-app/`.

### Building it

Needs a Mac with Xcode. Capacitor 8 uses Swift Package Manager, so there's no
CocoaPods step.

1. `npm install && npm run build:ios`
2. `npx cap open ios`
3. In Xcode, select the **App** target → Signing & Capabilities → set your
   team. The bundle id is `com.optifocus.app`; change it in
   `capacitor.config.json` if that's taken, then re-run `npm run build:ios`.
4. Run on a device. The simulator is fine for layout, but Screen Time APIs
   only work on real hardware.
5. Product → Archive → Distribute App to get it to TestFlight.

After any change to the app, `npm run build:ios` again — Xcode serves the
copied files in `ios/App/App/public`, not `dist/`.

### What still blocks the App Store

Being honest about the gap, because it isn't small:

- **The blocking doesn't work yet.** Interception needs a Swift plugin over
  **FamilyControls**, **DeviceActivity** and **ManagedSettings** — shields on
  the blocked apps, with the justification screen as the shield action. That
  plugin is the one substantial piece of native code left, and it's what fills
  `services/screenTime.js` and turns the self-reported unlocks into real
  per-app totals.
- **Family Controls is a restricted entitlement.** It's requested from Apple
  separately, reviewed by hand, and can be turned down. Worth applying for
  early — it gates everything above.
- **An Apple Developer Program membership** ($99/yr) is needed before anything
  can go to TestFlight, let alone the store.
- **Review will ask what the app does.** Right now a reviewer sees focus
  blocks, a screen-time goal and a companion creature, with the glasses
  screens hidden — that's a coherent app, but it isn't the one the pitch
  describes.

### Android

Same shape when you get there: `UsageStatsManager` for per-app totals, an
accessibility or overlay service for the shield, behind the same two seams.

## Deploying

`npm run deploy` builds and publishes `dist/` to GitHub Pages. The build is
served from a repo subpath, so `vite.config.js` sets `base` accordingly and the
manifest, icons and service worker scope all derive from it.
