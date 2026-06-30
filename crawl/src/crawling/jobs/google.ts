import { load } from "cheerio";
import vm from "node:vm";
import { fetchHtml } from "../http.ts";
import { logger } from "../../logging/index.ts";
import type { Job } from "../../store.ts";
import { parseGoogleRaw } from "./parsers.ts";
import { GOOGLE_JOBS_BASE_URL, GOOGLE_JOBS_URL } from "../../config/job-sites.ts";

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

/**
 * Extract the embedded job data from a Google Jobs HTML page.
 * Uses VM to run AF_initDataCallback in context.
 */
async function extractGoogleData(html: string): Promise<unknown[]> {
  const scriptMatch = html.match(/<script class="ds:1"[^>]*>([\s\S]+?)<\/script>/);
  if (!scriptMatch?.[1]) return [];

  let captured: unknown = null;
  const ctx = vm.createContext({
    AF_initDataCallback: (obj: unknown) => {
      captured = obj;
    },
  });
  vm.runInContext(scriptMatch[1], ctx);
  return (captured as any)?.data?.[0] ?? [];
}

/**
 * Fetch a single page of Google Jobs results.
 */
async function fetchGooglePage(page: number): Promise<unknown[]> {
  const url = `${GOOGLE_JOBS_URL}&page=${page}`;
  const html = await fetchHtml(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
  });
  if (!html) return [];
  return extractGoogleData(html);
}

/**
 * Crawl Google Jobs pages for software engineering roles.
 */
export async function crawlGoogleJobs(): Promise<void> {
  const MAX_PAGES = DEBUG_MODE ? 1 : 10;

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const rawJobs = await fetchGooglePage(page);
      if (rawJobs.length === 0) break;

      console.log(`Google page ${page}: ${rawJobs.length} jobs`);

      for (const raw of rawJobs) {
        if (!Array.isArray(raw)) continue;
        const parsed = parseGoogleRaw(raw);
        const job: Job = {
          ...parsed,
          id: parsed.id || String(raw[0] ?? ""),
          source: "google",
          url: `${GOOGLE_JOBS_BASE_URL}/${parsed.id}`,
        };
        logger.info("", job);
      }
    } catch (error) {
      console.error(`Error crawling Google jobs page ${page}:`, error);
      break;
    }
  }
}
