import { load } from "cheerio";
import type { Site } from "../../store.ts";
import { fetchHtml } from "../http.ts";
import { parseArticle, type ArticleContent } from "./parser.ts";
import { normalizeUrl } from "../../utils/url.ts";

/**
 * A parsed news headline entry ready for logging.
 */
export interface ParsedHeadline {
  link: string;
  headline: string;
  details: string;
  updatedAt: string;
  imageUrl: string;
  isHeadline: boolean;
}

/**
 * Fetch a news source page and extract headlines.
 * For each valid headline, fetches the full article page.
 */
export async function fetchHeadlines(site: Site): Promise<ParsedHeadline[]> {
  const page = await fetchHtml(site.url, { headers: site.headers });
  if (!page) return [];

  const $ = load(page);
  const headlineElements = $(site.headLineLinkTag);
  const results: ParsedHeadline[] = [];
  const headlineCount = site.headlineCount ?? 3;

  for (const el of headlineElements) {
    const headline = $(el).find(site.headLineTextTag).text().trim();
    if (headline.length <= 50) continue;

    const link = $(el).attr("href");
    const absoluteUrl = normalizeUrl(link, site.url);

    const { full_story, updatedAt, imageUrl } = await parseArticle(absoluteUrl, site);
    if (!full_story) continue;

    results.push({
      link: absoluteUrl,
      headline,
      details: full_story,
      updatedAt: new Date(updatedAt).toISOString(),
      imageUrl,
      isHeadline: results.length < headlineCount,
    });
  }

  return results;
}
