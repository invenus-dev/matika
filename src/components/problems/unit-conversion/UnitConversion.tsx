import { useCallback } from 'react'
import type { ExerciseType, ProblemResult } from '../../../types'
import { useProblemContext } from '../../../context/useProblemContext'
import { useDailyProgress } from '../../../context/useDailyProgress'
import { FeedbackEmoji } from '../column-arithmetic/FeedbackEmoji'
import { UnitConversionDisplay } from './UnitConversionDisplay'
import { UnitConversionControls } from './UnitConversionControls'
import { useUnitConversionProblem } from './useUnitConversionProblem'

interface UnitConversionProps {
  exerciseType: ExerciseType
}

export function UnitConversion({ exerciseType }: UnitConversionProps) {
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

  const {
    problem,
    userAnswer,
    completed,
    feedback,
    canDivide: canDiv,
    multiplyByTen,
    divideByTen,
    confirm,
  } = useUnitConversionProblem(handleResult)

  return (
    <div className="h-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-48">
      {/* Top half: problem */}
      <div className="flex-1 flex items-end justify-center pb-4 md:flex-none md:items-center md:pb-0 relative">
        <div className={feedback && completed ? 'opacity-10' : undefined}>
          <UnitConversionDisplay
            sourceValue={problem.sourceValue}
            sourceUnit={problem.sourceUnit}
            targetUnit={problem.targetUnit}
            userAnswer={userAnswer}
            feedback={feedback}
            confirmed={false}
          />
        </div>
        {feedback && completed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FeedbackEmoji type={feedback} />
          </div>
        )}
      </div>
      {/* Bottom half: controls */}
      <div className="flex-1 flex items-start justify-center pt-4 pb-8 md:flex-none md:items-center md:pt-0 md:pb-0">
        <UnitConversionControls
          onMultiply={multiplyByTen}
          onDivide={divideByTen}
          onConfirm={confirm}
          canDivide={canDiv}
          disabled={completed}
          feedback={feedback}
        />
      </div>
    </div>
  )
}
