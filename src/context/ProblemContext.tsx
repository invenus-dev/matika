import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { ExerciseType, ProblemResult, SessionStats } from '../types'
import { loadDailyStats, saveDailyStats, clearDailyStats } from '../utils/storage'

type StatsMap = Partial<Record<ExerciseType, SessionStats>>

type Action =
  | { type: 'RECORD_RESULT'; exerciseType: ExerciseType; result: ProblemResult }
  | { type: 'RESET_STATS'; exerciseType: ExerciseType }

const emptyStats: SessionStats = {
  totalProblems: 0,
  correctProblems: 0,
  totalDigits: 0,
  correctDigits: 0,
  elapsedMs: 0,
}

function getOrLoad(state: StatsMap, type: ExerciseType): SessionStats {
  return state[type] ?? loadDailyStats(type) ?? emptyStats
}

function reducer(state: StatsMap, action: Action): StatsMap {
  switch (action.type) {
    case 'RECORD_RESULT': {
      const prev = getOrLoad(state, action.exerciseType)
      const updated: SessionStats = {
        totalProblems: prev.totalProblems + 1,
        correctProblems: prev.correctProblems + (action.result.correct ? 1 : 0),
        totalDigits: prev.totalDigits + action.result.totalDigits,
        correctDigits: prev.correctDigits + action.result.correctDigits,
        elapsedMs: prev.elapsedMs + action.result.timeMs,
      }
      saveDailyStats(action.exerciseType, updated)
      return { ...state, [action.exerciseType]: updated }
    }
    case 'RESET_STATS': {
      clearDailyStats(action.exerciseType)
      return { ...state, [action.exerciseType]: { ...emptyStats } }
    }
  }
}

interface ProblemContextValue {
  getStats: (type: ExerciseType) => SessionStats
  recordResult: (type: ExerciseType, result: ProblemResult) => void
  resetStats: (type: ExerciseType) => void
}

const ProblemContext = createContext<ProblemContextValue | null>(null)

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [statsMap, dispatch] = useReducer(reducer, {})

  const getStats = useCallback(
    (type: ExerciseType) => getOrLoad(statsMap, type),
    [statsMap],
  )

  const recordResult = useCallback(
    (type: ExerciseType, result: ProblemResult) =>
      dispatch({ type: 'RECORD_RESULT', exerciseType: type, result }),
    [],
  )

  const resetStats = useCallback(
    (type: ExerciseType) => dispatch({ type: 'RESET_STATS', exerciseType: type }),
    [],
  )

  return (
    <ProblemContext.Provider value={{ getStats, recordResult, resetStats }}>
      {children}
    </ProblemContext.Provider>
  )
}

export function useProblemContext() {
  const ctx = useContext(ProblemContext)
  if (!ctx) throw new Error('useProblemContext must be used within ProblemProvider')
  return ctx
}
