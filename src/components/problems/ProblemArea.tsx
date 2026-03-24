import type { ExerciseType } from '../../types'
import { ColumnArithmetic } from './column-arithmetic/ColumnArithmetic'
import { UnitConversion } from './unit-conversion/UnitConversion'
import { MultiplicationDivision } from './multiplication-division/MultiplicationDivision'

interface ProblemAreaProps {
  exerciseType: ExerciseType
}

export function ProblemArea({ exerciseType }: ProblemAreaProps) {
  switch (exerciseType) {
    case 'column-arithmetic':
      return <ColumnArithmetic exerciseType={exerciseType} />
    case 'unit-conversion':
      return <UnitConversion exerciseType={exerciseType} />
    case 'multiplication-division':
      return <MultiplicationDivision exerciseType={exerciseType} />
  }
}
