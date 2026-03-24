import { Backspace, Check } from '@phosphor-icons/react'

interface MultiplicationDivisionControlsProps {
  onDigit: (digit: number) => void
  onDelete: () => void
  onConfirm: () => void
  disabled: boolean
  canConfirm: boolean
}

const rows: (number | null)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null],
]

export function MultiplicationDivisionControls({
  onDigit,
  onDelete,
  onConfirm,
  disabled,
  canConfirm,
}: MultiplicationDivisionControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
      {rows.flat().map((cell, i) => {
        if (cell === null && i === 9) {
          // Bottom-left: delete
          return (
            <button
              key="delete"
              onPointerDown={(e) => {
                e.preventDefault()
                if (!disabled) onDelete()
              }}
              disabled={disabled}
              className="w-17 h-17 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600 text-lg font-semibold select-none transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ touchAction: 'manipulation' }}
              title="Smazat"
            >
              <Backspace size={24} weight="bold" className="inline" />
            </button>
          )
        }

        if (cell === null && i === 11) {
          // Bottom-right: confirm
          return (
            <button
              key="confirm"
              onPointerDown={(e) => {
                e.preventDefault()
                if (!disabled && canConfirm) onConfirm()
              }}
              disabled={disabled || !canConfirm}
              className="w-17 h-17 rounded-xl bg-primary border-2 border-primary text-white text-lg font-semibold select-none transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ touchAction: 'manipulation' }}
              title="Potvrdit"
            >
              <Check size={24} weight="bold" className="inline" />
            </button>
          )
        }

        return (
          <button
            key={cell}
            onPointerDown={(e) => {
              e.preventDefault()
              if (!disabled) onDigit(cell as number)
            }}
            disabled={disabled}
            className="w-17 h-17 rounded-xl bg-white border-2 border-gray-200 text-2xl font-semibold text-gray-700 select-none transition-all active:scale-95 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ touchAction: 'manipulation' }}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}
