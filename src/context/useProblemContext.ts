import { createContext, useContext } from 'react'
import type { ExerciseType, ProblemResult, SessionStats } from '../types'

export interface ProblemContextValue {
  getStats: (type: ExerciseType) => SessionStats
  recordResult: (type: ExerciseType, result: ProblemResult) => void
  resetStats: (type: ExerciseType) => void
}

export const ProblemContext = createContext<ProblemContextValue | null>(null)

export function useProblemContext() {
  const ctx = useContext(ProblemContext)
  if (!ctx) throw new Error('useProblemContext must be used within ProblemProvider')
  return ctx
}
