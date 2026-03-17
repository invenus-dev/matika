import { useCallback } from 'react'
import type { ProblemResult } from '../../../types'
import { useExerciseMachine } from '../../../hooks/useExerciseMachine'
import { reduce, createInitialState, canDivide } from '../../../state-machines/unit-conversion/reducer'
import type { UnitConversionState, UnitConversionAction } from '../../../state-machines/unit-conversion/types'

const initState = () => createInitialState(Date.now())

export function useUnitConversionProblem(
  onResult: (result: ProblemResult) => void,
) {
  const onBeforeDispatch = useCallback(
    (state: UnitConversionState, action: UnitConversionAction) => {
      if (action.type === 'advance' && state.pendingResult) {
        onResult(state.pendingResult)
      }
    },
    [onResult],
  )

  const [state, dispatch] = useExerciseMachine(reduce, initState, onBeforeDispatch)

  const multiplyByTen = useCallback(() => dispatch({ type: 'multiplyByTen' }), [dispatch])
  const divideByTen = useCallback(() => dispatch({ type: 'divideByTen' }), [dispatch])
  const confirm = useCallback(() => dispatch({ type: 'confirm' }), [dispatch])

  return {
    problem: state.problem,
    userAnswer: state.userAnswer,
    completed: state.completed,
    feedback: state.feedback,
    canDivide: canDivide(state.userAnswer),
    multiplyByTen,
    divideByTen,
    confirm,
  }
}
