interface UnitConversionDisplayProps {
  sourceValue: number
  sourceUnit: string
  targetUnit: string
  userAnswer: number
  feedback: 'correct' | 'incorrect' | null
  confirmed: boolean
}

export function UnitConversionDisplay({
  sourceValue,
  sourceUnit,
  targetUnit,
  userAnswer,
  feedback,
  confirmed,
}: UnitConversionDisplayProps) {
  const answerBox = 'min-w-24 px-4 py-2 text-5xl font-bold rounded-xl border-3 text-center transition-all'

  let answerStyle: string
  if (feedback === 'correct') {
    answerStyle = 'bg-correct-light border-correct text-correct'
  } else if (feedback === 'incorrect') {
    answerStyle = 'bg-incorrect-light border-incorrect text-incorrect animate-shake'
  } else if (confirmed) {
    answerStyle = 'bg-gray-50 border-gray-300'
  } else {
    answerStyle = 'bg-active-light border-active'
  }

  return (
    <div className="select-none md:flex md:items-center md:gap-3">
      {/* Mobile: 2-column grid aligned on number|unit boundary */}
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-2 gap-y-1 md:hidden">
        {/* Source */}
        <span className="text-5xl font-bold text-gray-800 text-right">{sourceValue}</span>
        <span className="text-3xl text-gray-500">{sourceUnit}</span>
        {/* Equals */}
        <span className="text-3xl text-gray-400 col-span-2 text-center">=</span>
        {/* Target */}
        <div className="justify-self-end">
          <div className={`${answerBox} ${answerStyle}`}>{userAnswer}</div>
        </div>
        <span className="text-3xl text-gray-500 self-center">{targetUnit}</span>
      </div>

      {/* Desktop: inline row */}
      <div className="hidden md:flex md:items-baseline md:gap-2">
        <span className="text-5xl font-bold text-gray-800">{sourceValue}</span>
        <span className="text-3xl text-gray-500">{sourceUnit}</span>
        <span className="text-3xl text-gray-400">=</span>
        <div className={`${answerBox} ${answerStyle}`}>{userAnswer}</div>
        <span className="text-3xl text-gray-500">{targetUnit}</span>
      </div>
    </div>
  )
}
