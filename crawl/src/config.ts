// ── Backward-compatibility re-exports ───────────────────────────────────────
// New code should import directly from config/ submodules.

export {
  NEWS_TEXT_FILE,
  NEWS_JSON_FILE,
  JOBS_TEXT_FILE,
  JOBS_JSON_FILE,
  TIME_JSON_FILE,
} from "./config/paths.ts";

export { NEWS_SITES as defaultNewsSites } from "./config/news-sites.ts";
export {
  AWS_JOBS_BASE_URL,
  AWS_JOBS_SEARCH_URL,
  GOOGLE_JOBS_URL,
  GOOGLE_JOBS_BASE_URL,
  ICIMS_SEARCH_URL,
  MASTERCARD_SEARCH_URL,
} from "./config/job-sites.ts";

// Re-export types
export type { Site } from "./store.ts";
