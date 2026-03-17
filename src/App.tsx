import { useState, useCallback } from 'react'
import type { ExerciseType } from './types'
import { DailyProgressProvider, useDailyProgress } from './context/DailyProgressContext'
import { ProblemProvider, useProblemContext } from './context/ProblemContext'
import { Header } from './components/layout/Header'
import { Homepage } from './components/home/Homepage'
import { ProblemArea } from './components/problems/ProblemArea'
import { StatsPanel } from './components/stats/StatsPanel'
import { GoalCelebration } from './components/stats/GoalCelebration'

function AppContent() {
  const [activeView, setActiveView] = useState<'home' | 'exercise'>('home')
  const [activeExerciseType, setActiveExerciseType] = useState<ExerciseType | null>(null)
  const [showStats, setShowStats] = useState(false)

  const { dailyCounts, justReachedGoal, dismissGoalCelebration } = useDailyProgress()
  const { getStats } = useProblemContext()

  const handleSelectExercise = useCallback((type: ExerciseType) => {
    setActiveExerciseType(type)
    setActiveView('exercise')
  }, [])

  const handleNavigateHome = useCallback(() => {
    setActiveView('home')
  }, [])

  const activeDaily = activeExerciseType ? dailyCounts[activeExerciseType] : 0

  const statsDisabled = activeExerciseType
    ? getStats(activeExerciseType).totalProblems === 0
    : true

  return (
    <div className="h-full flex flex-col bg-surface">
      <Header
        activeExerciseType={activeView === 'exercise' ? activeExerciseType : null}
        dailyCount={activeDaily}
        onNavigateHome={handleNavigateHome}
        onShowStats={() => setShowStats(true)}
        statsDisabled={statsDisabled}
      />
      <main className="flex-1 overflow-hidden">
        {activeView === 'home' ? (
          <Homepage
            dailyCounts={dailyCounts}
            onSelectExercise={handleSelectExercise}
          />
        ) : activeExerciseType ? (
          <ProblemArea exerciseType={activeExerciseType} />
        ) : null}
      </main>
      {showStats && activeExerciseType && (
        <StatsPanel
          exerciseType={activeExerciseType}
          onClose={() => setShowStats(false)}
          onReset={() => setShowStats(false)}
        />
      )}
      {justReachedGoal && (
        <GoalCelebration
          dailyTotal={activeDaily}
          onContinue={dismissGoalCelebration}
          onGoHome={() => {
            dismissGoalCelebration()
            handleNavigateHome()
          }}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <DailyProgressProvider>
      <ProblemProvider>
        <AppContent />
      </ProblemProvider>
    </DailyProgressProvider>
  )
}

export default App
