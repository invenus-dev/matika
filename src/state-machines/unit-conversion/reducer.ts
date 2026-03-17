import type { ReducerResult } from '../types'
import type { UnitConversionState, UnitConversionAction } from './types'
import { generateUnitConversionProblem } from '../../utils/units'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

const MAX_ANSWER = 99999

export function createInitialState(now: number): UnitConversionState {
  const problem = generateUnitConversionProblem()
  return {
    problem,
    userAnswer: problem.sourceValue,
    feedback: null,
    hasBeenWrong: false,
    completed: false,
    startTime: now,
    pendingResult: null,
  }
}

export function canDivide(userAnswer: number): boolean {
  return userAnswer > 0 && userAnswer % 10 === 0
}

export function reduce(
  state: UnitConversionState,
  action: UnitConversionAction,
  now: number,
): ReducerResult<UnitConversionState> {
  switch (action.type) {
    case 'multiplyByTen':
      return handleMultiply(state)
    case 'divideByTen':
      return handleDivide(state)
    case 'confirm':
      return handleConfirm(state, now)
    case 'advance':
      return handleAdvance(now)
  }
}

function handleMultiply(state: UnitConversionState): ReducerResult<UnitConversionState> {
  if (state.completed) return { state, effects: [] }
  const next = state.userAnswer * 10
  if (next > MAX_ANSWER) return { state, effects: [] }
  return {
    state: { ...state, userAnswer: next, feedback: null },
    effects: [],
  }
}

function handleDivide(state: UnitConversionState): ReducerResult<UnitConversionState> {
  if (state.completed) return { state, effects: [] }
  if (!canDivide(state.userAnswer)) return { state, effects: [] }
  return {
    state: { ...state, userAnswer: state.userAnswer / 10, feedback: null },
    effects: [],
  }
}

function handleConfirm(state: UnitConversionState, now: number): ReducerResult<UnitConversionState> {
  if (state.completed || state.feedback === 'incorrect') return { state, effects: [] }

  const isCorrect = state.userAnswer === state.problem.expectedAnswer
  const timeMs = now - state.startTime

  if (isCorrect) {
    return {
      state: {
        ...state,
        completed: true,
        feedback: 'correct',
        pendingResult: { correct: true, totalDigits: 1, correctDigits: 1, timeMs },
      },
      effects: [{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }],
    }
  }

  // Wrong and already been wrong before → fail
  if (state.hasBeenWrong) {
    return {
      state: {
        ...state,
        completed: true,
        feedback: 'incorrect',
        pendingResult: { correct: false, totalDigits: 1, correctDigits: 0, timeMs },
      },
      effects: [{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }],
    }
  }

  // First wrong → mark red, wait for adjustment
  return {
    state: { ...state, feedback: 'incorrect', hasBeenWrong: true },
    effects: [],
  }
}

function handleAdvance(now: number): ReducerResult<UnitConversionState> {
  return {
    state: createInitialState(now),
    effects: [],
  }
}
