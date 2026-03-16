import type { OperationType, ColumnProblem, AnswerDigit } from '../types'
import { OPERAND_A_MIN, OPERAND_A_MAX, OPERAND_B_MIN, OPERAND_B_MAX } from './constants'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function extractDigits(n: number): number[] {
  const digits: number[] = []
  if (n === 0) return [0]
  let remaining = n
  while (remaining > 0) {
    digits.push(remaining % 10)
    remaining = Math.floor(remaining / 10)
  }
  return digits // least significant first
}

export function generateColumnProblem(): ColumnProblem {
  const operation: OperationType = Math.random() < 0.5 ? 'addition' : 'subtraction'
  const operandA = randomInt(OPERAND_A_MIN, OPERAND_A_MAX)
  let operandB = randomInt(OPERAND_B_MIN, OPERAND_B_MAX)

  if (operation === 'subtraction' && operandB > operandA) {
    operandB = randomInt(OPERAND_B_MIN, Math.min(OPERAND_B_MAX, operandA))
  }

  const result = operation === 'addition' ? operandA + operandB : operandA - operandB
  const resultDigits = extractDigits(result)

  const answerDigits: AnswerDigit[] = resultDigits.map((d) => ({
    expected: d,
    entered: null,
    status: 'empty' as const,
  }))

  return { operation, operandA, operandB, result, answerDigits }
}
