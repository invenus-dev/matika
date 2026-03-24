export const OPERAND_A_MIN = 100
export const OPERAND_A_MAX = 999
export const OPERAND_B_MIN = 10
export const OPERAND_B_MAX = 99

export const AUTO_ADVANCE_DELAY_MS = 1500

import { Calculator, ArrowsLeftRight, XSquare } from '@phosphor-icons/react'
import type { ExerciseType, ExerciseTypeInfo } from '../types'

export const EXERCISE_TYPES: ExerciseTypeInfo[] = [
  {
    type: 'column-arithmetic',
    name: 'Sčítání a odčítání',
    description: 'Pod čarou do 1000',
    icon: Calculator,
    dailyGoal: 10,
  },
  {
    type: 'unit-conversion',
    name: 'Převody jednotek',
    description: 'Metry, kilogramy, litry',
    icon: ArrowsLeftRight,
    dailyGoal: 10,
  },
  {
    type: 'multiplication-division',
    name: 'Násobení a dělení',
    description: 'Malá násobilka do 100',
    icon: XSquare,
    dailyGoal: 20,
  },
]

export function getDailyGoal(type: ExerciseType): number {
  return EXERCISE_TYPES.find((e) => e.type === type)?.dailyGoal ?? 10
}
