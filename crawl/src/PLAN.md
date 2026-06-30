# Crawl Module Restructuring — Separation of Concerns

## Current Problems
1. **Config file is a god object** — mixes file paths, news site configs, job site URLs all in one file
2. **Duplicated utilities** — `clean`, `stripHtml` defined in main.ts, news.ts, and jobs.ts
3. **main.ts orchestrates too much** — parallelism, task collection, timestamp writing
4. **log2json.ts mixes parsing + filtering + dedup + writing** in one function
5. **Tox.ts and Summ.ts** are standalone scripts with no shared structure
6. **No clear boundary** between crawling (data collection), processing (transformation), and output (storage)
7. **Blacklist logic scattered** — filterList.ts imported by log2json, but `isHeadlineGarbage` / `isParaGarbage` defined inline

## Target Structure
```
crawl/src/
├── store.ts                        # type definitions (unchanged)
├── config.ts                       # file paths only (extracted)
├── main.ts                         # entry: orchestrates crawlers + log2json (simplified)
├── config/                         # configuration data (pure)
│   ├── paths.ts                    # NEWS_TEXT_FILE, JOBS_TEXT_FILE, etc.
│   ├── news-sites.ts               # news site crawler configs (Site[])
│   └── job-sites.ts                # job site URL constants
├── utils/                          # shared pure utilities
│   ├── html.ts                     # clean, stripHtml
│   └── url.ts                      # URL normalization helpers
├── logging/                        # logging layer
│   ├── index.ts                    # re-export newsLogger, jobsLogger, combined logger
│   └── logger.ts                   # Winston setup
├── crawling/                       # data collection (fetch + parse)
│   ├── types.ts                    # crawler-specific types (CrawlResult, etc.)
│   ├── http.ts                     # HTTP client wrapper (fetch with headers, retries)
│   ├── news/                       # news crawling
│   │   ├── fetcher.ts              # fetch + parse single news page
│   │   ├── parser.ts               # extract headlines, paragraphs, images from HTML
│   │   └── index.ts                # readNews(site) — orchestrates fetcher + parser
│   └── jobs/                       # job crawling
│       ├── aws.ts                  # crawlAwsJobs
│       ├── google.ts               # crawlGoogleJobs (with vm context parsing)
│       ├── icims.ts                # crawlIcimsJobs (HERE Technologies)
│       ├── mastercard.ts           # crawlMastercardJobs
│       └── parsers.ts              # shared job extraction from raw data
├── processing/                     # data transformation
│   ├── blacklist.ts                # BlackListedWords, BlackListURLs (extracted)
│   ├── news.ts                     # transform + filter + dedup news logs
│   └── jobs.ts                     # transform + dedup job logs
├── storage/                        # data persistence
│   ├── logger.ts                   # log-to-file via Winston (moved from logging/)
│   └── json.ts                     # write JSON files
├── log2json.ts                     # entry: orchestrates processing pipeline
├── tox.ts                          # optional toxicity filter (unchanged entry point)
└── summ.ts                         # optional summarizer (unchanged entry point)
```

## Separation of Concerns Map
| Layer | Responsibility |
|-------|---------------|
| **config/** | Pure configuration data — no imports from src |
| **utils/** | Pure utility functions — no dependencies |
| **logging/** | Winston logger setup — file transports |
| **crawling/** | Fetch HTML, parse DOM, extract structured data |
| **processing/** | Blacklist filtering, dedup, text transformation |
| **storage/** | Writing logs and JSON output files |
| **main.ts** | Orchestrator — runs crawlers in parallel, then log2json |
| **log2json.ts** | Orchestrator — reads logs, processes, writes JSON |

## Task List
- [x] 1. Create `config/` — extract paths, news-sites, job-sites
- [x] 2. Create `utils/` — html, url helpers
- [x] 3. Refactor `logging/` — split logger setup (logger.ts + index.ts)
- [x] 4. Create `crawling/` — http client, news fetcher/parser, job crawlers (aws, google, icims, mastercard)
- [x] 5. Create `processing/` — blacklist, news transform, jobs transform
- [x] 6. Create `storage/` — file output helpers (writeTime, writeJson)
- [x] 7. Simplify `main.ts` — orchestrator only (~20 lines)
- [x] 8. Refactor `log2json.ts` — pipeline orchestrator (~10 lines)
- [x] 9. Verify build + crawl runs correctly ✓ (0 TypeScript errors)
