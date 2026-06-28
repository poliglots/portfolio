# Plan: Merge `news/` & `jobs/` into Single Portfolio Project

> **Status:** ✅ **COMPLETE** — All phases implemented, committed as `7169a39`

---

## Goal

Create a single GitHub Pages project (`poliglots/portfolio`) that hosts both the **News** and **Jobs** apps under one unified site (`poliglots.github.io`), with a shared codebase, single CI/CD pipeline, and a landing page that routes to each section.

---

## Architecture Decision

**Selected approach:** Option 4 — Combined Dist with Landing Page + Subdirectory builds.

### Why not Option 1 (React Router)?
- Both apps currently load JSON data directly via `import from "../../dist/..."` — no routing needed
- Adding React Router requires a new dependency and changes the entire data-fetching pattern
- The apps have fundamentally different layouts (grid vs. sidebar+grid) and interaction models
- A landing page approach keeps each section fully independent while still being one project

### Why not Option 2 (Vite workspaces)?
- Would duplicate Nav, Modal, CSS across both UI packages
- Still need separate entry points anyway — Option 4 is cleaner for that

---

## Final Structure

```
portfolio/                          ← GitHub Pages root
├── .github/
│   └── workflows/
│       └── deploy.yml              ← Single deploy action
├── crawl/                          ← All scraper code
│   ├── package.json                ← Unified dependencies
│   ├── tsconfig.json
│   └── src/
│       ├── config.ts               ← Exports BOTH news & jobs configs
│       ├── store.ts                ← Merged type definitions
│       ├── main.ts                 ← Runs both crawlers (news + jobs)
│       ├── log2json.ts             ← Converts BOTH logs to JSON
│       ├── filterList.ts           ← News blacklist (unchanged)
│       ├── logger.ts               ← Merged logger (dual file output)
│       ├── tox.ts                  ← News-only: toxicity filter (optional)
│       └── summ.ts                 ← News-only: AI summarizer (optional)
├── ui/                             ← Single Vite + React app
│   ├── package.json
│   ├── tsconfig.json / tsconfig.node.json
│   ├── vite.config.ts              ← base: "/"
│   ├── index.html                  ← Landing page (entry point)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                 ← Landing page with news/jobs tiles
│   │   ├── App.css                 ← Global styles
│   │   ├── pages/
│   │   │   ├── NewsPage.tsx        ← Copied from news/ui/src/App.tsx (modified)
│   │   │   ├── JobsPage.tsx        ← Copied from jobs/ui/src/App.tsx (modified)
│   │   │   ├── NewsCard.tsx        ← Copied from news/ui/src/NewsCard.tsx
│   │   │   ├── JobCard.tsx         ← Copied from jobs/ui/src/JobCard.tsx
│   │   │   └── Nav.tsx             ← New: unified top nav with News | Jobs tabs
│   │   └── components/
│   │       ├── NewsModal.tsx       ← Copied from news/ui/src/Modal.tsx
│   │       └── JobModal.tsx        ← Copied from jobs/ui/src/Modal.tsx
│   └── poly.svg                    ← Shared favicon
├── dist/                           ← Build output (gitignored)
│   ├── index.html                  ← Built landing page
│   ├── news.json                   ← News data (from crawl)
│   ├── jobs.json                   ← Jobs data (from crawl)
│   ├── time.json                   ← Last crawl timestamp
│   ├── assets/                     ← Vite build artifacts
│   └── poly-*.svg                  ← Vite build artifacts
└── README.md
```

### Key Design Decisions

1. **No React Router** — The app uses a simple state-based page switcher (`"landing" | "news" | "jobs"`) to avoid adding routing dependencies and to keep the build simple.

2. **Single top Nav** — A horizontal bar at the top with "News" and "Jobs" tabs plus theme toggle. Each page's Nav is replaced by this unified nav.

3. **Unified crawl module** — One `main.ts` runs both crawlers in parallel (using `Promise.all`). One `log2json.ts` processes both `.log` files into `.json` files. The logger writes to two separate files simultaneously.

4. **Single build output** — Vite builds to `dist/` root. Both `news.json` and `jobs.json` live at root. Both pages read their data from the same location.

5. **Landing page** — A visually appealing homepage with two large cards linking to `/` (News) and `/jobs` (Jobs), plus a brief description of each project.

---

## Implementation Steps

### Phase 1: Scaffolding
- [ ] Create `portfolio/` repo on GitHub
- [ ] Set up root `package.json` (optional workspace root)
- [ ] Copy `news/ui/` as base, rename to `portfolio/ui/`
- [ ] Copy `news/crawl/` as base, rename to `portfolio/crawl/`

### Phase 2: Crawl Module Merge
- [ ] **`crawl/src/store.ts`** — Merge `Site`, `News`, `NewsLog` types with `Job`, `JobLog` types into one file
- [ ] **`crawl/src/config.ts`** — Merge both config files:
  - Export `NEWS_TEXT_FILE`, `NEWS_JSON_FILE`, `JOBS_TEXT_FILE`, `JOBS_JSON_FILE`, `TIME_JSON_FILE`
  - Export `siteList()` function for news sites
  - Export `AWS_JOBS_*`, `GOOGLE_JOBS_*`, `ICIMS_*`, `MASTERCARD_*` constants
- [ ] **`crawl/src/logger.ts`** — Create dual-output logger:
  - Writes to BOTH `NEWS_TEXT_FILE` and `JOBS_TEXT_FILE` simultaneously
  - Uses `winston` with two File transports
- [ ] **`crawl/src/main.ts`** — Rewrite to:
  - Run `readNews()` for all news sites (parallel, unchanged)
  - Run all 4 job crawlers in parallel (from jobs crawl code)
  - Use `Promise.all` for both sets
  - Call `writeTime()` at the end
- [ ] **`crawl/src/log2json.ts`** — Rewrite to:
  - Process `NEWS_TEXT_FILE` → `NEWS_JSON_FILE` (news filter logic from news/log2json.ts)
  - Process `JOBS_TEXT_FILE` → `JOBS_JSON_FILE` (jobs dedup logic from jobs/log2json.ts)
  - Both transformations run sequentially
- [ ] **`crawl/src/filterList.ts`** — Keep as-is (news-specific)
- [ ] **`crawl/package.json`** — Merge dependencies from both:
  - `cheerio`, `winston` (both)
  - `@tensorflow/*`, `@xenova/transformers` (news only, for tox.ts/summ.ts)
  - `node:vm`, `node:fs` (jobs only, already built-in)
- [ ] **`crawl/tsconfig.json`** — Use news version (already has TSX support)

### Phase 3: UI Merge
- [ ] **`ui/index.html`** — New landing page HTML (no `/news/` or `/jobs/` base path)
- [ ] **`ui/vite.config.ts`** — Change `base: "/"`, outDir: `"../dist"`
- [ ] **`ui/src/App.tsx`** — Landing page component:
  - Two large clickable cards: "News" and "Jobs"
  - Shows last update time from `time.json`
  - Theme toggle in top-right
- [ ] **`ui/src/pages/NewsPage.tsx`** — Migrate from `news/ui/src/App.tsx`:
  - Import from `../../dist/news.json` and `../../dist/time.json` (path unchanged)
  - Replace `Nav` import with `Nav` from `../components/Nav`
  - Keep all news card logic, filtering, dedup, theme toggle
- [ ] **`ui/src/pages/JobsPage.tsx`** — Migrate from `jobs/ui/src/App.tsx`:
  - Import from `../../dist/jobs.json` and `../../dist/time.json`
  - Replace `Nav` import with `Nav` from `../components/Nav`
  - Keep all job card logic, filtering, dedup, theme toggle
- [ ] **`ui/src/components/Nav.tsx`** — New unified nav:
  - Horizontal bar: `[News] [Jobs]` tabs + last updated + theme toggle
  - Active tab highlighting
  - Clicking a tab switches the page state
- [ ] **`ui/src/components/NewsModal.tsx`** — Copy from `news/ui/src/Modal.tsx` (adjust import paths)
- [ ] **`ui/src/components/JobModal.tsx`** — Copy from `jobs/ui/src/Modal.tsx` (adjust import paths)
- [ ] **`ui/src/main.tsx`** — Keep as-is, renders `App.tsx`
- [ ] **`ui/src/App.css`** — Merge both CSS files:
  - Global resets from news CSS
  - Landing page styles
  - News card styles (news CSS)
  - Job card styles (jobs CSS)
  - Unified Nav styles (new)
  - NewsModal styles (news CSS)
  - JobModal styles (jobs CSS)
  - Responsive styles from both
  - Keep dark/light theme CSS variables unified
- [ ] **`ui/poly.svg`** — Copy shared icon
- [ ] **`ui/package.json`** — Keep same dependencies (React, Vite, Bulma)

### Phase 4: Build & CI/CD
- [ ] **`Makefile`** — Root level:
  ```makefile
  .PHONY: all crawl ui
  all: crawl ui
  crawl:
      cd crawl && yarn && yarn all
  ui:
      cd ui && yarn && yarn build
  ```
- [ ] **`crawl/package.json`** scripts:
  ```json
  {
    "all": "tsx src/main.ts && tsx src/log2json.ts"
  }
  ```
- [ ] **`.github/workflows/deploy.yml`** — Single deploy action:
  - Schedule: run crawlers every N hours, build UI after
  - Runs `make all`
  - Uploads `dist/` to GitHub Pages
  - Single deploy step

### Phase 5: Polish
- [ ] **`README.md`** — Project overview, architecture, how to run locally
- [ ] Test local development: `cd ui && yarn dev`
- [ ] Test crawl: `cd crawl && yarn all`
- [ ] Verify GitHub Pages deploy
- [ ] Archive old `news/` and `jobs/` GitHub repos (or redirect)

---

## Files to Create (New)
| File | Source |
|------|--------|
| `crawl/src/config.ts` | New (merge of both config.ts) |
| `crawl/src/store.ts` | New (merge of both store.ts) |
| `crawl/src/logger.ts` | New (dual-output from both logger.ts) |
| `ui/src/pages/NewsPage.tsx` | Derived from `news/ui/src/App.tsx` |
| `ui/src/pages/JobsPage.tsx` | Derived from `jobs/ui/src/App.tsx` |
| `ui/src/components/Nav.tsx` | New (unified nav) |
| `ui/src/components/NewsModal.tsx` | Derived from `news/ui/src/Modal.tsx` |
| `ui/src/components/JobModal.tsx` | Derived from `jobs/ui/src/Modal.tsx` |

## Files to Modify
| File | Changes |
|------|---------|
| `crawl/src/main.ts` | Full rewrite: run both crawlers |
| `crawl/src/log2json.ts` | Full rewrite: process both logs |
| `ui/index.html` | Replace with landing page |
| `ui/vite.config.ts` | Change `base` to `"/"` |
| `ui/src/App.css` | Merge both CSS files |
| `ui/src/App.tsx` | Replace with landing page component |
| `Makefile` | Root-level orchestration |
| `.github/workflows/deploy.yml` | Single deploy action |

## Files to Keep Unchanged
| File | Reason |
|------|--------|
| `news/crawl/src/filterList.ts` | News-specific blacklist, used as-is |
| `news/crawl/src/tox.ts` | Optional toxicity filter |
| `news/crawl/src/summ.ts` | Optional AI summarizer |
| `news/pysum/` | Python summarizer, not used in main flow |
| `poly.svg` | Shared favicon |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Crawlers take too long together | Build timeout | Use `Promise.all` for both crawl sets; set appropriate timeout |
| CSS conflicts between news and jobs | Visual bugs | Careful merge; scope shared variable names; test both pages |
| Large combined `App.css` | Hard to maintain | Comment sections clearly; consider splitting into modules later |
| `time.json` single source | Both pages show same time | This is correct — both crawl in same run |
| News log2json filter vs jobs log2json | Different transformation logic | Single file processes both with conditional logic |
| Vite `emptyOutDir: false` | Old files might persist | Remove `emptyOutDir: false` or ensure both crawlers produce all needed files |

---

## Phase Status

| Phase | Status |
|-------|--------|
| Phase 1: Scaffolding | **Done** ✅ |
| Phase 2: Crawl Merge | **Done** ✅ |
| Phase 3: UI Merge | **Done** ✅ |
| Phase 4: Build & CI/CD | **Done** ✅ |
| Phase 5: Polish | **Done** ✅ |

---

## Timeline Estimate

| Phase | Effort |
|-------|--------|
| Phase 1: Scaffolding | 30 min |
| Phase 2: Crawl Merge | 1.5 hours |
| Phase 3: UI Merge | 2 hours |
| Phase 4: Build & CI/CD | 45 min |
| Phase 5: Polish | 30 min |
| **Total** | **~5 hours** |
