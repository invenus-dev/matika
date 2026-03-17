import { DAILY_GOAL } from '../../utils/constants'

interface GoalCelebrationProps {
  dailyTotal: number
  onContinue: () => void
  onGoHome: () => void
}

export function GoalCelebration({ dailyTotal, onContinue, onGoHome }: GoalCelebrationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-6xl animate-celebrate mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Denní cíl splněn!
        </h2>
        <p className="text-gray-600 mb-6">
          Dnes máš už {dailyTotal} z {DAILY_GOAL} správně!
        </p>
        <div className="flex gap-3">
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              onGoHome()
            }}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors touch-manipulation"
          >
            Zpět na výběr
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              onContinue()
            }}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors touch-manipulation"
          >
            Pokračovat
          </button>
        </div>
      </div>
    </div>
  )
}
