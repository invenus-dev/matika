import { describe, it, expect } from 'vitest'
import { reduce, createInitialState, getComputedProps } from './reducer'
import type { ColumnArithmeticState } from './types'
import type { AnswerDigit, ColumnProblem } from '../../types'
import { AUTO_ADVANCE_DELAY_MS } from '../../utils/constants'

// Helper: build a problem with known digits (LSB-first: index 0 = ones)
function makeProblem(expectedDigits: number[]): ColumnProblem {
  const answerDigits: AnswerDigit[] = expectedDigits.map((d) => ({
    expected: d,
    entered: null,
    status: 'empty' as const,
  }))
  // operandA/operandB don't matter for reducer logic
  return { operation: 'addition', operandA: 100, operandB: 23, result: 123, answerDigits }
}

function makeState(overrides: Partial<ColumnArithmeticState> = {}): ColumnArithmeticState {
  return {
    problem: makeProblem([3, 2, 1]), // 123 → digits [3, 2, 1]
    activePosition: 0,
    completed: false,
    feedback: null,
    remainingFixes: 2,
    startTime: 1000,
    pendingResult: null,
    ...overrides,
  }
}

describe('createInitialState', () => {
  it('returns a fresh state with empty digits', () => {
    const state = createInitialState(5000)
    expect(state.activePosition).toBe(0)
    expect(state.completed).toBe(false)
    expect(state.feedback).toBeNull()
    expect(state.remainingFixes).toBe(2)
    expect(state.startTime).toBe(5000)
    expect(state.pendingResult).toBeNull()
    expect(state.problem.answerDigits.every((d) => d.status === 'empty')).toBe(true)
  })
})

describe('getComputedProps', () => {
  it('all empty → no errors, not waiting', () => {
    const props = getComputedProps(makeState())
    expect(props).toEqual({
      errorCount: 0,
      hasError: false,
      allFilled: false,
      canFix: false,
      waitingForFix: false,
    })
  })

  it('one incorrect, not all filled → canFix true', () => {
    const state = makeState()
    state.problem.answerDigits[0] = { expected: 3, entered: 5, status: 'incorrect' }
    const props = getComputedProps(state)
    expect(props.errorCount).toBe(1)
    expect(props.hasError).toBe(true)
    expect(props.canFix).toBe(true)
    expect(props.waitingForFix).toBe(false) // not all filled
  })

  it('all filled with error → waitingForFix', () => {
    const state = makeState()
    state.problem.answerDigits[0] = { expected: 3, entered: 5, status: 'incorrect' }
    state.problem.answerDigits[1] = { expected: 2, entered: 2, status: 'correct' }
    state.problem.answerDigits[2] = { expected: 1, entered: 1, status: 'correct' }
    const props = getComputedProps(state)
    expect(props.waitingForFix).toBe(true)
  })

  it('completed with error → not waitingForFix', () => {
    const state = makeState({ completed: true })
    state.problem.answerDigits[0] = { expected: 3, entered: 5, status: 'incorrect' }
    state.problem.answerDigits[1] = { expected: 2, entered: 2, status: 'correct' }
    state.problem.answerDigits[2] = { expected: 1, entered: 1, status: 'correct' }
    const props = getComputedProps(state)
    expect(props.waitingForFix).toBe(false)
  })

  it('too many errors → canFix false', () => {
    const state = makeState({ remainingFixes: 1 })
    state.problem.answerDigits[0] = { expected: 3, entered: 5, status: 'incorrect' }
    state.problem.answerDigits[1] = { expected: 2, entered: 9, status: 'incorrect' }
    const props = getComputedProps(state)
    expect(props.canFix).toBe(false)
  })
})

describe('reduce — enterDigit', () => {
  it('correct digit advances position, no effects', () => {
    const state = makeState()
    const { state: next, effects } = reduce(state, { type: 'enterDigit', digit: 3 }, 2000)

    expect(next.activePosition).toBe(1)
    expect(next.problem.answerDigits[0].status).toBe('correct')
    expect(next.problem.answerDigits[0].entered).toBe(3)
    expect(next.completed).toBe(false)
    expect(effects).toEqual([])
  })

  it('incorrect digit advances position, no effects', () => {
    const state = makeState()
    const { state: next, effects } = reduce(state, { type: 'enterDigit', digit: 9 }, 2000)

    expect(next.activePosition).toBe(1)
    expect(next.problem.answerDigits[0].status).toBe('incorrect')
    expect(next.problem.answerDigits[0].entered).toBe(9)
    expect(effects).toEqual([])
  })

  it('all correct → completed + scheduleAdvance + pendingResult', () => {
    const state = makeState()
    // Enter first two correctly
    let current = reduce(state, { type: 'enterDigit', digit: 3 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state
    // Enter last correct digit
    const { state: final, effects } = reduce(current, { type: 'enterDigit', digit: 1 }, 4000)

    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('correct')
    expect(final.pendingResult).toEqual({
      operation: 'addition',
      correct: true,
      totalDigits: 3,
      correctDigits: 3,
      timeMs: 3000, // 4000 - 1000 (startTime)
    })
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('all filled with one fixable error → waitingForFix, no effects', () => {
    const state = makeState()
    // digit 0 wrong, digits 1,2 correct
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state
    const { state: final, effects } = reduce(current, { type: 'enterDigit', digit: 1 }, 4000)

    expect(final.completed).toBe(false)
    expect(final.feedback).toBeNull()
    expect(final.pendingResult).toBeNull()
    expect(getComputedProps(final).waitingForFix).toBe(true)
    expect(effects).toEqual([])
  })

  it('too many errors → immediate fail with scheduleAdvance', () => {
    const state = makeState()
    // 3 errors, only 2 fixes allowed → fail on 3rd
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state  // error 1
    current = reduce(current, { type: 'enterDigit', digit: 9 }, 3000).state    // error 2
    const { state: final, effects } = reduce(current, { type: 'enterDigit', digit: 9 }, 4000) // error 3

    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('incorrect')
    expect(final.pendingResult!.correct).toBe(false)
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })

  it('ignores input when completed', () => {
    const state = makeState({ completed: true })
    const { state: next, effects } = reduce(state, { type: 'enterDigit', digit: 5 }, 2000)
    expect(next).toBe(state) // same reference
    expect(effects).toEqual([])
  })

  it('ignores input when waitingForFix', () => {
    const state = makeState()
    // Fill all: one error, two correct → waitingForFix
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state
    current = reduce(current, { type: 'enterDigit', digit: 1 }, 4000).state

    expect(getComputedProps(current).waitingForFix).toBe(true)

    const { state: next, effects } = reduce(current, { type: 'enterDigit', digit: 5 }, 5000)
    expect(next).toBe(current)
    expect(effects).toEqual([])
  })
})

describe('reduce — fixError', () => {
  it('resets last incorrect digit and moves position there', () => {
    const state = makeState()
    // Enter wrong digit at position 0, correct at position 1
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state

    const { state: fixed, effects } = reduce(current, { type: 'fixError' }, 4000)

    // Position 0 should be reset to empty
    expect(fixed.problem.answerDigits[0].status).toBe('empty')
    expect(fixed.problem.answerDigits[0].entered).toBeNull()
    // Position 1 (after the fix point) should also be reset
    expect(fixed.problem.answerDigits[1].status).toBe('empty')
    expect(fixed.problem.answerDigits[1].entered).toBeNull()
    expect(fixed.activePosition).toBe(0)
    expect(fixed.remainingFixes).toBe(1)
    expect(fixed.completed).toBe(false)
    expect(effects).toEqual([{ type: 'cancelAdvance' }])
  })

  it('fixes last incorrect digit when multiple errors exist', () => {
    const state = makeState()
    // Wrong at 0, wrong at 1
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 9 }, 3000).state

    const { state: fixed } = reduce(current, { type: 'fixError' }, 4000)

    // Position 1 (last error) should be reset
    expect(fixed.problem.answerDigits[1].status).toBe('empty')
    // Position 0 (earlier error) stays incorrect
    expect(fixed.problem.answerDigits[0].status).toBe('incorrect')
    expect(fixed.activePosition).toBe(1)
    expect(fixed.remainingFixes).toBe(1)
  })

  it('does nothing when canFix is false (no errors)', () => {
    const state = makeState()
    // Enter correct digit
    const current = reduce(state, { type: 'enterDigit', digit: 3 }, 2000).state

    const { state: same, effects } = reduce(current, { type: 'fixError' }, 3000)
    expect(same).toBe(current)
    expect(effects).toEqual([])
  })

  it('does nothing when remainingFixes is 0', () => {
    const state = makeState({ remainingFixes: 0 })
    state.problem.answerDigits[0] = { expected: 3, entered: 9, status: 'incorrect' }

    const { state: same, effects } = reduce(state, { type: 'fixError' }, 3000)
    expect(same).toBe(state)
    expect(effects).toEqual([])
  })

  it('fix then re-enter correctly leads to completion', () => {
    const state = makeState()
    // Wrong, correct, correct → waitingForFix
    let current = reduce(state, { type: 'enterDigit', digit: 9 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state
    current = reduce(current, { type: 'enterDigit', digit: 1 }, 4000).state

    expect(getComputedProps(current).waitingForFix).toBe(true)

    // Fix the error
    current = reduce(current, { type: 'fixError' }, 5000).state
    expect(current.activePosition).toBe(0)
    // Digits after fixIdx should also be reset
    expect(current.problem.answerDigits[1].status).toBe('empty')
    expect(current.problem.answerDigits[2].status).toBe('empty')

    // Re-enter all correctly
    current = reduce(current, { type: 'enterDigit', digit: 3 }, 6000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 7000).state
    const { state: final, effects } = reduce(current, { type: 'enterDigit', digit: 1 }, 8000)

    expect(final.completed).toBe(true)
    expect(final.feedback).toBe('correct')
    expect(final.pendingResult!.correct).toBe(true)
    expect(final.remainingFixes).toBe(1) // used one fix
    expect(effects).toEqual([{ type: 'scheduleAdvance', delayMs: AUTO_ADVANCE_DELAY_MS }])
  })
})

describe('reduce — advance', () => {
  it('resets to a fresh initial state', () => {
    const state = makeState({ completed: true, feedback: 'correct' })
    const { state: next, effects } = reduce(state, { type: 'advance' }, 9000)

    expect(next.activePosition).toBe(0)
    expect(next.completed).toBe(false)
    expect(next.feedback).toBeNull()
    expect(next.remainingFixes).toBe(2)
    expect(next.startTime).toBe(9000)
    expect(next.pendingResult).toBeNull()
    expect(next.problem.answerDigits.every((d) => d.status === 'empty')).toBe(true)
    expect(effects).toEqual([])
  })
})

describe('time tracking', () => {
  it('pendingResult.timeMs = now - startTime', () => {
    const state = makeState({ startTime: 1000 })
    let current = reduce(state, { type: 'enterDigit', digit: 3 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 2 }, 3000).state
    const { state: final } = reduce(current, { type: 'enterDigit', digit: 1 }, 5500)

    expect(final.pendingResult!.timeMs).toBe(4500) // 5500 - 1000
  })
})

describe('subtraction problems', () => {
  it('works the same way with subtraction operation', () => {
    const problem: ColumnProblem = {
      operation: 'subtraction',
      operandA: 500,
      operandB: 23,
      result: 477,
      answerDigits: [
        { expected: 7, entered: null, status: 'empty' },
        { expected: 7, entered: null, status: 'empty' },
        { expected: 4, entered: null, status: 'empty' },
      ],
    }
    const state = makeState({ problem })

    let current = reduce(state, { type: 'enterDigit', digit: 7 }, 2000).state
    current = reduce(current, { type: 'enterDigit', digit: 7 }, 3000).state
    const { state: final } = reduce(current, { type: 'enterDigit', digit: 4 }, 4000)

    expect(final.completed).toBe(true)
    expect(final.pendingResult!.operation).toBe('subtraction')
    expect(final.pendingResult!.correct).toBe(true)
  })
})
