import type { Icon } from '@phosphor-icons/react'

export type OperationType = 'addition' | 'subtraction'

export type ExerciseType = 'column-arithmetic' | 'unit-conversion' | 'multiplication-division'

export interface ExerciseTypeInfo {
  type: ExerciseType
  name: string
  description: string
  icon: Icon
  dailyGoal: number
}

export type MultiplicationDivisionOperation = '×' | '÷'

export interface MultiplicationDivisionProblem {
  operation: MultiplicationDivisionOperation
  operandA: number
  operandB: number
  correctAnswer: number
}

export type DigitStatus = 'empty' | 'correct' | 'incorrect'

export interface AnswerDigit {
  expected: number
  entered: number | null
  status: DigitStatus
}

export interface ColumnProblem {
  operation: OperationType
  operandA: number
  operandB: number
  result: number
  answerDigits: AnswerDigit[]
}

export interface UnitConversionProblem {
  family: 'length' | 'volume' | 'mass'
  sourceValue: number
  sourceUnit: string
  targetUnit: string
  expectedAnswer: number
}

export interface ProblemResult {
  operation?: OperationType
  correct: boolean
  totalDigits: number
  correctDigits: number
  timeMs: number
}

export interface SessionStats {
  totalProblems: number
  correctProblems: number
  totalDigits: number
  correctDigits: number
  elapsedMs: number
}
