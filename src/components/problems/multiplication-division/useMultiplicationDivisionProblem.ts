import { useCallback } from 'react'
import type { ProblemResult } from '../../../types'
import { useExerciseMachine } from '../../../hooks/useExerciseMachine'
import { reduce, createInitialState } from '../../../state-machines/multiplication-division/reducer'
import type { MultiplicationDivisionState, MultiplicationDivisionAction } from '../../../state-machines/multiplication-division/types'

const initState = () => createInitialState(Date.now())

export function useMultiplicationDivisionProblem(
  onResult: (result: ProblemResult) => void,
) {
  const onBeforeDispatch = useCallback(
    (state: MultiplicationDivisionState, action: MultiplicationDivisionAction) => {
      if (action.type === 'advance' && state.pendingResult) {
        onResult(state.pendingResult)
      }
    },
    [onResult],
  )

  const [state, dispatch] = useExerciseMachine(reduce, initState, onBeforeDispatch)

  const enterDigit = useCallback((digit: number) => dispatch({ type: 'enterDigit', digit }), [dispatch])
  const deleteDigit = useCallback(() => dispatch({ type: 'deleteDigit' }), [dispatch])
  const confirm = useCallback(() => dispatch({ type: 'confirm' }), [dispatch])

  return {
    problem: state.problem,
    userInput: state.userInput,
    completed: state.completed,
    feedback: state.feedback,
    hasBeenWrong: state.hasBeenWrong,
    enterDigit,
    deleteDigit,
    confirm,
  }
}
