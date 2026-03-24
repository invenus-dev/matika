import type { ReducerResult } from '../types'
import type { MultiplicationDivisionState, MultiplicationDivisionAction } from './types'
import { generateMultiplicationDivisionProblem } from '../../utils/multiplication'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

const MAX_DIGITS = 2

export function createInitialState(now: number): MultiplicationDivisionState {
  return {
    problem: generateMultiplicationDivisionProblem(),
    userInput: '',
    feedback: null,
    hasBeenWrong: false,
    completed: false,
    startTime: now,
    pendingResult: null,
  }
}

export function reduce(
  state: MultiplicationDivisionState,
  action: MultiplicationDivisionAction,
  now: number,
): ReducerResult<MultiplicationDivisionState> {
  switch (action.type) {
    case 'enterDigit':
      return handleEnterDigit(state, action.digit)
    case 'deleteDigit':
      return handleDeleteDigit(state)
    case 'confirm':
      return handleConfirm(state, now)
    case 'advance':
      return handleAdvance(state, now)
  }
}

function isInputLocked(state: MultiplicationDivisionState): boolean {
  return state.completed || state.feedback === 'incorrect'
}

function handleEnterDigit(
  state: MultiplicationDivisionState,
  digit: number,
): ReducerResult<MultiplicationDivisionState> {
  if (isInputLocked(state)) return { state, effects: [] }
  if (state.userInput.length >= MAX_DIGITS) return { state, effects: [] }

  return {
    state: { ...state, userInput: state.userInput + digit, feedback: null },
    effects: [],
  }
}

function handleDeleteDigit(
  state: MultiplicationDivisionState,
): ReducerResult<MultiplicationDivisionState> {
  if (isInputLocked(state)) return { state, effects: [] }
  if (state.userInput.length === 0) return { state, effects: [] }

  return {
    state: { ...state, userInput: state.userInput.slice(0, -1), feedback: null },
    effects: [],
  }
}

function handleConfirm(
  state: MultiplicationDivisionState,
  now: number,
): ReducerResult<MultiplicationDivisionState> {
  if (isInputLocked(state) || state.userInput.length === 0) return { state, effects: [] }

  const userAnswer = parseInt(state.userInput, 10)
  const isCorrect = userAnswer === state.problem.correctAnswer
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

  // First wrong → show error 1.5s, then transition to retry
  return {
    state: { ...state, feedback: 'incorrect', hasBeenWrong: true },
    effects: [{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }],
  }
}

function handleAdvance(state: MultiplicationDivisionState, now: number): ReducerResult<MultiplicationDivisionState> {
  // Not completed yet → transition from error display to retry mode
  if (!state.completed) {
    return {
      state: { ...state, userInput: '', feedback: null },
      effects: [],
    }
  }
  return {
    state: createInitialState(now),
    effects: [],
  }
}
