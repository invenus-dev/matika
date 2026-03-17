export const OPERAND_A_MIN = 100
export const OPERAND_A_MAX = 999
export const OPERAND_B_MIN = 10
export const OPERAND_B_MAX = 99

export const AUTO_ADVANCE_DELAY_MS = 1500

export const DAILY_GOAL = 10

import { Calculator, ArrowsLeftRight } from '@phosphor-icons/react'

export const EXERCISE_TYPES: import('../types').ExerciseTypeInfo[] = [
  {
    type: 'column-arithmetic',
    name: 'Sčítání a odčítání',
    description: 'Pod čarou do 1000',
    icon: Calculator,
  },
  {
    type: 'unit-conversion',
    name: 'Převody jednotek',
    description: 'Metry, kilogramy, litry',
    icon: ArrowsLeftRight,
  },
]
