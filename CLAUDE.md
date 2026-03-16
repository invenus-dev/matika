# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally
- `npm run deploy` — build + deploy to Cloudflare Pages

## What This Is

A math practice app for 3rd graders (Czech language). Generates random column addition/subtraction problems. The child enters the answer digit-by-digit from right to left with immediate feedback (green/red). After all digits are filled, auto-advances to the next problem after 800ms. Up to 2 fixes per problem via a backspace button. "Vyhodnotit" shows session statistics.

## Architecture

**State management:** React Context + `useReducer` in `ProblemContext` for session stats. Per-problem state lives in `useColumnProblem` hook (problem data, active position, fix count, completion timer).

**Problem lifecycle:** `generateColumnProblem()` randomly picks +/− → user enters digits right-to-left → each digit validated immediately → on completion, 800ms pause → `onResult` records stats → new problem generated.

**Digit representation:** `extractDigits()` returns digits least-significant-first (index 0 = ones). `answerDigits` array uses same order. `ColumnDisplay` reverses for visual rendering and maps `logicalIdx` back for active position highlight.

## Key Conventions

- Tailwind CSS v4 (CSS-first config via `@theme` in `index.css`, `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- Comic Sans font family for playful look (`--font-fun` theme variable)
- Touch-first: buttons use `onPointerDown` with `e.preventDefault()` and `touch-action: manipulation`
- Keyboard also supported (0-9 for digits, Backspace for fix)
- Czech UI labels throughout
