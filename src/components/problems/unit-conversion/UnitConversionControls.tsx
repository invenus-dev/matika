import { useEffect, useCallback } from 'react'
import { CaretUp, CaretDown, Check } from '@phosphor-icons/react'

interface UnitConversionControlsProps {
  onMultiply: () => void
  onDivide: () => void
  onConfirm: () => void
  canDivide: boolean
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

export function UnitConversionControls({
  onMultiply,
  onDivide,
  onConfirm,
  canDivide: canDiv,
  disabled,
  feedback,
}: UnitConversionControlsProps) {
  const confirmBlocked = disabled || feedback === 'incorrect'

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === 'ArrowUp') {
        onMultiply()
      } else if ((e.key === '-' || e.key === 'ArrowDown') && canDiv) {
        onDivide()
      } else if (e.key === 'Enter' && !confirmBlocked) {
        onConfirm()
      }
    },
    [onMultiply, onDivide, onConfirm, canDiv, confirmBlocked],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const btnBase = 'w-20 h-20 rounded-xl text-2xl font-semibold select-none transition-all active:scale-95 flex items-center justify-center'

  const confirmStyle = feedback === 'incorrect'
    ? `${btnBase} bg-incorrect-light border-2 border-incorrect text-incorrect cursor-not-allowed`
    : `${btnBase} bg-gray-100 border-2 border-gray-300 text-gray-600 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed`

  return (
    <div className="flex gap-3 items-center">
      <button
        onPointerDown={(e) => {
          e.preventDefault()
          if (!disabled) onMultiply()
        }}
        disabled={disabled}
        className={`${btnBase} bg-white border-2 border-gray-200 text-gray-700 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ touchAction: 'manipulation' }}
        title="×10 (+)"
      >
        <div className="flex flex-col items-center leading-none">
          <CaretUp size={24} weight="bold" />
          <span className="text-base">×10</span>
        </div>
      </button>

      <button
        onPointerDown={(e) => {
          e.preventDefault()
          if (!disabled && canDiv) onDivide()
        }}
        disabled={disabled || !canDiv}
        className={`${btnBase} bg-white border-2 border-gray-200 text-gray-700 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ touchAction: 'manipulation' }}
        title="÷10 (-)"
      >
        <div className="flex flex-col items-center leading-none">
          <CaretDown size={24} weight="bold" />
          <span className="text-base">÷10</span>
        </div>
      </button>

      <button
        onPointerDown={(e) => {
          e.preventDefault()
          if (!confirmBlocked) onConfirm()
        }}
        disabled={confirmBlocked}
        className={confirmStyle}
        style={{ touchAction: 'manipulation' }}
        title="Potvrdit (Enter)"
      >
        <Check size={32} weight="bold" />
      </button>
    </div>
  )
}
