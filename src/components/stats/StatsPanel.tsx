import { useState } from 'react'
import type { ExerciseType } from '../../types'
import { useProblemContext } from '../../context/ProblemContext'
import { useDailyProgress } from '../../context/DailyProgressContext'
import { getDailyGoal } from '../../utils/constants'

interface StatsPanelProps {
  exerciseType: ExerciseType
  onClose: () => void
  onReset: () => void
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          backgroundColor: pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444',
        }}
      />
    </div>
  )
}

export function StatsPanel({ exerciseType, onClose, onReset }: StatsPanelProps) {
  const { getStats, resetStats } = useProblemContext()
  const { dailyCounts, resetCount } = useDailyProgress()
  const [confirming, setConfirming] = useState(false)

  const stats = getStats(exerciseType)
  const dailyCount = dailyCounts[exerciseType] ?? 0

  const elapsed = stats.elapsedMs
  const problemPct = stats.totalProblems === 0
    ? 0
    : Math.round((stats.correctProblems / stats.totalProblems) * 100)

  const handleReset = () => {
    resetStats(exerciseType)
    resetCount(exerciseType)
    onReset()
  }

  if (confirming) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Začít znovu?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Vymaže se dnešní stav — statistiky i denní cíl.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Zpět
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-incorrect text-white hover:bg-red-600 transition-colors"
            >
              Vymazat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Výsledky
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Příklady správně</span>
              <span className="font-medium">
                {stats.correctProblems}/{stats.totalProblems} ({problemPct}%)
              </span>
            </div>
            <ProgressBar value={stats.correctProblems} max={stats.totalProblems} />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Denní cíl</span>
              <span className="font-medium">
                {dailyCount}/{getDailyGoal(exerciseType)}
              </span>
            </div>
            <ProgressBar value={dailyCount} max={getDailyGoal(exerciseType)} />
          </div>

          <div className="text-sm text-gray-600">
            Čas: <span className="font-medium">{formatDuration(elapsed)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Pokračovat
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Začít znovu
          </button>
        </div>
      </div>
    </div>
  )
}
