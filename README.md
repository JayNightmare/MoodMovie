<div align="center">
  <img src="./assets/moodmovie.png" alt="MoodMovie" width="160" />
  <h1>MoodMovie</h1>
  <p><strong>From mood → curated movie picks in a few adaptive questions.</strong></p>
  <p>
    React + TypeScript + Vite • Tailwind + Radix UI • Supabase Edge Functions • OpenAI • TMDb
  </p>
  <p>
    <a href="https://github.com/JayNightmare/MoodMovie">Source</a> ·
    <a href="#quick-start">Quick Start</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#configuration--env">Config</a> ·
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## Overview

MoodMovie asks you a small, adaptive set of questions about your current mood, energy, and viewing preferences, then recommends a handful of films with match scores. If external AI / data APIs (OpenAI, TMDb) are unavailable, the app gracefully falls back to curated static data so the experience always works.

## Key Features

* Adaptive question flow (stops early when enough signal collected)
* Mixed question types: multiple-choice + scale
* AI-assisted question generation & scoring
* Movie search & enrichment via TMDb
* Resilient fallbacks for offline / missing keys scenarios
* Accessible UI (keyboard + focus styles + tooltips)
* Dark / light theme toggle
* Simple review submission (optional Discord webhook)
* Type-safe codebase (TypeScript) & modern component primitives (Radix UI + Tailwind)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI primitives |
| State / Logic | Local React state + utility modules |
| Edge / API | Supabase Edge Function (Hono) deployed in `supabase/functions/server` |
| Optional AI | OpenAI Chat Completions (`gpt-5-nano` placeholder model id) |
| Movie Data | TMDb API (search + metadata) or local fallback DB |
| Messaging | Discord Webhook (optional review posting) |

## Folder Structure (abridged)

```
MoodMovie/
  App.tsx               # Root app / state machine (questioning → results → perfect-match)
  components/           # UI + feature components
  components/ui/        # Radix wrapped primitives
  supabase/functions/   # Edge function (Hono server)
  utils/                # AI logic, local movie db, Supabase info
  types/                # Shared TS types (questions, etc.)
  styles/               # Global CSS (Tailwind layers)
```

## Architecture

Frontend collects user responses and decides when to stop asking questions using `shouldStopQuestioning`. On completion it requests recommendations (`getMovieRecommendations`). Both hit the Supabase Edge Function endpoints (`/next-question`, `/should-stop`, `/recommendations`). Each endpoint:

1. Tries AI-powered logic if corresponding API keys are present.
2. Falls back to deterministic static questions / curated movie lists if not.
3. Returns JSON shaped for frontend types (`Question[]`, `Movie[]`).

Match scores may be refined by a second AI pass (optional). Reviews (rating + text) can be sent to a Discord channel via webhook.

### Data / Control Flow

```text
User → QuestionFlow → (AI or fallback questions)
   responses accumulate ──┐
                          ├─> shouldStopQuestioning → decides early stop
                          └─> getMovieRecommendations → movies + scores
                                      │
                                      └─> Results / PerfectMatch UI
```

### Resilience Strategy

| Area | Primary | Fallback |
|------|---------|----------|
| Question set | OpenAI adaptive generation | Static 5-question set |
| Stop decision | OpenAI reasoning | Simple length heuristic |
| Recommendations | OpenAI + TMDb search | Local curated list + random scores |
| Review posting | Discord webhook | No-op success response |

## Configuration & ENV

Create a `.env` (or `.env.local`) at project root for Vite (prefix with `VITE_`). Edge function keys are set via Supabase dashboard / `supabase secrets`.

Frontend (Vite) variables:
```
VITE_SUPABASE_PROJECT_ID=your-project-ref
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_TMDB_API_KEY=tmdb-api-key        # optional (improves movie data)
```

Edge Function (Supabase) environment (configure in Supabase):
```
OPENAI_API_KEY=sk-...                 # optional
TMDB_API_KEY=tmdb-api-key             # optional (used if VITE_ key not provided)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...  # optional
```

Without any keys the app still works using fallbacks.

## Quick Start

Prerequisites: Node 18+ (or 20+ recommended), pnpm / npm, (optional) Supabase CLI & API keys.

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev

# Type-check only
npm run type-check

# Production build
npm run build

# Preview build locally
npm run preview
```

Visit the printed local URL (default: `http://localhost:5173`).

## Supabase Edge Function

Location: `supabase/functions/server/index.tsx`

Endpoints (all under `/make-server-4bf7affd` prefix):
| Path | Method | Purpose |
|------|--------|---------|
| `/health` | GET | Basic health & env presence check |
| `/debug` | GET | Debug info (routes / env flags) |
| `/next-question` | POST | Returns up to 5 questions (AI or fallback) |
| `/should-stop` | POST | Decide whether to stop early |
| `/recommendations` | POST | Returns movie list (AI+TMDb or fallback) |
| `/submit-review` | POST | Sends review to Discord webhook |
| `/test` | POST | Simple connectivity test |

### Deploy (example)

```bash
# Login & link (once)
supabase login
supabase link --project-ref <your-project-ref>

# Deploy the function
supabase functions deploy server --project-ref <your-project-ref>

# Invoke locally (for testing)
supabase functions serve server
```

> Adjust names if you rename the function folder from `server`.

## Customizing Questions

Update fallback questions in `utils/ai-logic.ts` or server function generator logic. Maintain the `Question` type contract (`id`, `text`, `type`, `category`, etc.).

## Accessibility Notes

* Keyboard activation support (e.g., links trigger on Enter / Space in `Funding`)
* Tooltips appear on hover/focus (Radix provides a11y structure)
* Color tokens rely on Tailwind theme (ensure sufficient contrast in custom themes)

## Testing Ideas (Not yet implemented)

* Unit tests for stop decision heuristics & fallback logic
* Contract tests for question / movie payload shapes
* Visual regression for theme + layout

## Roadmap / Next Steps

* Persist past recommendations (local storage or Supabase table)
* Add genre filtering / skip question action
* Add streaming availability region customization
* Add PWA install + offline cache
* Add basic Jest / Vitest test suite

## Contributing

1. Fork & branch (`feat/your-feature`)
2. Install & run dev
3. Keep changes atomic; add comments where logic is non-obvious
4. Open PR with summary + screenshots (if UI)

## Security

Do not commit real API keys. Use environment variables. If a key is exposed, rotate it in the provider dashboard (OpenAI, TMDb, Discord, Supabase) immediately.

## License

No explicit license file yet. Assume "All rights reserved" until a LICENSE is added. (Consider MIT or Apache-2.0.)

## Acknowledgments

* Radix UI & Tailwind community
* TMDb (if used) – This product uses the TMDb API but is not endorsed or certified by TMDb.
* OpenAI (optional generation)
* Supabase Edge Functions & Hono framework

---

Enjoy the movies! 🍿