import { load } from "cheerio";
import { type Site, type News, type Job } from "./store.ts";
import { logger } from "./logger.ts";

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

// ── Utility ─────────────────────────────────────────────────────────────────

const clean = (s: unknown) =>
  String(s ?? "").replace(/[\n\r\t]/g, " ").trim();

const stripHtml = (s: string) =>
  clean(s.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " "));

// ── News Crawler ────────────────────────────────────────────────────────────

async function getNewsParagraphs(url: string, site: Site) {
  let full_story = "";
  let updatedAt = "";
  let imageUrl = "";
  const today = new Date();
  let twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  try {
    let res = await fetch(url, { headers: site.headers });
    let page = await res.text();
    let $ = load(page);
    if (site.updateAtAttribute === "text") {
      updatedAt = $(site.updatedAtTag).text();
    } else {
      updatedAt =
        $(site.updatedAtTag).attr(site.updateAtAttribute) ??
        twoDaysAgo.toDateString();
    }
    imageUrl = $('meta[property="og:image"]').attr("content") ?? "";
    let paragraphs = $(site.followLinkTextTag);
    for (const paragraph of paragraphs) {
      let para = $(paragraph).text().trim();
      full_story = full_story.concat(`<p>${para}</p>`);
    }
  } catch (error) {
    console.error(`Error in reading ${url} - `, error);
  } finally {
    return { full_story, updatedAt, imageUrl };
  }
}

export async function readNews(site: Site) {
  try {
    let counter = 0;
    let res = await fetch(site.url, { headers: site.headers });
    let page = await res.text();
    let $ = load(page);
    let headlines = $(site.headLineLinkTag);
    for (const headlineElement of headlines) {
      if (counter >= 1 && DEBUG_MODE === true) {
        break;
      }
      let headline = $(headlineElement)
        .find(site.headLineTextTag)
        .text()
        .trim();
      let link = $(headlineElement).attr("href");
      if (headline.length > 50) {
        let navLink = "";
        if (
          link?.includes(site.url) ||
          link?.includes("https") ||
          link?.includes("http")
        ) {
          navLink = link;
        } else {
          navLink = `${site.url}${link}`;
        }
        let { full_story, updatedAt, imageUrl } = await getNewsParagraphs(
          navLink,
          site
        );
        let news: News = {
          link: `${navLink}`,
          headline: `${headline}`,
          details: `${full_story}`,
          updatedAt: new Date(updatedAt).toISOString(),
          imageUrl,
          isHeadline: counter < (site.headlineCount ?? 3),
        };
        logger.info("", news);
        counter++;
      }
    }
  } catch (error) {
    console.error(`Error in reading ${site.url} - `, error);
  }
}
