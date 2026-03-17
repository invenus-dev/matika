import type { UnitConversionProblem, ProblemResult } from '../../types'

export interface UnitConversionState {
  problem: UnitConversionProblem
  userAnswer: number
  feedback: 'correct' | 'incorrect' | null
  hasBeenWrong: boolean
  completed: boolean
  startTime: number
  pendingResult: ProblemResult | null
}

export type UnitConversionAction =
  | { type: 'multiplyByTen' }
  | { type: 'divideByTen' }
  | { type: 'confirm' }
  | { type: 'advance' }
