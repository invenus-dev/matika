import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { ProblemResult, SessionStats } from '../types'

type Action =
  | { type: 'RECORD_RESULT'; result: ProblemResult }
  | { type: 'RESET_STATS' }

function createInitialStats(): SessionStats {
  return {
    totalProblems: 0,
    correctProblems: 0,
    totalDigits: 0,
    correctDigits: 0,
    startTime: Date.now(),
  }
}

function reducer(state: SessionStats, action: Action): SessionStats {
  switch (action.type) {
    case 'RECORD_RESULT':
      return {
        ...state,
        totalProblems: state.totalProblems + 1,
        correctProblems:
          state.correctProblems + (action.result.correct ? 1 : 0),
        totalDigits: state.totalDigits + action.result.totalDigits,
        correctDigits: state.correctDigits + action.result.correctDigits,
      }
    case 'RESET_STATS':
      return createInitialStats()
  }
}

interface ProblemContextValue {
  stats: SessionStats
  recordResult: (result: ProblemResult) => void
  resetStats: () => void
}

const ProblemContext = createContext<ProblemContextValue | null>(null)

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [stats, dispatch] = useReducer(reducer, undefined, createInitialStats)

  const value: ProblemContextValue = {
    stats,
    recordResult: (result) => dispatch({ type: 'RECORD_RESULT', result }),
    resetStats: () => dispatch({ type: 'RESET_STATS' }),
  }

  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  )
}

export function useProblemContext() {
  const ctx = useContext(ProblemContext)
  if (!ctx) throw new Error('useProblemContext must be used within ProblemProvider')
  return ctx
}
