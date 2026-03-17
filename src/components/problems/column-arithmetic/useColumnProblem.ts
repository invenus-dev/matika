import { useState, useCallback, useRef, useEffect } from 'react'
import type { ColumnProblem, ProblemResult } from '../../../types'
import { generateColumnProblem } from '../../../utils/math'
import { AUTO_ADVANCE_DELAY_MS } from '../../../utils/constants'

const MAX_FIXES_PER_PROBLEM = 2

export function useColumnProblem(
  onResult: (result: ProblemResult) => void,
) {
  const [problem, setProblem] = useState<ColumnProblem>(generateColumnProblem)
  const [activePosition, setActivePosition] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [remainingFixes, setRemainingFixes] = useState(MAX_FIXES_PER_PROBLEM)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Is there an incorrect digit we can go back to?
  const hasError = problem.answerDigits.some((d) => d.status === 'incorrect')
  const allFilled = problem.answerDigits.every((d) => d.status !== 'empty')
  const canFix = hasError && remainingFixes > 0
  const waitingForFix = allFilled && hasError && !completed

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const enterDigit = useCallback(
    (digit: number) => {
      if (completed || waitingForFix) return

      // Pure state update — compute new problem
      const newDigits = [...problem.answerDigits]
      const current = newDigits[activePosition]
      const isCorrect = digit === current.expected

      newDigits[activePosition] = {
        ...current,
        entered: digit,
        status: isCorrect ? 'correct' : 'incorrect',
      }

      const updatedProblem = { ...problem, answerDigits: newDigits }
      setProblem(updatedProblem)

      const nextPos = activePosition + 1

      if (nextPos >= newDigits.length) {
        const correctDigits = newDigits.filter((d) => d.status === 'correct').length
        const totalDigits = newDigits.length
        const allCorrect = correctDigits === totalDigits
        const hasErrors = !allCorrect

        // If there are errors and fixes remain, wait for fix instead of advancing
        if (hasErrors && remainingFixes > 0) {
          // Don't advance position — stay, let user press fix
        } else {
          const timeMs = Date.now() - startTimeRef.current
          const result: ProblemResult = {
            operation: problem.operation,
            correct: allCorrect,
            totalDigits,
            correctDigits,
            timeMs,
          }

          setCompleted(true)
          setFeedback(allCorrect ? 'correct' : 'incorrect')
          timerRef.current = setTimeout(() => {
            onResult(result)
            setProblem(generateColumnProblem())
            setActivePosition(0)
            setCompleted(false)
            setFeedback(null)
            setRemainingFixes(MAX_FIXES_PER_PROBLEM)
            startTimeRef.current = Date.now()
          }, AUTO_ADVANCE_DELAY_MS)
        }
      } else {
        setActivePosition(nextPos)
      }
    },
    [problem, activePosition, completed, waitingForFix, remainingFixes, onResult],
  )

  const fixError = useCallback(() => {
    if (!canFix) return

    // Cancel auto-advance if we were in completed state
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setCompleted(false)

    // Find the last incorrect digit (highest index with status 'incorrect')
    let fixIdx = -1
    for (let i = problem.answerDigits.length - 1; i >= 0; i--) {
      if (problem.answerDigits[i].status === 'incorrect') {
        fixIdx = i
        break
      }
    }
    if (fixIdx === -1) return

    setProblem((prev) => {
      const newDigits = [...prev.answerDigits]
      newDigits[fixIdx] = {
        ...newDigits[fixIdx],
        entered: null,
        status: 'empty',
      }
      // Also reset any digits after the fixed one back to empty
      for (let i = fixIdx + 1; i < newDigits.length; i++) {
        if (newDigits[i].status !== 'empty') {
          newDigits[i] = { ...newDigits[i], entered: null, status: 'empty' }
        }
      }
      return { ...prev, answerDigits: newDigits }
    })

    setActivePosition(fixIdx)
    setRemainingFixes((r) => r - 1)
  }, [canFix, problem.answerDigits])

  return { problem, activePosition, completed, waitingForFix, feedback, enterDigit, canFix, remainingFixes, fixError }
}
