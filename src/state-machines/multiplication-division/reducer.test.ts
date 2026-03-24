import { describe, it, expect } from 'vitest'
import { reduce, createInitialState } from './reducer'
import type { MultiplicationDivisionState } from './types'
import type { MultiplicationDivisionProblem } from '../../types'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

function makeProblem(overrides: Partial<MultiplicationDivisionProblem> = {}): MultiplicationDivisionProblem {
  return {
    operation: '×',
    operandA: 7,
    operandB: 8,
    correctAnswer: 56,
    ...overrides,
  }
}

function makeState(overrides: Partial<MultiplicationDivisionState> = {}): MultiplicationDivisionState {
  return {
    problem: makeProblem(),
    userInput: '',
    feedback: null,
    hasBeenWrong: false,
    completed: false,
    startTime: 1000,
    pendingResult: null,
    ...overrides,
  }
}

describe('createInitialState', () => {
  it('returns a fresh state', () => {
    const state = createInitialState(5000)
    expect(state.userInput).toBe('')
    expect(state.feedback).toBeNull()
    expect(state.hasBeenWrong).toBe(false)
    expect(state.completed).toBe(false)
    expect(state.startTime).toBe(5000)
    expect(state.pendingResult).toBeNull()
  })
})

describe('reduce — enterDigit', () => {
  it('appends digit to userInput', () => {
    const state = makeState()
    const { state: next } = reduce(state, { type: 'enterDigit', digit: 5 }, 2000)
    expect(next.userInput).toBe('5')
  })

  it('allows up to 2 digits', () => {
    const state = makeState({ userInput: '5' })
    const { state: next } = reduce(state, { type: 'enterDigit', digit: 6 }, 2000)
    expect(next.userInput).toBe('56')
  })

  it('rejects third digit', () => {
    const state = makeState({ userInput: '56' })
    const { state: next } = reduce(state, { type: 'enterDigit', digit: 1 }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when completed', () => {
    const state = makeState({ completed: true })
    const { state: next } = reduce(state, { type: 'enterDigit', digit: 5 }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when feedback is incorrect (locked during error display)', () => {
    const state = makeState({ feedback: 'incorrect', hasBeenWrong: true, userInput: '42' })
    const { state: next } = reduce(state, { type: 'enterDigit', digit: 5 }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — deleteDigit', () => {
  it('removes last digit', () => {
    const state = makeState({ userInput: '56' })
    const { state: next } = reduce(state, { type: 'deleteDigit' }, 2000)
    expect(next.userInput).toBe('5')
  })

  it('ignores when empty', () => {
    const state = makeState({ userInput: '' })
    const { state: next } = reduce(state, { type: 'deleteDigit' }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when completed', () => {
    const state = makeState({ completed: true, userInput: '5' })
    const { state: next } = reduce(state, { type: 'deleteDigit' }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — confirm', () => {
  it('correct answer → completed + scheduleAdvance', () => {
    const state = makeState({ userInput: '56' })
    const { state: next, effects } = reduce(state, { type: 'confirm' }, 4000)

    expect(next.completed).toBe(true)
    expect(next.feedback).toBe('correct')
    expect(next.pendingResult).toEqual({
      correct: true,
      totalDigits: 1,
      correctDigits: 1,
      timeMs: 3000,
    })
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('first wrong → feedback incorrect, input kept, schedules retry', () => {
    const state = makeState({ userInput: '42' })
    const { state: next, effects } = reduce(state, { type: 'confirm' }, 4000)

    expect(next.completed).toBe(false)
    expect(next.feedback).toBe('incorrect')
    expect(next.hasBeenWrong).toBe(true)
    expect(next.userInput).toBe('42')
    expect(next.pendingResult).toBeNull()
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('second wrong → completed + fail', () => {
    const state = makeState({ userInput: '42', hasBeenWrong: true })
    const { state: next, effects } = reduce(state, { type: 'confirm' }, 4000)

    expect(next.completed).toBe(true)
    expect(next.feedback).toBe('incorrect')
    expect(next.pendingResult!.correct).toBe(false)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('ignores when already completed', () => {
    const state = makeState({ completed: true, userInput: '56' })
    const { state: next } = reduce(state, { type: 'confirm' }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when input is empty', () => {
    const state = makeState({ userInput: '' })
    const { state: next } = reduce(state, { type: 'confirm' }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — advance', () => {
  it('resets to a fresh state when completed', () => {
    const state = makeState({ completed: true, feedback: 'correct' })
    const { state: next, effects } = reduce(state, { type: 'advance' }, 9000)

    expect(next.completed).toBe(false)
    expect(next.feedback).toBeNull()
    expect(next.hasBeenWrong).toBe(false)
    expect(next.userInput).toBe('')
    expect(next.startTime).toBe(9000)
    expect(next.pendingResult).toBeNull()
    expect(effects).toEqual([])
  })

  it('transitions to retry mode when not completed (first wrong → advance)', () => {
    const state = makeState({ feedback: 'incorrect', hasBeenWrong: true, userInput: '42' })
    const { state: next, effects } = reduce(state, { type: 'advance' }, 3500)

    expect(next.completed).toBe(false)
    expect(next.feedback).toBeNull()
    expect(next.userInput).toBe('')
    expect(next.hasBeenWrong).toBe(true)
    expect(next.problem).toBe(state.problem) // same problem
    expect(effects).toEqual([])
  })
})

describe('full flow: wrong → error display → retry → correct', () => {
  it('works', () => {
    const state = makeState({ userInput: '42' })

    // Confirm wrong — shows error, keeps input
    let current = reduce(state, { type: 'confirm' }, 2000).state
    expect(current.feedback).toBe('incorrect')
    expect(current.hasBeenWrong).toBe(true)
    expect(current.userInput).toBe('42')

    // Input locked during error display
    expect(reduce(current, { type: 'enterDigit', digit: 1 }, 2500).state).toBe(current)

    // After 1.5s, advance transitions to retry mode
    current = reduce(current, { type: 'advance' }, 3500).state
    expect(current.feedback).toBeNull()
    expect(current.userInput).toBe('')

    // Type correct answer
    current = reduce(current, { type: 'enterDigit', digit: 5 }, 4000).state
    current = reduce(current, { type: 'enterDigit', digit: 6 }, 4500).state

    // Confirm correct
    const { state: final, effects } = reduce(current, { type: 'confirm' }, 5000)
    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('correct')
    expect(final.pendingResult!.correct).toBe(true)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })
})

describe('full flow: wrong → error display → retry → wrong again → fail', () => {
  it('works', () => {
    const state = makeState({ userInput: '42' })

    // First wrong
    let current = reduce(state, { type: 'confirm' }, 2000).state

    // Advance to retry mode
    current = reduce(current, { type: 'advance' }, 3500).state

    // Type still wrong
    current = reduce(current, { type: 'enterDigit', digit: 9 }, 4000).state
    current = reduce(current, { type: 'enterDigit', digit: 9 }, 4500).state

    const { state: final, effects } = reduce(current, { type: 'confirm' }, 5000)
    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('incorrect')
    expect(final.pendingResult!.correct).toBe(false)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })
})

describe('time tracking', () => {
  it('pendingResult.timeMs = now - startTime', () => {
    const state = makeState({ userInput: '56', startTime: 1000 })
    const { state: final } = reduce(state, { type: 'confirm' }, 5500)
    expect(final.pendingResult!.timeMs).toBe(4500)
  })
})

describe('division problems', () => {
  it('handles division correctly', () => {
    const state = makeState({
      problem: makeProblem({ operation: '÷', operandA: 56, operandB: 7, correctAnswer: 8 }),
      userInput: '8',
    })
    const { state: next } = reduce(state, { type: 'confirm' }, 4000)
    expect(next.completed).toBe(true)
    expect(next.feedback).toBe('correct')
  })
})
