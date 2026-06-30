import { fetchHeadlines, type ParsedHeadline } from "./fetcher.ts";
import { logger } from "../../logging/index.ts";
import type { News } from "../../store.ts";

/**
 * Crawl a single news site and log results.
 * Orchestrates fetcher → parser → logging.
 */
export async function readNewsSite(site: { url: string }): Promise<void> {
  // We need the full site config (with selectors), so the caller
  // passes the Site object from news-sites.ts
}

/**
 * Full signature: reads headlines from a site and logs them.
 */
export async function readNews(site: {
  url: string;
  headLineLinkTag: string;
  headLineTextTag: string;
  followLinkTextTag: string;
  updatedAtTag: string;
  updateAtAttribute: string;
  headers: Record<string, string>;
  headlineCount?: number;
}): Promise<void> {
  try {
    const headlines = await fetchHeadlines(site as Parameters<typeof fetchHeadlines>[0]);

    for (const h of headlines) {
      const news: News = h;
      logger.info("", news);
    }
  } catch (error) {
    console.error(`Error reading ${site.url}:`, error);
  }
}
