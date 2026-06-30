# polyglot.dev

**Real-time news aggregation & job market insights.**

A single portfolio project combining two data-driven applications: live news headlines from major global outlets and software engineering job listings from top tech companies.

---

## Architecture

```
portfolio/
├── crawl/          ← Scraper code (news + jobs)
├── ui/             ← Vite + React app
├── dist/           ← Build output (auto-generated)
├── Makefile        ← Orchestration
├── .github/        ← CI/CD (GitHub Pages deploy)
└── README.md
```

- **Landing page** — Two large cards linking to News and Jobs sections
- **News section** — Headlines from BBC, CNN, Al Jazeera, NYT, Washington Post, Reuters, Euronews
- **Jobs section** — Software engineering roles from Amazon, Google, HERE Technologies, Mastercard
- **Unified dark/light theme** — Toggle in the top nav

## Features

- **Modular crawl module** — Separation of concerns: config (pure data), utils (helpers), logging, crawling (fetch + parse), processing (filter + transform), storage (output)
- **Unified crawl module** — Single `main.ts` runs all news + job crawlers in parallel via `Promise.all`
- **Dual logger** — Winston writes to separate `news.log` and `jobs.log` simultaneously
- **Dedicated log-to-JSON** — News gets filtering/dedup; jobs gets dedup
- **Single Vite app** — State-based page navigation (no React Router dependency)
- **Modular architecture** — Separation of concerns: types, hooks, utils, lib (business logic), components (presentation), pages (containers)
- **GitHub Pages deploy** — Scheduled every 4 hours + manual trigger
- **Dark/light theme** — Persistent across page switches via `localStorage`

## Local Development

```bash
# Build everything (crawl + UI)
make all

# Just crawl
cd crawl && yarn && yarn all

# Just build UI
cd ui && yarn && yarn dev       # dev server
cd ui && yarn && yarn build     # production build

# Clean
make clean
```

## Project Structure

### `crawl/`
| File | Purpose |
|------|---------|
| `src/store.ts` | TypeScript types (News, Job, Site, etc.) |
| `src/config.ts` | Backward-compat re-exports (new code imports from `config/`) |
| `src/config/` | Configuration submodules (`paths.ts`, `news-sites.ts`, `job-sites.ts`) |
| `src/utils/` | Shared pure utilities (`html.ts`, `url.ts`) |
| `src/logging/` | Winston logger setup (`logger.ts`, `index.ts`) |
| `src/crawling/` | Data collection layer (`http.ts`, `news/`, `jobs/`) |
| `src/processing/` | Data transformation (`blacklist.ts`, `news.ts`, `jobs.ts`) |
| `src/storage/` | File persistence (`json.ts`) |
| `src/main.ts` | Orchestrator — runs crawlers in parallel, writes timestamp |
| `src/log2json.ts` | Pipeline orchestrator — processes logs → JSON |
| `src/tox.ts` | Optional AI toxicity filter |
| `src/summ.ts` | Optional AI summarizer |

### `ui/`
| File | Purpose |
|------|---------|n| `index.html` | Landing page entry point |
| `src/App.tsx` | Application shell (theme + nav state + page routing) |
| `src/main.tsx` | Vite entry point |
| `src/types/` | Shared type definitions (NewsLog, JobLog, PageName, etc.) |
| `src/hooks/` | Custom hooks (useTheme, useNavigation, useNewsData, useJobsData, etc.) |
| `src/utils/` | Pure utilities (html parsing, date formatting, source helpers) |
| `src/lib/` | Business logic services (data fetching, dedup, sort, filter) |
| `src/components/layout/` | Layout components (NavBar, PageHeader, FilterBar) |
| `src/components/cards/` | Card components (NewsCard, JobCard, SourceBadge) |
| `src/components/modals/` | Modal components (NewsModal, JobModal, BaseModal) |
| `src/components/landing/` | Landing page component |
| `src/pages/` | Container components (NewsPage, JobsPage — wires hooks → components) |
| `src/App.css` | All styles (news + jobs + landing + nav) |

## CI/CD

The GitHub Action at `.github/workflows/deploy.yml`:
- Runs crawlers every 4 hours (schedule) or manually (`workflow_dispatch`)
- Builds the Vite UI after crawling
- Deploys `dist/` to GitHub Pages

## Tech Stack

- **Crawler:** TypeScript + Cheerio + Winston (Node.js)
- **UI:** React 19 + Vite 7 + Bulma
- **Deployment:** GitHub Pages
- **Build:** Makefile + tsx (for crawlers)
