import { useEffect, useCallback } from 'react'
import { useProblemContext } from '../../../context/ProblemContext'
import { NumberPad } from '../../common/NumberPad'
import { ColumnDisplay } from './ColumnDisplay'
import { FeedbackEmoji } from './FeedbackEmoji'
import { useColumnProblem } from './useColumnProblem'

export function ColumnArithmetic() {
  const { recordResult } = useProblemContext()
  const { problem, activePosition, completed, waitingForFix, feedback, enterDigit, canFix, remainingFixes, fixError } =
    useColumnProblem(recordResult)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const digit = parseInt(e.key, 10)
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        enterDigit(digit)
      } else if (e.key === 'Backspace' && canFix) {
        fixError()
      }
    },
    [enterDigit, canFix, fixError],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex items-center gap-48 py-8">
      {feedback ? (
        <FeedbackEmoji type={feedback} />
      ) : (
        <ColumnDisplay
          operation={problem.operation}
          operandA={problem.operandA}
          operandB={problem.operandB}
          answerDigits={problem.answerDigits}
          activePosition={activePosition}
        />
      )}
      <NumberPad
        onDigit={enterDigit}
        disabled={completed || waitingForFix}
        canFix={canFix}
        remainingFixes={remainingFixes}
        onFix={fixError}
      />
    </div>
  )
}
