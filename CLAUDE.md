# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint
- `npm test` — run Vitest tests
- `npm run preview` — preview production build locally
- `npm run deploy` — build + deploy to Cloudflare Pages

## What This Is

A math practice app for 3rd graders (Czech language). Homepage lets the child pick an exercise type. Three exercises are implemented:

1. **Column arithmetic** (`column-arithmetic`) — addition/subtraction up to 1000, digit-by-digit entry right-to-left with immediate feedback. Daily goal: 10.
2. **Multiplication & division** (`multiplication-division`) — small times table (products up to 100), free-form numeric input with confirm button. Daily goal: 20.
3. **Unit conversions** (`unit-conversion`) — length, volume, and mass conversions (meters, kilograms, liters) using ×10/÷10 buttons. Daily goal: 10.

Each exercise auto-advances to the next problem after 1500ms on completion. Up to 2 fixes per problem. Reaching the daily goal triggers a celebration modal. Stats panel shows correct/total, daily progress, and elapsed time. All progress persists in localStorage keyed by date.

## Architecture

**Views:** Homepage (exercise cards with Phosphor icons + daily progress badges) → ProblemArea (exercise router by `ExerciseType`) → exercise-specific component. Header shows back button, exercise name, daily progress (X/goal), and stats button.

**Exercise registry:** `utils/constants.ts` defines `EXERCISE_TYPES` array — each entry has type, name, description, icon, and dailyGoal. Homepage and storage both derive from this registry.

**State management:** Two React Contexts — `ProblemContext` (session stats via `useReducer`) and `DailyProgressContext` (daily counts + goal celebration). Per-problem state lives in a state machine driven by `useExerciseMachine` hook.

**State machine pattern:** Each exercise has its own pure reducer in `state-machines/<exercise>/reducer.ts` returning `[newState, effects]`. Effects (`scheduleAdvance`, `cancelAdvance`) are executed by the shared `useExerciseMachine` hook which manages timers. This keeps reducers testable without side effects. All three exercises follow this identical pattern.

**Column arithmetic specifics:** `generateColumnProblem()` randomly picks +/− → user enters digits right-to-left → each digit validated immediately. `extractDigits()` returns digits least-significant-first (index 0 = ones). `ColumnDisplay` reverses for visual rendering and maps `logicalIdx` back for active position highlight.

**Error & fix logic:** Max 2 fixes per problem. If errors exceed remaining fixes, problem is marked wrong immediately. `fixError()` resets last incorrect digit and all following digits.

**Persistence:** `utils/storage.ts` stores daily counts (`matika-daily`) and session stats (`matika-stats`) in localStorage, keyed by date. Handles quota exceeded / private browsing silently.

**Version checking:** `utils/version-check.ts` polls `/version.json` every 60s in production and auto-reloads when a new build is detected. Build ID is injected by a custom Vite plugin in `vite.config.ts`.

## Key Conventions

- Tailwind CSS v4 (CSS-first config via `@theme` in `index.css`, `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- Comic Relief font family for playful look (`--font-fun` theme variable)
- Touch-first: buttons use `onPointerDown` with `e.preventDefault()` and `touch-action: manipulation`
- Keyboard also supported (0-9 for digits, Backspace for fix)
- Czech UI labels throughout
- Tests use Vitest with globals enabled; reducer tests are in `*.test.ts` next to the reducer
- Custom CSS animations in `index.css`: shake (incorrect), celebrate (correct), sparkle (feedback icons), sadface
- Each exercise follows the same file structure: `components/problems/<exercise>/`, `state-machines/<exercise>/`, and a generator in `utils/`
