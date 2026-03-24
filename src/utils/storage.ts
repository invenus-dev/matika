import type { ExerciseType, SessionStats } from '../types'

const STORAGE_KEY = 'matika-daily'
const STATS_KEY = 'matika-stats'

type DailyData = Record<string, Record<string, number>>

interface StoredStats {
  totalProblems: number
  correctProblems: number
  totalDigits: number
  correctDigits: number
  elapsedMs: number
}

type StatsData = Record<string, Record<string, StoredStats>>

function getTodayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readStorage(): DailyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as DailyData
  } catch {
    return {}
  }
}

function writeStorage(data: DailyData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // private browsing or quota exceeded
  }
}

export function loadDailyCounts(): Record<ExerciseType, number> {
  const data = readStorage()
  const today = data[getTodayKey()] ?? {}
  return {
    'column-arithmetic': today['column-arithmetic'] ?? 0,
    'unit-conversion': today['unit-conversion'] ?? 0,
    'multiplication-division': today['multiplication-division'] ?? 0,
  }
}

export function getDailyCount(type: ExerciseType): number {
  return loadDailyCounts()[type]
}

export function incrementDailyCount(type: ExerciseType): number {
  const data = readStorage()
  const key = getTodayKey()
  if (!data[key]) data[key] = {}
  const newCount = (data[key][type] ?? 0) + 1
  data[key][type] = newCount
  writeStorage(data)
  return newCount
}

export function resetDailyCount(type: ExerciseType): void {
  const data = readStorage()
  const key = getTodayKey()
  if (data[key]) {
    delete data[key][type]
    writeStorage(data)
  }
}

// --- Session stats persistence ---

function readStatsStorage(): StatsData {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StatsData
  } catch {
    return {}
  }
}

function writeStatsStorage(data: StatsData): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(data))
  } catch {
    // private browsing or quota exceeded
  }
}

export function loadDailyStats(type: ExerciseType): SessionStats | null {
  const data = readStatsStorage()
  const today = data[getTodayKey()]?.[type]
  if (!today) return null
  return {
    totalProblems: today.totalProblems,
    correctProblems: today.correctProblems,
    totalDigits: today.totalDigits,
    correctDigits: today.correctDigits,
    elapsedMs: today.elapsedMs,
  }
}

export function saveDailyStats(type: ExerciseType, stats: SessionStats): void {
  const data = readStatsStorage()
  const key = getTodayKey()
  if (!data[key]) data[key] = {}
  data[key][type] = {
    totalProblems: stats.totalProblems,
    correctProblems: stats.correctProblems,
    totalDigits: stats.totalDigits,
    correctDigits: stats.correctDigits,
    elapsedMs: stats.elapsedMs,
  }
  writeStatsStorage(data)
}

export function clearDailyStats(type: ExerciseType): void {
  const data = readStatsStorage()
  const key = getTodayKey()
  if (data[key]) {
    delete data[key][type]
    writeStatsStorage(data)
  }
}
