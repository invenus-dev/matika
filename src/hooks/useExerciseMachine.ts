import { useState, useRef, useEffect } from 'react'
import type { ReducerResult } from '../state-machines/types'

export function useExerciseMachine<S, A>(
  reducer: (state: S, action: A, now: number) => ReducerResult<S>,
  createInitialState: () => S,
  onBeforeDispatch?: (state: S, action: A) => void,
): [S, (action: A) => void] {
  const [state, setState] = useState(createInitialState)
  const refs = useRef({
    state,
    reducer,
    onBeforeDispatch,
    timer: null as ReturnType<typeof setTimeout> | null,
  })

  useEffect(() => {
    refs.current.state = state
    refs.current.reducer = reducer
    refs.current.onBeforeDispatch = onBeforeDispatch
  })

  useEffect(() => {
    const r = refs.current
    return () => {
      if (r.timer) clearTimeout(r.timer)
    }
  }, [])

  const [dispatch] = useState(() => {
    const fn = (action: A) => {
      const r = refs.current
      r.onBeforeDispatch?.(r.state, action)

      const { state: newState, effects } = r.reducer(r.state, action, Date.now())
      r.state = newState
      setState(newState)

      for (const effect of effects) {
        switch (effect.type) {
          case 'scheduleAdvance':
            if (r.timer) clearTimeout(r.timer)
            r.timer = setTimeout(() => {
              r.timer = null
              fn({ type: 'advance' } as A)
            }, effect.delayMs)
            break
          case 'cancelAdvance':
            if (r.timer) {
              clearTimeout(r.timer)
              r.timer = null
            }
            break
        }
      }
    }
    return fn
  })

  return [state, dispatch]
}
