# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ATS CV Builder — a client-side React + Vite + TypeScript app. Users fill in their CV data once via a setup form; everything is stored in localStorage. No backend, no auth, no database.

## Commands

```bash
pnpm dev          # dev server at http://localhost:5173
pnpm build        # production build → dist/
pnpm ats-check    # ATS linter on dist/ — must run pnpm build first
pnpm keyword-diff # compare CV text vs job.txt for missing keywords
pnpm export-pdf   # render CV to PDF (requires puppeteer: pnpm add -D puppeteer)
pnpm generate-profile prepare  # build Claude prompt from profile.json + job.txt
pnpm generate-profile apply    # validate .ai-response.json
```

## Architecture

- **No file-based profiles.** The original private version had `src/profiles/default.ts` with hardcoded data. This public version stores everything in localStorage. Never create `src/profiles/default.ts` or other personal profile files.
- **Two localStorage keys:** `cv-user-profile-v1` (the user's full profile) and `cv-generated-profile-v1` (AI-tailored variant). Both are read by `src/profiles/index.ts`.
- **View routing is query-param based**, not file-based React Router. Views: `?view=setup`, `?view=generate`, `?profile=default`, `?profile=generated`. The `App.tsx` `getView()` function drives this.
- **First-run flow:** if `cv-user-profile-v1` is absent from localStorage, App redirects to SetupPage regardless of URL params.

## Key files

- `src/profiles/types.ts` — all TypeScript interfaces (`Profile`, `Experience`, `Project`, `SkillRow`, etc.)
- `src/profiles/index.ts` — `getUserProfile()`, `saveUserProfile()`, `getActiveProfile()`, localStorage helpers
- `src/app/App.tsx` — view router + CV renderer
- `src/app/components/SetupPage.tsx` — multi-section profile input form
- `src/app/components/GeneratePage.tsx` — AI tailoring UI (paste JD → copy prompt → paste JSON response)
- `src/app/components/LandingPage.tsx` — dashboard after setup

## Gotchas

- `src/profiles/generated.ts` is in `.gitignore` — it's created at runtime by the CLI script, not committed.
- `profile.json` and `job.txt` are gitignored — personal data for CLI use only.
- The Figma asset resolver in `vite.config.ts` transforms `figma:asset/` imports. Do not remove the React or Tailwind plugins from that file — they're both required even if unused directly.
- Scripts in `scripts/*.mjs` are Node ESM — they require Node 18+.
- `pnpm ats-check` reads `dist/index.html` — always build first.
- Vite 6.3.5 is pinned via `pnpm.overrides` — don't upgrade it without testing.

## Style

- TypeScript throughout. No `tsconfig.json` — Vite handles TS compilation.
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not v3 — no `tailwind.config.js`).
- No ESLint or Prettier configured. Keep code consistent with surrounding files.
