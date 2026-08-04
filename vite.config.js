import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { APP_NAME } from './src/data/branding.js'

// Served from a repo subpath on GitHub Pages, so assets need that prefix.
// Dev keeps '/' so localhost is unaffected.
const base = process.env.NODE_ENV === 'production' ? '/focus-app/' : '/'

// The manifest is generated rather than committed so the product name stays
// in one place — branding.js — instead of being copied into a static file the
// next rename would miss. It also keeps the provisional name out of the repo,
// which is what that file asks for.
const manifest = {
  name: APP_NAME,
  short_name: APP_NAME,
  description:
    'Focus blocks, app blocking and a screen-time companion that runs on how much you actually use your phone.',
  // Both are the base: launching the installed app opens the app, and any
  // URL outside the scope is handed back to the browser.
  start_url: base,
  scope: base,
  display: 'standalone',
  orientation: 'portrait',
  // Matches the top of the app's gradient, so the launch screen doesn't flash
  // white before the first paint.
  background_color: '#f0f9ff',
  theme_color: '#2a78d6',
  icons: [
    { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png' },
    { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png' },
    {
      src: `${base}icon-maskable-512.png`,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
}

function webAppManifest() {
  const body = JSON.stringify(manifest, null, 2)

  return {
    name: 'web-app-manifest',

    // index.html carries the name in the title and the iOS home-screen label.
    transformIndexHtml(html) {
      return html.replaceAll('%APP_NAME%', APP_NAME)
    },

    // Dev has no bundle to emit into, so the file is served from memory —
    // otherwise install prompts only work in a production build.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/manifest.webmanifest')) return next()
        res.setHeader('Content-Type', 'application/manifest+json')
        return res.end(body)
      })
    },

    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: body,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), webAppManifest()],
  base,
})
