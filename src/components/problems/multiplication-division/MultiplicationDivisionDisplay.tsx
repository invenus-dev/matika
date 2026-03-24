import type { MultiplicationDivisionProblem } from '../../../types'

interface MultiplicationDivisionDisplayProps {
  problem: MultiplicationDivisionProblem
  userInput: string
  feedback: 'correct' | 'incorrect' | null
  hasBeenWrong: boolean
}

export function MultiplicationDivisionDisplay({
  problem,
  userInput,
  feedback,
  hasBeenWrong,
}: MultiplicationDivisionDisplayProps) {
  const borderColor =
    feedback === 'correct'
      ? 'border-correct bg-correct-light'
      : feedback === 'incorrect'
        ? 'border-incorrect bg-incorrect-light'
        : 'border-gray-300 bg-white'

  const shakeClass = feedback === 'incorrect' ? 'animate-shake' : ''

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Problem display */}
      <div className="text-5xl font-bold text-gray-800 tracking-wide select-none">
        {problem.operandA}{' '}
        <span className="text-primary">{problem.operation}</span>{' '}
        {problem.operandB}{' '}
        <span className="text-gray-400">=</span>
      </div>

      {/* Answer box */}
      <div className={`${shakeClass} flex items-center justify-center`}>
        <div
          className={`w-32 h-16 rounded-xl border-3 ${borderColor} flex items-center justify-center text-4xl font-bold text-gray-800 transition-colors`}
        >
          {userInput || <span className={feedback === 'incorrect' ? 'text-red-300' : 'text-gray-300'}>?</span>}
        </div>
      </div>

      {/* Retry hint */}
      {hasBeenWrong && !feedback && (
        <p className="text-sm text-gray-500">Ještě jeden pokus</p>
      )}
    </div>
  )
}
