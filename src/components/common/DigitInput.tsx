import { useEffect, useCallback } from 'react'
import { NumberPad } from './NumberPad'

interface DigitInputProps {
  onDigit: (digit: number) => void
  onFix: () => void
  disabled: boolean
  canFix: boolean
  remainingFixes: number
}

export function DigitInput({ onDigit, onFix, disabled, canFix, remainingFixes }: DigitInputProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const digit = parseInt(e.key, 10)
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        onDigit(digit)
      } else if (e.key === 'Backspace' && canFix) {
        onFix()
      }
    },
    [onDigit, canFix, onFix],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <NumberPad
      onDigit={onDigit}
      disabled={disabled}
      canFix={canFix}
      remainingFixes={remainingFixes}
      onFix={onFix}
    />
  )
}
