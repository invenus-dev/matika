import type { ColumnProblem, ProblemResult } from '../../types'

export interface ColumnArithmeticState {
  problem: ColumnProblem
  activePosition: number
  completed: boolean
  feedback: 'correct' | 'incorrect' | null
  remainingFixes: number
  startTime: number
  pendingResult: ProblemResult | null
}

export type ColumnArithmeticAction =
  | { type: 'enterDigit'; digit: number }
  | { type: 'fixError' }
  | { type: 'advance' }
