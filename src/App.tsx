import { useState } from 'react'
import { ProblemProvider } from './context/ProblemContext'
import { Header } from './components/layout/Header'
import { ProblemArea } from './components/problems/ProblemArea'
import { StatsPanel } from './components/stats/StatsPanel'

function App() {
  const [showStats, setShowStats] = useState(false)

  return (
    <ProblemProvider>
      <div className="h-full flex flex-col bg-surface">
        <Header onShowStats={() => setShowStats(true)} />
        <main className="flex-1 overflow-hidden">
          <ProblemArea />
        </main>
        {showStats && (
          <StatsPanel
            onClose={() => setShowStats(false)}
            onReset={() => setShowStats(false)}
          />
        )}
      </div>
    </ProblemProvider>
  )
}

export default App
