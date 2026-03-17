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

A math practice app for 3rd graders (Czech language). Homepage lets the child pick an exercise type. Currently only column addition/subtraction is implemented. The child enters the answer digit-by-digit from right to left with immediate feedback (green/red) and animated emoji. After all digits are filled, auto-advances to the next problem after 1500ms. Up to 2 fixes per problem via a backspace button. Daily goal is 10 problems per exercise — reaching it triggers a celebration modal. Stats panel shows correct/total, daily progress, and elapsed time. All progress persists in localStorage keyed by date.

## Architecture

**Views:** Homepage (exercise selection) → ProblemArea (exercise router) → ColumnArithmetic. Header shows back button, exercise name, daily progress (X/10), and stats button.

**State management:** Two React Contexts — `ProblemContext` (session stats via `useReducer`) and `DailyProgressContext` (daily counts + goal celebration). Per-problem state lives in a state machine driven by `useExerciseMachine` hook.

**State machine pattern:** Pure reducer in `state-machines/column-arithmetic/reducer.ts` returns `[newState, effects]`. Effects (`scheduleAdvance`, `cancelAdvance`) are executed by `useExerciseMachine` hook which manages timers. This keeps the reducer testable without side effects.

**Problem lifecycle:** `generateColumnProblem()` randomly picks +/− → user enters digits right-to-left → each digit validated immediately → on completion, 1500ms pause → `onResult` records stats + increments daily count → new problem generated.

**Digit representation:** `extractDigits()` returns digits least-significant-first (index 0 = ones). `answerDigits` array uses same order. `ColumnDisplay` reverses for visual rendering and maps `logicalIdx` back for active position highlight.

**Error & fix logic:** Max 2 fixes per problem. If errors exceed remaining fixes, problem is marked wrong immediately. `fixError()` resets last incorrect digit and all following digits.

**Persistence:** `utils/storage.ts` stores daily counts (`matika-daily`) and session stats (`matika-stats`) in localStorage, keyed by date. Handles quota exceeded / private browsing silently.

## Key Conventions

- Tailwind CSS v4 (CSS-first config via `@theme` in `index.css`, `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- Comic Relief font family for playful look (`--font-fun` theme variable)
- Touch-first: buttons use `onPointerDown` with `e.preventDefault()` and `touch-action: manipulation`
- Keyboard also supported (0-9 for digits, Backspace for fix)
- Czech UI labels throughout
- Tests use Vitest with globals enabled; reducer tests are in `*.test.ts` next to the reducer
- Custom CSS animations in `index.css`: shake (incorrect), celebrate (correct), sparkle (feedback icons), sadface
