import type { ExerciseType } from '../../types'
import { EXERCISE_TYPES, DAILY_GOAL } from '../../utils/constants'
import { Logo } from '../common/Logo'

interface HomepageProps {
  dailyCounts: Record<ExerciseType, number>
  onSelectExercise: (type: ExerciseType) => void
}

export function Homepage({ dailyCounts, onSelectExercise }: HomepageProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <Logo size={80} className="mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Co budeme procvičovat?
      </h2>
      <div className="grid gap-4 w-full max-w-sm">
        {EXERCISE_TYPES.map((ex) => {
          const count = dailyCounts[ex.type] ?? 0
          const done = count >= DAILY_GOAL
          return (
            <button
              key={ex.type}
              onPointerDown={(e) => {
                e.preventDefault()
                onSelectExercise(ex.type)
              }}
              className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow text-left touch-manipulation"
            >
              <ex.icon size={40} weight="duotone" color="#3b82f6" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800">{ex.name}</div>
                <div className="text-sm text-gray-500">{ex.description}</div>
              </div>
              <span
                className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                  done
                    ? 'bg-correct-light text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}/{DAILY_GOAL}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
