import type { MultiplicationDivisionProblem } from '../types'

export function generateMultiplicationDivisionProblem(): MultiplicationDivisionProblem {
  const isMultiplication = Math.random() < 0.5

  // Pick two factors 2-9 with product <= 100
  const a = randomInt(2, 9)
  const maxB = Math.min(9, Math.floor(100 / a))
  const b = randomInt(2, maxB)
  const product = a * b

  if (isMultiplication) {
    return {
      operation: '×',
      operandA: a,
      operandB: b,
      correctAnswer: product,
    }
  }

  return {
    operation: '÷',
    operandA: product,
    operandB: a,
    correctAnswer: b,
  }
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}
