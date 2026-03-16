import type { DigitStatus } from '../../../types'

interface DigitCellProps {
  value: number | null
  status: DigitStatus
  isActive: boolean
}

export function DigitCell({ value, status, isActive }: DigitCellProps) {
  const base = 'w-18 h-18 flex items-center justify-center text-4xl font-bold rounded-xl border-3 transition-all'

  let style: string
  if (status === 'correct') {
    style = 'bg-correct-light border-correct text-correct'
  } else if (status === 'incorrect') {
    style = 'bg-incorrect-light border-incorrect text-incorrect animate-shake'
  } else if (isActive) {
    style = 'bg-active-light border-active animate-pulse'
  } else {
    style = 'bg-gray-50 border-gray-300 border-dashed'
  }

  return (
    <div className={`${base} ${style}`}>
      {value !== null ? value : ''}
    </div>
  )
}
