import type { ExerciseType } from '../../types'
import { ColumnArithmetic } from './column-arithmetic/ColumnArithmetic'

interface ProblemAreaProps {
  exerciseType: ExerciseType
}

export function ProblemArea({ exerciseType }: ProblemAreaProps) {
  switch (exerciseType) {
    case 'column-arithmetic':
      return <ColumnArithmetic exerciseType={exerciseType} />
  }
}
