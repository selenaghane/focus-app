// Generates the home-screen icons in public/.
//
// Run with `npm run icons`. Committing the PNGs rather than building them
// every time keeps the icons out of the critical path of a normal build, and
// this script is here so a change of colour or glyph is a re-run rather than
// an afternoon in a graphics editor.
//
// The glyph is the same monster outline the tab bar uses, so the icon on the
// home screen and the icon in the app are recognisably the same creature.

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// Brand blue through to the monster's green.
const GRADIENT_FROM = '#2a78d6'
const GRADIENT_TO = '#1baf7a'

// The tab bar's monster, as a 24-unit glyph.
const GLYPH = `
  <path d="M12 3c4 0 6.5 3 6.5 7 0 5-3 10-6.5 10S5.5 15 5.5 10c0-4 2.5-7 6.5-7Z"
        fill="none" stroke="#fff" stroke-width="1.8" />
  <circle cx="9.3" cy="10" r="1.1" fill="#fff" />
  <circle cx="14.7" cy="10" r="1.1" fill="#fff" />
  <path d="M9.5 14c1 1 4 1 5 0" fill="none" stroke="#fff" stroke-width="1.6"
        stroke-linecap="round" />`

// A maskable icon can be cropped to a circle of 80% of the canvas, so the
// glyph is kept well inside that: at this scale it spans ~220px of a 512px
// square, comfortably within the 410px safe circle.
const GLYPH_SCALE = 13 / 512

function svg({ size, rounded }) {
  const scale = size * GLYPH_SCALE
  const radius = rounded ? size * 0.1875 : 0
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GRADIENT_FROM}" />
      <stop offset="1" stop-color="${GRADIENT_TO}" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)" />
  <g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(-12 -11.5)">${GLYPH}
  </g>
</svg>`
}

// Icons live under a repo subpath on GitHub Pages, so nothing here may assume
// it is served from the origin root — these are written as plain files and
// the manifest prefixes them with the configured base at build time.
const TARGETS = [
  { file: 'icon-192.png', size: 192, rounded: false },
  { file: 'icon-512.png', size: 512, rounded: false },
  // Full-bleed: Android and iOS both apply their own mask, and a rounded
  // source would leave the platform's mask cutting into empty corners.
  { file: 'icon-maskable-512.png', size: 512, rounded: false },
  { file: 'apple-touch-icon.png', size: 180, rounded: false },
]

// The iOS asset catalog. Modern Xcode wants a single 1024px app icon and
// scales the rest itself, and the launch images are flat colour on purpose:
// Apple's guidance is that a launch screen shouldn't carry a logo, and a
// plain field matching the app's own background makes the handover from
// launch screen to first paint invisible.
const IOS_ICON = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'
const IOS_SPLASH_DIR = 'ios/App/App/Assets.xcassets/Splash.imageset'
const SPLASH_LIGHT = '#f0f9ff'
const SPLASH_DARK = '#0b1220'
const SPLASH_SIZE = 2732

// Playwright resolves a browser build matching its own version, which isn't
// always the one an environment has on disk. CHROMIUM_PATH points it at an
// existing Chromium instead of forcing a download.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
})
const page = await browser.newPage()

for (const { file, size, rounded } of TARGETS) {
  const markup = svg({ size, rounded })
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<body style="margin:0">${markup}</body>`,
    { waitUntil: 'load' },
  )
  await page.screenshot({ path: join(PUBLIC_DIR, file), omitBackground: true })
  console.log(`wrote public/${file}`)
}

// --- iOS -------------------------------------------------------------
// Only written when the platform has been added; the web build doesn't need
// it and shouldn't fail without it.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

if (existsSync(join(ROOT, 'ios'))) {
  // App Store Connect rejects an app icon that carries an alpha channel,
  // even one that's fully opaque — so this is the one icon screenshotted
  // *with* a background rather than with omitBackground.
  await page.setViewportSize({ width: 1024, height: 1024 })
  await page.setContent(
    `<body style="margin:0">${svg({ size: 1024, rounded: false })}</body>`,
    { waitUntil: 'load' },
  )
  await page.screenshot({ path: join(ROOT, IOS_ICON) })
  console.log(`wrote ${IOS_ICON}`)

  // Capacitor's catalog holds one file per scale slot. They're identical —
  // the image is a flat colour — but Xcode wants all three present.
  for (const [name, colour] of [['', SPLASH_LIGHT], ['-dark', SPLASH_DARK]]) {
    await page.setViewportSize({ width: SPLASH_SIZE, height: SPLASH_SIZE })
    await page.setContent(`<body style="margin:0;background:${colour}"></body>`, {
      waitUntil: 'load',
    })
    for (const suffix of ['', '-1', '-2']) {
      const file = `splash${name}-2732x2732${suffix}.png`
      await page.screenshot({ path: join(ROOT, IOS_SPLASH_DIR, file) })
    }
    console.log(`wrote ${IOS_SPLASH_DIR}/splash${name}-2732x2732*.png`)
  }

  // Dark entries alongside the light ones, so the launch screen matches the
  // phone's appearance instead of flashing white into a dark app.
  const splashEntries = ['1x', '2x', '3x'].flatMap((scale, i) => {
    const suffix = ['-2', '-1', ''][i]
    return [
      { idiom: 'universal', filename: `splash-2732x2732${suffix}.png`, scale },
      {
        idiom: 'universal',
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        filename: `splash-dark-2732x2732${suffix}.png`,
        scale,
      },
    ]
  })
  await writeFile(
    join(ROOT, IOS_SPLASH_DIR, 'Contents.json'),
    `${JSON.stringify(
      { images: splashEntries, info: { version: 1, author: 'xcode' } },
      null,
      2,
    )}\n`,
  )
  console.log(`wrote ${IOS_SPLASH_DIR}/Contents.json`)
}

await browser.close()

// The favicon stays vector: it's the one icon a browser renders at wildly
// different sizes, and it gets the rounded app-icon silhouette because
// nothing masks it.
await mkdir(PUBLIC_DIR, { recursive: true })
await writeFile(join(PUBLIC_DIR, 'favicon.svg'), `${svg({ size: 512, rounded: true })}\n`)
console.log('wrote public/favicon.svg')
