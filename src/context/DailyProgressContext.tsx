import { useState, useCallback, type ReactNode } from 'react'
import type { ExerciseType } from '../types'
import { getDailyGoal } from '../utils/constants'
import { loadDailyCounts, incrementDailyCount, resetDailyCount } from '../utils/storage'
import { DailyProgressContext } from './useDailyProgress'

export { DailyProgressContext }

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const [dailyCounts, setDailyCounts] = useState(loadDailyCounts)
  const [justReachedGoal, setJustReachedGoal] = useState(false)

  const incrementCount = useCallback((type: ExerciseType) => {
    const newCount = incrementDailyCount(type)
    setDailyCounts((prev) => ({ ...prev, [type]: newCount }))
    if (newCount === getDailyGoal(type)) {
      setJustReachedGoal(true)
    }
  }, [])

  const goalReached = useCallback(
    (type: ExerciseType) => dailyCounts[type] >= getDailyGoal(type),
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
