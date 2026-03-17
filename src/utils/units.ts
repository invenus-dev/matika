import type { UnitConversionProblem } from '../types'

interface UnitDef {
  symbol: string
  exponent: number
}

type Family = 'length' | 'volume' | 'mass'

const UNIT_FAMILIES: Record<Family, UnitDef[]> = {
  length: [
    { symbol: 'mm', exponent: -3 },
    { symbol: 'cm', exponent: -2 },
    { symbol: 'dm', exponent: -1 },
    { symbol: 'm', exponent: 0 },
    { symbol: 'km', exponent: 3 },
  ],
  volume: [
    { symbol: 'ml', exponent: -3 },
    { symbol: 'cl', exponent: -2 },
    { symbol: 'dl', exponent: -1 },
    { symbol: 'l', exponent: 0 },
  ],
  mass: [
    { symbol: 'g', exponent: 0 },
    { symbol: 'dg', exponent: -1 },
    { symbol: 'kg', exponent: 3 },
  ],
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateUnitConversionProblem(): UnitConversionProblem {
  const families: Family[] = ['length', 'volume', 'mass']
  const family = pickRandom(families)
  const units = UNIT_FAMILIES[family]

  // Pick two different units with exp diff <= 3
  let source: UnitDef
  let target: UnitDef
  do {
    source = pickRandom(units)
    target = pickRandom(units)
  } while (source.symbol === target.symbol || Math.abs(source.exponent - target.exponent) > 3)

  const expDiff = source.exponent - target.exponent
  // expDiff > 0 means answer = sourceValue * 10^expDiff (multiply up)
  // expDiff < 0 means answer = sourceValue / 10^(-expDiff) (divide down)

  let sourceValue: number
  if (expDiff >= 0) {
    // Answer will be sourceValue * 10^expDiff — pick source so answer <= 9999
    const maxSource = Math.floor(9999 / Math.pow(10, expDiff))
    sourceValue = randInt(1, Math.max(1, maxSource))
  } else {
    // Answer will be sourceValue / 10^(-expDiff) — source must be divisible
    // Answer can be 1..99 (allow two-digit answers), source = answer * factor
    const factor = Math.pow(10, -expDiff)
    const maxAnswer = Math.min(99, Math.floor(9999 / factor))
    const answer = randInt(1, Math.max(1, maxAnswer))
    sourceValue = answer * factor
  }

  const expectedAnswer = expDiff >= 0
    ? sourceValue * Math.pow(10, expDiff)
    : sourceValue / Math.pow(10, -expDiff)

  return {
    family,
    sourceValue,
    sourceUnit: source.symbol,
    targetUnit: target.symbol,
    expectedAnswer,
  }
}
