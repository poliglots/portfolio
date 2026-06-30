# UI Restructuring Plan — Separation of Concerns

## Current Problems
1. **All logic in components** — pages do fetching, filtering, deduplication, sorting
2. **No shared types** — types imported from crawl module; modal interfaces duplicated
3. **Duplicate utilities** — `stripHtml` / `htmlToText` defined in multiple places
4. **Global state hack** — `setCurrentPage` assigned via side-effect in App
5. **Mixed concerns** — navigation + page routing + theming all in App.tsx
6. **No reusable abstractions** — filter logic, data loading, source badges scattered

## Target Structure
```
ui/src/
├── main.tsx                          # entry point (unchanged)
├── App.tsx                           # shell only: nav + theme + page routing
├── App.css                           # styles (unchanged)
├── types/                            # shared type definitions
│   ├── index.ts                      # re-exports + modal params
│   └── navigation.ts                 # navigation types
├── hooks/                            # custom hooks
│   ├── useTheme.ts                   # theme persistence
│   ├── useNavigation.ts              # page navigation
│   ├── useDataFetcher.ts             # generic JSON data loader
│   ├── useNewsData.ts                # news fetching + dedup + sort
│   ├── useJobsData.ts                # jobs fetching + dedup + sort
│   └── useFilters.ts                 # reusable filter logic
├── utils/                            # pure utility functions
│   ├── html.ts                       # htmlToText / stripHtml
│   ├── sources.ts                    # KNOWN_SOURCES / badge class helpers
│   └── formatting.ts                 # date formatting
├── components/                       # pure presentational components
│   ├── layout/
│   │   ├── Shell.tsx                  # <div id="page"> + <nav> + <main>
│   │   ├── NavBar.tsx                 # navigation bar
│   │   ├── PageHeader.tsx             # page title + subtitle
│   │   └── FilterBar.tsx              # shared filter bar
│   ├── cards/
│   │   ├── NewsCard.tsx               # card presentation only
│   │   ├── JobCard.tsx                # card presentation only
│   │   └── SourceBadge.tsx            # reusable source badge
│   ├── modals/
│   │   ├── BaseModal.tsx              # shared modal wrapper
│   │   ├── NewsModal.tsx              # news reader
│   │   └── JobModal.tsx               # job detail
│   └── landing/
│       └── LandingPage.tsx            # landing page cards
├── pages/                            # container (smart) components
│   ├── LandingPage.tsx                # landing + navigation trigger
│   ├── NewsPage.tsx                   # wires hooks → NewsCard
│   └── JobsPage.tsx                   # wires hooks → JobCard
└── lib/                              # business logic / services
    ├── dataService.ts                 # fetch wrappers for JSON
    └── newsService.ts                 # dedup + sort news
    └── jobsService.ts                 # dedup + sort jobs
```

## Separation of Concerns Map
| Layer | Responsibility |
|-------|---------------|
| **types/** | Shape of data, modal params, navigation state |
| **hooks/** | State management, side effects, derived data |
| **utils/** | Pure functions — no React, no state |
| **lib/** | Business logic — dedup, sort, filter algorithms |
| **components/** | Pure presentation — receives props, emits events |
| **pages/** | Container components — wires hooks → components |

## Task List
- [x] 1. Create `types/` — extract interfaces from crawl/store + modal params
- [x] 1. Create `types/` — extract interfaces from crawl/store + modal params
- [x] 2. Create `utils/` — html, sources, formatting
- [x] 3. Create `hooks/` — useTheme, useNavigation, useDataFetcher, useNewsData, useJobsData, useFilters
- [x] 4. Create `lib/` — dataService, newsService, jobsService
- [x] 5. Create `components/layout/` — NavBar, PageHeader, FilterBar
- [x] 6. Refactor `components/cards/` — NewsCard, JobCard (presentation-only)
- [x] 7. Create `components/modals/` — BaseModal, NewsModal, JobModal
- [x] 8. Create `components/landing/` — LandingPage
- [x] 9. Refactor `pages/` — wire hooks to components, remove business logic
- [x] 10. Simplify `App.tsx` — shell only, use hooks + Shell
- [x] 11. Verify build passes ✓ (0 errors)
