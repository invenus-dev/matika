import type { ExerciseType } from '../../types'
import { EXERCISE_TYPES, DAILY_GOAL } from '../../utils/constants'

interface HeaderProps {
  activeExerciseType: ExerciseType | null
  dailyCount: number
  onNavigateHome: () => void
  onShowStats: () => void
  statsDisabled: boolean
}

export function Header({
  activeExerciseType,
  dailyCount,
  onNavigateHome,
  onShowStats,
  statsDisabled,
}: HeaderProps) {
  const exerciseInfo = activeExerciseType
    ? EXERCISE_TYPES.find((e) => e.type === activeExerciseType)
    : null

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      {exerciseInfo ? (
        <button
          onPointerDown={(e) => {
            e.preventDefault()
            onNavigateHome()
          }}
          className="text-sm md:text-lg font-semibold text-primary hover:text-primary-dark transition-colors touch-manipulation"
        >
          ← {exerciseInfo.name}
        </button>
      ) : (
        <h1 className="text-lg font-semibold text-gray-800">Matika</h1>
      )}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">
          {dailyCount}/{DAILY_GOAL}
        </span>
        {activeExerciseType && (
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              onShowStats()
            }}
            disabled={statsDisabled}
            className="text-xl disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
            title="Vyhodnotit"
          >
            📊
          </button>
        )}
      </div>
    </header>
  )
}
