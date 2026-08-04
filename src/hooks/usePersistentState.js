import { useCallback, useEffect, useState } from 'react'
import { loadValue, saveValue } from '../services/storage'

// useState that remembers. Same signature, so a component swapping one for
// the other doesn't change at the call site.
//
// The write happens in an effect rather than inside the setter so that
// functional updates (`setBlocks(b => ...)`) persist too, and so a render
// that never commits doesn't leave anything behind on disk.
export default function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => loadValue(key, initial))

  useEffect(() => {
    saveValue(key, value)
  }, [key, value])

  const reset = useCallback(() => setValue(initial), [initial])

  return [value, setValue, reset]
}
