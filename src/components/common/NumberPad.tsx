interface NumberPadProps {
  onDigit: (digit: number) => void
  disabled?: boolean
  canFix?: boolean
  remainingFixes?: number
  onFix?: () => void
}

const rows: (number | string | null)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['fix', 0, null],
]

export function NumberPad({ onDigit, disabled, canFix, remainingFixes, onFix }: NumberPadProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
      {rows.flat().map((cell, i) => {
        if (cell === 'fix') {
          if (!canFix) return <div key="fix" />
          return (
            <button
              key="fix"
              onPointerDown={(e) => {
                e.preventDefault()
                onFix?.()
              }}
              className="w-20 h-20 rounded-xl bg-incorrect-light border-2 border-incorrect text-incorrect text-lg font-semibold select-none transition-all active:scale-95"
              style={{ touchAction: 'manipulation' }}
              title={`Opravit (zbývá ${remainingFixes ?? 0}×)`}
            >
              ↩ {remainingFixes}×
            </button>
          )
        }

        if (cell === null) return <div key={`empty-${i}`} />

        return (
          <button
            key={cell}
            onPointerDown={(e) => {
              e.preventDefault()
              if (!disabled) onDigit(cell as number)
            }}
            disabled={disabled}
            className="w-20 h-20 rounded-xl bg-white border-2 border-gray-200 text-2xl font-semibold text-gray-700 select-none transition-all active:scale-95 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ touchAction: 'manipulation' }}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}
