import { useProblemContext } from '../../context/ProblemContext'

interface HeaderProps {
  onShowStats: () => void
}

export function Header({ onShowStats }: HeaderProps) {
  const { stats } = useProblemContext()

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <h1 className="text-lg font-semibold text-gray-800">Sčítání a odčítání</h1>
      <button
        onClick={onShowStats}
        disabled={stats.totalProblems === 0}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Vyhodnotit
      </button>
    </header>
  )
}
