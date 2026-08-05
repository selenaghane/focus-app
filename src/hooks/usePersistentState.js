import { useCallback, useEffect, useState } from 'react'
import { loadValue, saveValue } from '../services/storage'

// useState that remembers. Same signature, so a component swapping one for
// the other doesn't change at the call site.
//
// The write happens in an effect rather than inside the setter so that
// functional updates (`setBlocks(b => ...)`) persist too, and so a render
// that never commits doesn't leave anything behind on disk.
export default function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = loadValue(key, undefined)
    if (stored !== undefined) return stored
    // Lazy initialisers, same as useState — some defaults have to measure
    // something (the OS colour scheme, the clock) and shouldn't run on every
    // render just to be thrown away.
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    saveValue(key, value)
  }, [key, value])

  const reset = useCallback(
    () => setValue(typeof initial === 'function' ? initial() : initial),
    [initial],
  )

  return [value, setValue, reset]
}
