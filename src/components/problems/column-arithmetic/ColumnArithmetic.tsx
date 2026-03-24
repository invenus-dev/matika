import { useCallback } from 'react'
import type { ExerciseType, ProblemResult } from '../../../types'
import { useProblemContext } from '../../../context/useProblemContext'
import { useDailyProgress } from '../../../context/useDailyProgress'
import { DigitInput } from '../../common/DigitInput'
import { ColumnDisplay } from './ColumnDisplay'
import { FeedbackEmoji } from './FeedbackEmoji'
import { useColumnProblem } from './useColumnProblem'

interface ColumnArithmeticProps {
  exerciseType: ExerciseType
}

export function ColumnArithmetic({ exerciseType }: ColumnArithmeticProps) {
  const { recordResult } = useProblemContext()
  const { incrementCount } = useDailyProgress()

  const handleResult = useCallback(
    (result: ProblemResult) => {
      recordResult(exerciseType, result)
      if (result.correct) {
        incrementCount(exerciseType)
      }
    },
    [recordResult, incrementCount, exerciseType],
  )

  const { problem, activePosition, completed, waitingForFix, feedback, enterDigit, canFix, remainingFixes, fixError } =
    useColumnProblem(handleResult)

  return (
    <div className="h-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-48">
      {/* Top half: problem */}
      <div className="flex-1 flex items-end justify-center pb-4 md:flex-none md:items-center md:pb-0 relative">
        <div className={feedback ? 'opacity-10' : undefined}>
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
        <DigitInput
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
