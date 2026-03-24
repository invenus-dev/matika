import type { MultiplicationDivisionProblem, ProblemResult } from '../../types'

export interface MultiplicationDivisionState {
  problem: MultiplicationDivisionProblem
  userInput: string
  feedback: 'correct' | 'incorrect' | null
  hasBeenWrong: boolean
  completed: boolean
  startTime: number
  pendingResult: ProblemResult | null
}

export type MultiplicationDivisionAction =
  | { type: 'enterDigit'; digit: number }
  | { type: 'deleteDigit' }
  | { type: 'confirm' }
  | { type: 'advance' }
