import { describe, it, expect } from 'vitest'
import { reduce, createInitialState, canDivide } from './reducer'
import type { UnitConversionState } from './types'
import type { UnitConversionProblem } from '../../types'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

function makeProblem(overrides: Partial<UnitConversionProblem> = {}): UnitConversionProblem {
  return {
    family: 'length',
    sourceValue: 5,
    sourceUnit: 'km',
    targetUnit: 'm',
    expectedAnswer: 5000,
    ...overrides,
  }
}

function makeState(overrides: Partial<UnitConversionState> = {}): UnitConversionState {
  return {
    problem: makeProblem(),
    userAnswer: 5,
    feedback: null,
    hasBeenWrong: false,
    completed: false,
    startTime: 1000,
    pendingResult: null,
    ...overrides,
  }
}

describe('createInitialState', () => {
  it('returns a fresh state with userAnswer = sourceValue', () => {
    const state = createInitialState(5000)
    expect(state.userAnswer).toBe(state.problem.sourceValue)
    expect(state.feedback).toBeNull()
    expect(state.hasBeenWrong).toBe(false)
    expect(state.completed).toBe(false)
    expect(state.startTime).toBe(5000)
    expect(state.pendingResult).toBeNull()
  })
})

describe('canDivide', () => {
  it('true when divisible by 10', () => {
    expect(canDivide(100)).toBe(true)
    expect(canDivide(50)).toBe(true)
    expect(canDivide(10)).toBe(true)
  })

  it('false when not divisible by 10', () => {
    expect(canDivide(5)).toBe(false)
    expect(canDivide(13)).toBe(false)
  })

  it('false when 0', () => {
    expect(canDivide(0)).toBe(false)
  })
})

describe('reduce — multiplyByTen', () => {
  it('multiplies userAnswer by 10', () => {
    const state = makeState({ userAnswer: 5 })
    const { state: next } = reduce(state, { type: 'multiplyByTen' }, 2000)
    expect(next.userAnswer).toBe(50)
  })

  it('caps at 99999', () => {
    const state = makeState({ userAnswer: 10000 })
    const { state: next } = reduce(state, { type: 'multiplyByTen' }, 2000)
    expect(next.userAnswer).toBe(10000)
  })

  it('clears incorrect feedback on adjust', () => {
    const state = makeState({ userAnswer: 50, feedback: 'incorrect', hasBeenWrong: true })
    const { state: next } = reduce(state, { type: 'multiplyByTen' }, 2000)
    expect(next.userAnswer).toBe(500)
    expect(next.feedback).toBeNull()
  })

  it('ignores when completed', () => {
    const state = makeState({ completed: true, userAnswer: 5 })
    const { state: next } = reduce(state, { type: 'multiplyByTen' }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — divideByTen', () => {
  it('divides userAnswer by 10 when divisible', () => {
    const state = makeState({ userAnswer: 500 })
    const { state: next } = reduce(state, { type: 'divideByTen' }, 2000)
    expect(next.userAnswer).toBe(50)
  })

  it('clears incorrect feedback on adjust', () => {
    const state = makeState({ userAnswer: 500, feedback: 'incorrect', hasBeenWrong: true })
    const { state: next } = reduce(state, { type: 'divideByTen' }, 2000)
    expect(next.userAnswer).toBe(50)
    expect(next.feedback).toBeNull()
  })

  it('ignores when not divisible by 10', () => {
    const state = makeState({ userAnswer: 5 })
    const { state: next } = reduce(state, { type: 'divideByTen' }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when userAnswer is 0', () => {
    const state = makeState({ userAnswer: 0 })
    const { state: next } = reduce(state, { type: 'divideByTen' }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — confirm', () => {
  it('correct answer → completed + scheduleAdvance', () => {
    const state = makeState({ userAnswer: 5000 })
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

  it('first wrong → feedback incorrect, not completed', () => {
    const state = makeState({ userAnswer: 50 })
    const { state: next, effects } = reduce(state, { type: 'confirm' }, 4000)

    expect(next.completed).toBe(false)
    expect(next.feedback).toBe('incorrect')
    expect(next.hasBeenWrong).toBe(true)
    expect(next.pendingResult).toBeNull()
    expect(effects).toEqual([])
  })

  it('second wrong → completed + fail', () => {
    const state = makeState({ userAnswer: 50, hasBeenWrong: true })
    const { state: next, effects } = reduce(state, { type: 'confirm' }, 4000)

    expect(next.completed).toBe(true)
    expect(next.feedback).toBe('incorrect')
    expect(next.pendingResult!.correct).toBe(false)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('ignores when already completed', () => {
    const state = makeState({ completed: true })
    const { state: next } = reduce(state, { type: 'confirm' }, 2000)
    expect(next).toBe(state)
  })

  it('ignores when feedback is incorrect (must adjust first)', () => {
    const state = makeState({ feedback: 'incorrect', hasBeenWrong: true })
    const { state: next } = reduce(state, { type: 'confirm' }, 2000)
    expect(next).toBe(state)
  })
})

describe('reduce — advance', () => {
  it('resets to a fresh state', () => {
    const state = makeState({ completed: true, feedback: 'correct' })
    const { state: next, effects } = reduce(state, { type: 'advance' }, 9000)

    expect(next.completed).toBe(false)
    expect(next.feedback).toBeNull()
    expect(next.hasBeenWrong).toBe(false)
    expect(next.startTime).toBe(9000)
    expect(next.pendingResult).toBeNull()
    expect(next.userAnswer).toBe(next.problem.sourceValue)
    expect(effects).toEqual([])
  })
})

describe('full flow: wrong → adjust → correct', () => {
  it('works', () => {
    const state = makeState({ userAnswer: 50 })

    // Confirm wrong
    let current = reduce(state, { type: 'confirm' }, 2000).state
    expect(current.feedback).toBe('incorrect')
    expect(current.hasBeenWrong).toBe(true)

    // Adjust — clears feedback
    current = reduce(current, { type: 'multiplyByTen' }, 3000).state // 500
    expect(current.feedback).toBeNull()
    current = reduce(current, { type: 'multiplyByTen' }, 4000).state // 5000

    // Confirm correct
    const { state: final, effects } = reduce(current, { type: 'confirm' }, 5000)
    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('correct')
    expect(final.pendingResult!.correct).toBe(true)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })
})

describe('full flow: wrong → adjust → wrong again → fail', () => {
  it('works', () => {
    const state = makeState({ userAnswer: 50 })

    // First wrong
    let current = reduce(state, { type: 'confirm' }, 2000).state

    // Adjust but still wrong
    current = reduce(current, { type: 'multiplyByTen' }, 3000).state // 500
    const { state: final, effects } = reduce(current, { type: 'confirm' }, 4000)

    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('incorrect')
    expect(final.pendingResult!.correct).toBe(false)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })
})

describe('time tracking', () => {
  it('pendingResult.timeMs = now - startTime', () => {
    const state = makeState({ userAnswer: 5000, startTime: 1000 })
    const { state: final } = reduce(state, { type: 'confirm' }, 5500)
    expect(final.pendingResult!.timeMs).toBe(4500)
  })
})
