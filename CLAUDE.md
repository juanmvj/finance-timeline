# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (HMR, http://localhost:5173)
- `npm run build` — TypeScript check + production build (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run oxlint

## Tech Stack

- **Vite + React 19 + TypeScript** (strict mode via `tsc -b`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no config file; directives in `src/index.css`)
- **Recharts** for charts (LineChart, AreaChart)
- **date-fns** for date manipulation
- **react-router-dom** (BrowserRouter) with SPA rewrite in `vercel.json`
- **Supabase** (`@supabase/supabase-js`) for auth (email/password) and PostgreSQL persistence
- Deployed on **Vercel**

## Architecture

### Data Model

Recurring transactions use a **template + on-the-fly generation** pattern:
- `Transaction` stores the recurrence rule (frequency, start date, optional end date)
- `generateOccurrences()` in `src/lib/recurrence.ts` produces `TransactionOccurrence[]` for any date range — occurrences are never persisted
- `OccurrenceOverride` entries allow editing/deleting single occurrences without touching the template

### State Management

React Context + `useReducer` in `src/store/AppContext.tsx`:
- On login: all user data fetched from Supabase → dispatched as `LOAD_STATE`
- Mutations: optimistic dispatch to reducer + async Supabase write
- Auth state from `supabase.auth.onAuthStateChange()`

### Key Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript interfaces and enums |
| `src/lib/recurrence.ts` | Recurring occurrence generation (pure function, performance-critical) |
| `src/lib/balance.ts` | Balance projection algorithm for forecast chart |
| `src/lib/debt.ts` | Debt payoff / amortization calculation |
| `src/store/reducer.ts` | All state mutations |
| `src/store/AppContext.tsx` | Context provider, Supabase data fetching, auth state |
| `supabase/schema.sql` | Database schema + RLS policies (run in Supabase SQL Editor) |

### Database

Tables: `transactions`, `occurrence_overrides`, `debts`, `debt_payments`, `user_settings`. All have `user_id` with RLS policies so each user only sees their own data. A trigger auto-creates `user_settings` on signup.

## Supabase Setup

1. Create project at supabase.com
2. Run `supabase/schema.sql` in the SQL Editor
3. Enable Email auth in Authentication settings
4. Copy project URL and anon key to `.env.local`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

## Recurring Transaction Edit/Delete Logic

- **This occurrence only** → `OccurrenceOverride` with `deleted: true` or field overrides
- **This and all future** → set `recurrence_end_date` on original, optionally create new transaction
- **Entire series** → delete the `Transaction` (cascade deletes overrides)
