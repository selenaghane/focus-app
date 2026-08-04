// Offline support for the installed app.
//
// A precache manifest would mean feeding the build's hashed filenames in
// here; runtime caching reaches the same place for an app this size without
// that coupling. The first visit fills the cache from the network, later
// visits are served from it and refresh it in the background, and a launch
// with no network at all falls back to whatever was cached.
//
// Bump CACHE to force every client onto a fresh copy.

const CACHE = 'focus-app-v1'

// The scope is the base the app is served from ('/' locally, '/focus-app/' on
// Pages), which is also the URL the app shell lives at.
const SHELL = new URL(self.registration.scope).href

self.addEventListener('install', (event) => {
  // The shell is the one thing worth having before it is first asked for:
  // without it, a cold offline launch has no document to render at all.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(new Request(SHELL, { cache: 'reload' })))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  // Every in-app URL is the same document — the router lives in the hash — so
  // all navigations resolve to the shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cloned straight away: once the browser starts reading the body,
          // it's too late to take a copy for the cache.
          const copy = response.clone()
          event.waitUntil(caches.open(CACHE).then((c) => c.put(SHELL, copy)))
          return response
        })
        .catch(async () => (await caches.match(SHELL)) ?? Response.error()),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            event.waitUntil(caches.open(CACHE).then((c) => c.put(request, copy)))
          }
          return response
        })
        // A miss on both sides has to resolve to something, or the request
        // rejects and the browser shows its own error page.
        .catch(() => cached ?? Response.error())

      // Cache first, so a slow network never holds up a render. The fetch
      // still runs, which is what keeps the next launch current.
      return cached ?? network
    }),
  )
})
