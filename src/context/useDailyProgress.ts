import { createContext, useContext } from 'react'
import type { ExerciseType } from '../types'

export interface DailyProgressValue {
  dailyCounts: Record<ExerciseType, number>
  incrementCount: (type: ExerciseType) => void
  resetCount: (type: ExerciseType) => void
  goalReached: (type: ExerciseType) => boolean
  justReachedGoal: boolean
  dismissGoalCelebration: () => void
}

export const DailyProgressContext = createContext<DailyProgressValue | null>(null)

export function useDailyProgress() {
  const ctx = useContext(DailyProgressContext)
  if (!ctx) throw new Error('useDailyProgress must be used within DailyProgressProvider')
  return ctx
}
