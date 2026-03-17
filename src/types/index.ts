export type OperationType = 'addition' | 'subtraction'

export type ExerciseType = 'column-arithmetic'

export interface ExerciseTypeInfo {
  type: ExerciseType
  name: string
  description: string
  icon: string
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

export interface ProblemResult {
  operation: OperationType
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
