import { useCallback, useEffect } from 'react'
import type { ExerciseType, ProblemResult } from '../../../types'
import { useProblemContext } from '../../../context/ProblemContext'
import { useDailyProgress } from '../../../context/DailyProgressContext'
import { FeedbackEmoji } from '../column-arithmetic/FeedbackEmoji'
import { MultiplicationDivisionDisplay } from './MultiplicationDivisionDisplay'
import { MultiplicationDivisionControls } from './MultiplicationDivisionControls'
import { useMultiplicationDivisionProblem } from './useMultiplicationDivisionProblem'

interface MultiplicationDivisionProps {
  exerciseType: ExerciseType
}

export function MultiplicationDivision({ exerciseType }: MultiplicationDivisionProps) {
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
    userInput,
    completed,
    feedback,
    hasBeenWrong,
    enterDigit,
    deleteDigit,
    confirm,
  } = useMultiplicationDivisionProblem(handleResult)

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') {
        enterDigit(parseInt(e.key, 10))
      } else if (e.key === 'Backspace') {
        deleteDigit()
      } else if (e.key === 'Enter') {
        confirm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enterDigit, deleteDigit, confirm])

  return (
    <div className="h-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-48">
      {/* Top: problem — takes remaining space, centered */}
      <div className="flex-1 flex items-center justify-center md:flex-none relative">
        <div className={feedback && completed ? 'opacity-10' : undefined}>
          <MultiplicationDivisionDisplay
            problem={problem}
            userInput={userInput}
            feedback={feedback}
            hasBeenWrong={hasBeenWrong}
          />
        </div>
        {feedback && completed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FeedbackEmoji type={feedback} />
          </div>
        )}
      </div>
      {/* Bottom: controls — fixed size */}
      <div className="shrink-0 flex justify-center pb-6 md:pb-0">
        <MultiplicationDivisionControls
          onDigit={enterDigit}
          onDelete={deleteDigit}
          onConfirm={confirm}
          disabled={completed || feedback === 'incorrect'}
          canConfirm={userInput.length > 0}
        />
      </div>
    </div>
  )
}
