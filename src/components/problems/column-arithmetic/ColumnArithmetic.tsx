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
    <div className="h-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-48">
      {/* Top half: problem */}
      <div className="flex-1 flex items-end justify-center pb-4 md:flex-none md:items-center md:pb-0 relative">
        <div className={feedback ? 'opacity-20' : undefined}>
          <ColumnDisplay
            operation={problem.operation}
            operandA={problem.operandA}
            operandB={problem.operandB}
            answerDigits={problem.answerDigits}
            activePosition={activePosition}
          />
        </div>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FeedbackEmoji type={feedback} />
          </div>
        )}
      </div>
      {/* Bottom half: keyboard */}
      <div className="flex-1 flex items-start justify-center pt-4 pb-8 md:flex-none md:items-center md:pt-0 md:pb-0">
        <NumberPad
          onDigit={enterDigit}
          disabled={completed || waitingForFix}
          canFix={canFix}
          remainingFixes={remainingFixes}
          onFix={fixError}
        />
      </div>
    </div>
  )
}
