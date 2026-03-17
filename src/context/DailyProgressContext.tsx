import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ExerciseType } from '../types'
import { DAILY_GOAL } from '../utils/constants'
import { loadDailyCounts, incrementDailyCount, resetDailyCount } from '../utils/storage'

interface DailyProgressValue {
  dailyCounts: Record<ExerciseType, number>
  incrementCount: (type: ExerciseType) => void
  resetCount: (type: ExerciseType) => void
  goalReached: (type: ExerciseType) => boolean
  justReachedGoal: boolean
  dismissGoalCelebration: () => void
}

const DailyProgressContext = createContext<DailyProgressValue | null>(null)

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const [dailyCounts, setDailyCounts] = useState(loadDailyCounts)
  const [justReachedGoal, setJustReachedGoal] = useState(false)

  const incrementCount = useCallback((type: ExerciseType) => {
    const newCount = incrementDailyCount(type)
    setDailyCounts((prev) => ({ ...prev, [type]: newCount }))
    if (newCount === DAILY_GOAL) {
      setJustReachedGoal(true)
    }
  }, [])

  const goalReached = useCallback(
    (type: ExerciseType) => dailyCounts[type] >= DAILY_GOAL,
    [dailyCounts],
  )

  const resetCount = useCallback((type: ExerciseType) => {
    resetDailyCount(type)
    setDailyCounts((prev) => ({ ...prev, [type]: 0 }))
  }, [])

  const dismissGoalCelebration = useCallback(() => setJustReachedGoal(false), [])

  return (
    <DailyProgressContext.Provider
      value={{ dailyCounts, incrementCount, resetCount, goalReached, justReachedGoal, dismissGoalCelebration }}
    >
      {children}
    </DailyProgressContext.Provider>
  )
}

export function useDailyProgress() {
  const ctx = useContext(DailyProgressContext)
  if (!ctx) throw new Error('useDailyProgress must be used within DailyProgressProvider')
  return ctx
}
