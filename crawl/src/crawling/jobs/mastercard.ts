import { fetchHtml } from "../http.ts";
import { logger } from "../../logging/index.ts";
import { clean } from "../../utils/html.ts";
import type { Job } from "../../store.ts";
import { parseMastercardRaw } from "./parsers.ts";
import { MASTERCARD_SEARCH_URL } from "../../config/job-sites.ts";

const MASTERCARD_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html",
};

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

/**
 * Extract JSON from Mastercard's embedded page payload.
 * The HTML contains a JSON blob starting with '{"status":200'; we parse it by
 * tracking brace depth.
 */
function extractMastercardJson(html: string): { jobs: Record<string, unknown>[]; totalHits: number } {
  const start = html.indexOf('{"status":200');
  if (start < 0) return { jobs: [], totalHits: 0 };

  const content = html.slice(start);
  let depth = 0;
  let end = 0;

  for (let i = 0; i < content.length; i++) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  try {
    const json = JSON.parse(content.slice(0, end));
    return { jobs: json.data?.jobs ?? [], totalHits: json.totalHits ?? 0 };
  } catch {
    return { jobs: [], totalHits: 0 };
  }
}

/**
 * Crawl Mastercard jobs listing pages.
 */
export async function crawlMastercardJobs(): Promise<void> {
  const PAGE_SIZE = 10;
  const MAX_PAGES = DEBUG_MODE ? 1 : 10;

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE;
    const url =
      page === 0
        ? MASTERCARD_SEARCH_URL
        : `${MASTERCARD_SEARCH_URL}?from=${from}&s=1`;

    const html = await fetchHtml(url, { headers: MASTERCARD_HEADERS });
    if (!html) break;

    const { jobs: rawJobs, totalHits } = extractMastercardJson(html);
    if (rawJobs.length === 0) break;

    console.log(
      `Mastercard page ${page + 1}: ${rawJobs.length} jobs (${totalHits} total)`
    );

    for (const raw of rawJobs) {
      const parsed = parseMastercardRaw(raw as {
        jobId?: string;
        title?: string;
        descriptionTeaser?: string;
        cityStateCountry?: string;
        location?: string;
        applyUrl?: string;
        postedDate?: string;
      });
      const job: Job = {
        ...parsed,
        id: parsed.id || "",
        source: "mastercard",
      };
      logger.info("", job);
    }

    if (from + PAGE_SIZE >= totalHits) break;
  }
}
