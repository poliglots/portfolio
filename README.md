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

- **Unified crawl module** — Single `main.ts` runs all news + job crawlers in parallel via `Promise.all`
- **Dual logger** — Winston writes to separate `news.log` and `jobs.log` simultaneously
- **Dedicated log-to-JSON** — News gets filtering/dedup; jobs gets dedup
- **Single Vite app** — State-based page navigation (no React Router dependency)
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
| `src/config.ts` | News sites + job source URLs |
| `src/store.ts` | TypeScript types (News, Job, etc.) |
| `src/logger.ts` | Dual Winston loggers (news + jobs) |
| `src/main.ts` | Parallel crawlers (news + all 4 job sources) |
| `src/log2json.ts` | Transform logs → filtered/deduped JSON |
| `src/filterList.ts` | News headline blacklist |
| `src/tox.ts` | Optional AI toxicity filter |
| `src/summ.ts` | Optional AI summarizer |

### `ui/`
| File | Purpose |
|------|---------|
| `index.html` | Landing page entry point |
| `src/App.tsx` | Main app with landing/news/jobs pages |
| `src/pages/` | (Merged into App.tsx — no separate files needed) |
| `src/NewsCard.tsx` | News article card component |
| `src/JobCard.tsx` | Job listing card component |
| `src/NewsModal.tsx` | Full article reader modal |
| `src/JobModal.tsx` | Job detail modal |
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
