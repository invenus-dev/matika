export type Effect =
  | { type: 'scheduleAdvance'; delayMs: number }
  | { type: 'cancelAdvance' }

export interface ReducerResult<S> {
  state: S
  effects: Effect[]
}
