# ATS CV Builder

A browser-only CV builder that tailors your resume for any job using any AI — Claude, ChatGPT, Gemini, or others. ATS-friendly, A4 print-ready, zero backend.

---

## What it does

1. **Fill in your info once** — personal details, experience, projects, skills. Saved in your browser's localStorage. Nothing ever leaves your machine.
2. **Paste a job description** — the app generates a structured prompt from your profile and the JD.
3. **Send to any AI** — paste the prompt into Claude, ChatGPT, Gemini, DeepSeek, or any LLM. It replies with a small JSON object.
4. **Paste the response** — the app applies the tailored summary, skill order, and role emphasis to your CV.
5. **Print to PDF** — click "Download PDF" or hit `Ctrl+P` / `Cmd+P` for a clean, single-page A4 PDF.

---

## Features

- **Private by default** — no account, no server, no tracking. Everything is localStorage.
- **ATS-friendly format** — single-column layout, no tables, no images. Parseable by every ATS.
- **AI tailoring** — reorders your skills and rewrites your summary per job. Never invents experience.
- **Smart emphasis** — role tags (frontend, backend, fullstack, devops, mobile, data, ai) highlight your most relevant bullets.
- **A4 print-ready** — print styles tuned for one-page A4 output.

---

## Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)

---

## Getting started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173), fill in your CV info, and you're done.

---

## CLI tools (optional)

These scripts are for power users and require the dev server or a production build.

| Command             | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `pnpm build`        | Production build → `dist/`                                                |
| `pnpm ats-check`    | Scan `dist/index.html` for ATS pitfalls (run `build` first)               |
| `pnpm keyword-diff` | Compare your CV text against a job description for missing keywords       |
| `pnpm export-pdf`   | Render CV to a dated PDF via Puppeteer (`pnpm add -D puppeteer` required) |

---

## Data & privacy

All CV data is stored in two `localStorage` keys:

- `cv-user-profile-v1` — your full profile
- `cv-generated-profile-v1` — the AI-tailored variant (overwritten each time you apply a response)

Clearing your browser data removes everything. No recovery — export a copy if you want a backup.

