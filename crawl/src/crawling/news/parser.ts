import { load } from "cheerio";
import { type Site } from "../../store.ts";
import { fetchHtml } from "../http.ts";

/**
 * Parse a news article page and extract:
 * - Full story paragraphs (concatenated)
 * - Publish/update timestamp
 * - OG image URL
 */
export interface ArticleContent {
  full_story: string;
  updatedAt: string;
  imageUrl: string;
}

export async function parseArticle(url: string, site: Site): Promise<ArticleContent> {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const page = await fetchHtml(url, { headers: site.headers });
  if (!page) {
    return { full_story: "", updatedAt: twoDaysAgo.toISOString(), imageUrl: "" };
  }

  const $ = load(page);
  const updatedAt = parseUpdatedAt($, site) ?? twoDaysAgo.toDateString();
  const imageUrl = $('meta[property="og:image"]').attr("content") ?? "";

  // Collect paragraphs
  const paragraphs = $(site.followLinkTextTag);
  const full_story = paragraphs
    .map((_, el) => {
      const text = $(el).text().trim();
      return text ? `<p>${text}</p>` : "";
    })
    .get()
    .join("");

  return { full_story, updatedAt, imageUrl };
}

function parseUpdatedAt($: ReturnType<typeof load>, site: Site): string | undefined {
  if (site.updateAtAttribute === "text") {
    return $(site.updatedAtTag).text();
  }
  return $(site.updatedAtTag).attr(site.updateAtAttribute);
}
