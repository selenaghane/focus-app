import { useCallback, useEffect, useState } from 'react'

// Navigation that survives a reload and answers the back button, so reopening
// the installed app lands where you left it and the phone's back gesture moves
// between tabs rather than leaving the app.
//
// The hash carries the route rather than a real path because the build is
// served from a static host with no rewrite rules: a deep link to /schedule
// would 404, while /#/schedule always resolves.
function readRoute(fallback) {
  if (typeof window === 'undefined') return fallback
  return window.location.hash.replace(/^#\/?/, '') || fallback
}

export default function useHashRoute(fallback) {
  const [route, setRoute] = useState(() => readRoute(fallback))

  useEffect(() => {
    const onChange = () => setRoute(readRoute(fallback))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [fallback])

  const navigate = useCallback((next, { replace = false } = {}) => {
    const url = `#/${next}`
    if (replace) {
      // No hashchange fires for a replace, so state is updated by hand.
      window.history.replaceState(null, '', url)
    } else {
      window.location.hash = url
    }
    setRoute(next)
  }, [])

  return [route, navigate]
}
