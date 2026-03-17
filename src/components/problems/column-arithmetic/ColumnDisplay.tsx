import { Minus } from '@phosphor-icons/react'
import type { OperationType, AnswerDigit } from '../../../types'
import { extractDigits } from '../../../utils/math'
import { DigitCell } from './DigitCell'

interface ColumnDisplayProps {
  operation: OperationType
  operandA: number
  operandB: number
  answerDigits: AnswerDigit[]
  activePosition: number
}

const CELL = 'w-18 h-18'

function OperandRow({ value, maxCols }: { value: number; maxCols: number }) {
  const digits = extractDigits(value).reverse() // most significant first
  const padding = maxCols - digits.length

  return (
    <div className="flex justify-end">
      {Array.from({ length: padding }, (_, i) => (
        <div key={`pad-${i}`} className={CELL} />
      ))}
      {digits.map((d, i) => (
        <div
          key={i}
          className={`${CELL} flex items-center justify-center text-4xl font-bold text-gray-800`}
        >
          {d}
        </div>
      ))}
    </div>
  )
}

export function ColumnDisplay({
  operation,
  operandA,
  operandB,
  answerDigits,
  activePosition,
}: ColumnDisplayProps) {
  const maxCols = Math.max(
    answerDigits.length,
    extractDigits(operandA).length,
    extractDigits(operandB).length + 1, // +1 because operator occupies one cell
  )
  return (
    <div className="inline-flex flex-col items-end">
      {/* Operand A */}
      <OperandRow value={operandA} maxCols={maxCols} />

      {/* Operator + Operand B */}
      <div className="flex items-center">
        <div className={`w-12 ${CELL.split(' ')[1]} flex items-center justify-center text-gray-500`}>
          {operation === 'subtraction' && <Minus size={28} weight="bold" />}
        </div>
        <OperandRow value={operandB} maxCols={maxCols - 1} />
      </div>

      {/* Line */}
      <div
        className="border-t-3 border-gray-800 my-1"
        style={{ width: `${maxCols * 4.5 + 3}rem` }}
      />

      {/* Answer row */}
      <div className="flex justify-end gap-0">
        {[...answerDigits].reverse().map((digit, visualIdx) => {
          const logicalIdx = answerDigits.length - 1 - visualIdx
          return (
            <DigitCell
              key={logicalIdx}
              value={digit.entered}
              status={digit.status}
              isActive={logicalIdx === activePosition}
            />
          )
        })}
      </div>
    </div>
  )
}
