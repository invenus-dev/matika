import { useCallback } from 'react'
import type { ProblemResult } from '../../../types'
import { useExerciseMachine } from '../../../hooks/useExerciseMachine'
import { reduce, createInitialState, getComputedProps } from '../../../state-machines/column-arithmetic/reducer'
import type { ColumnArithmeticState, ColumnArithmeticAction } from '../../../state-machines/column-arithmetic/types'

const initState = () => createInitialState(Date.now())

export function useColumnProblem(
  onResult: (result: ProblemResult) => void,
) {
  const onBeforeDispatch = useCallback(
    (state: ColumnArithmeticState, action: ColumnArithmeticAction) => {
      if (action.type === 'advance' && state.pendingResult) {
        onResult(state.pendingResult)
      }
    },
    [onResult],
  )

  const [state, dispatch] = useExerciseMachine(reduce, initState, onBeforeDispatch)

  const { canFix, waitingForFix } = getComputedProps(state)

  const enterDigit = useCallback(
    (digit: number) => dispatch({ type: 'enterDigit', digit }),
    [dispatch],
  )

  const fixError = useCallback(
    () => dispatch({ type: 'fixError' }),
    [dispatch],
  )

  return {
    problem: state.problem,
    activePosition: state.activePosition,
    completed: state.completed,
    waitingForFix,
    feedback: state.feedback,
    enterDigit,
    canFix,
    remainingFixes: state.remainingFixes,
    fixError,
  }
}
