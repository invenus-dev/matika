import type { ReducerResult } from '../types'
import type { ColumnArithmeticState, ColumnArithmeticAction } from './types'
import type { AnswerDigit } from '../../types'
import { generateColumnProblem } from '../../utils/math'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

const MAX_FIXES_PER_PROBLEM = 2

export function createInitialState(now: number): ColumnArithmeticState {
  return {
    problem: generateColumnProblem(),
    activePosition: 0,
    completed: false,
    feedback: null,
    remainingFixes: MAX_FIXES_PER_PROBLEM,
    startTime: now,
    pendingResult: null,
  }
}

export function getComputedProps(state: ColumnArithmeticState) {
  const { problem, completed, remainingFixes } = state
  const errorCount = problem.answerDigits.filter((d) => d.status === 'incorrect').length
  const hasError = errorCount > 0
  const allFilled = problem.answerDigits.every((d) => d.status !== 'empty')
  const canFix = hasError && remainingFixes > 0 && errorCount <= remainingFixes
  const waitingForFix = allFilled && hasError && !completed && errorCount <= remainingFixes
  return { errorCount, hasError, allFilled, canFix, waitingForFix }
}

export function reduce(
  state: ColumnArithmeticState,
  action: ColumnArithmeticAction,
  now: number,
): ReducerResult<ColumnArithmeticState> {
  switch (action.type) {
    case 'enterDigit':
      return handleEnterDigit(state, action.digit, now)
    case 'fixError':
      return handleFixError(state)
    case 'advance':
      return handleAdvance(now)
  }
}

function handleEnterDigit(
  state: ColumnArithmeticState,
  digit: number,
  now: number,
): ReducerResult<ColumnArithmeticState> {
  const { completed, remainingFixes, problem, activePosition, startTime } = state
  const { waitingForFix } = getComputedProps(state)

  if (completed || waitingForFix) {
    return { state, effects: [] }
  }

  const newDigits: AnswerDigit[] = [...problem.answerDigits]
  const current = newDigits[activePosition]
  const isCorrect = digit === current.expected

  newDigits[activePosition] = {
    ...current,
    entered: digit,
    status: isCorrect ? 'correct' : 'incorrect',
  }

  const updatedProblem = { ...problem, answerDigits: newDigits }
  const nextPos = activePosition + 1
  const errCount = newDigits.filter((d) => d.status === 'incorrect').length
  const totalDigits = newDigits.length

  // Too many errors to fix — fail immediately
  if (errCount > remainingFixes) {
    const correctDigits = newDigits.filter((d) => d.status === 'correct').length
    const timeMs = now - startTime
    return {
      state: {
        ...state,
        problem: updatedProblem,
        completed: true,
        feedback: 'incorrect',
        pendingResult: {
          operation: problem.operation,
          correct: false,
          totalDigits,
          correctDigits,
          timeMs,
        },
      },
      effects: [{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }],
    }
  }

  // All digits filled
  if (nextPos >= totalDigits) {
    const correctDigits = newDigits.filter((d) => d.status === 'correct').length
    const allCorrect = correctDigits === totalDigits

    if (!allCorrect && remainingFixes > 0 && errCount <= remainingFixes) {
      // Errors exist but can still be fixed — wait for fix
      return {
        state: { ...state, problem: updatedProblem, activePosition: nextPos },
        effects: [],
      }
    }

    const timeMs = now - startTime
    return {
      state: {
        ...state,
        problem: updatedProblem,
        activePosition: nextPos,
        completed: true,
        feedback: allCorrect ? 'correct' : 'incorrect',
        pendingResult: {
          operation: problem.operation,
          correct: allCorrect,
          totalDigits,
          correctDigits,
          timeMs,
        },
      },
      effects: [{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }],
    }
  }

  // Normal: move to next position
  return {
    state: { ...state, problem: updatedProblem, activePosition: nextPos },
    effects: [],
  }
}

function handleFixError(state: ColumnArithmeticState): ReducerResult<ColumnArithmeticState> {
  const { canFix } = getComputedProps(state)
  if (!canFix) return { state, effects: [] }

  const { problem, remainingFixes } = state

  // Find the last incorrect digit
  let fixIdx = -1
  for (let i = problem.answerDigits.length - 1; i >= 0; i--) {
    if (problem.answerDigits[i].status === 'incorrect') {
      fixIdx = i
      break
    }
  }
  if (fixIdx === -1) return { state, effects: [] }

  const newDigits = [...problem.answerDigits]
  newDigits[fixIdx] = { ...newDigits[fixIdx], entered: null, status: 'empty' }
  // Also reset any digits after the fixed one
  for (let i = fixIdx + 1; i < newDigits.length; i++) {
    if (newDigits[i].status !== 'empty') {
      newDigits[i] = { ...newDigits[i], entered: null, status: 'empty' }
    }
  }

  return {
    state: {
      ...state,
      problem: { ...problem, answerDigits: newDigits },
      activePosition: fixIdx,
      completed: false,
      remainingFixes: remainingFixes - 1,
    },
    effects: [{ type: 'cancelAdvance' }],
  }
}

function handleAdvance(now: number): ReducerResult<ColumnArithmeticState> {
  return {
    state: createInitialState(now),
    effects: [],
  }
}
