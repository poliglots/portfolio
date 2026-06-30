import { load } from "cheerio";
import { fetchHtml } from "../http.ts";
import { logger } from "../../logging/index.ts";
import { clean } from "../../utils/html.ts";
import type { Job } from "../../store.ts";
import { ICIMS_SEARCH_URL } from "../../config/job-sites.ts";

const ICIMS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html",
};

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

/**
 * Fetch detailed job info from an iCIMS detail page.
 */
async function fetchIcimsDetail(url: string): Promise<{
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
}> {
  try {
    const html = await fetchHtml(url, { headers: ICIMS_HEADERS });
    if (!html) return { jobDescription: "", basicQualifications: "", preferredQualifications: "" };

    const $ = load(html);
    const sections: Record<string, string> = {};

    $("h2.iCIMS_InfoField_Job").each((_, el) => {
      const title = $(el).text().trim().toLowerCase();
      const content = clean($(el).next("div.iCIMS_InfoMsg_Job").html() ?? "");
      sections[title] = content;
    });

    return {
      jobDescription: sections["what's the role?"] ?? Object.values(sections)[0] ?? "",
      basicQualifications: sections["who are you?"] ?? Object.values(sections)[1] ?? "",
      preferredQualifications: sections["who are we?"] ?? Object.values(sections)[2] ?? "",
    };
  } catch {
    return { jobDescription: "", basicQualifications: "", preferredQualifications: "" };
  }
}

/**
 * Parse a single iCIMS job card from the list page.
 */
async function parseJobCard(html: string): Promise<Job | null> {
  const $c = load(html);
  const anchor = $c("a.iCIMS_Anchor");
  const rawUrl = anchor.attr("href") ?? "";
  if (!rawUrl) return null;

  const detailUrl = rawUrl.includes("in_iframe=1") ? rawUrl : `${rawUrl}&in_iframe=1`;
  const publicUrl = rawUrl.replace(/[?&]in_iframe=1/, "");
  const idMatch = rawUrl.match(/\/jobs\/(\d+)\//);
  const id = idMatch?.[1] ?? "";
  if (!id) return null;

  const title = clean($c(".col-xs-12.title h3").text());
  const location = clean(
    $c(".col-xs-6.header.left span").not(".sr-only").text()
  );
  const description = clean($c(".col-xs-12.description").text()).slice(0, 250);

  const detail = await fetchIcimsDetail(detailUrl);

  return {
    id,
    source: "here",
    title,
    company: "HERE Technologies",
    location,
    description,
    url: publicUrl,
    postedAt: new Date().toISOString(),
    ...detail,
  };
}

/**
 * Crawl HERE Technologies (iCIMS) job listing pages.
 */
export async function crawlIcimsJobs(): Promise<void> {
  const PAGE_SIZE = 20;
  const MAX_PAGES = DEBUG_MODE ? 1 : 5;

  for (let page = 0; page < MAX_PAGES; page++) {
    const startIndex = page * PAGE_SIZE;
    const url = `${ICIMS_SEARCH_URL}&in_iframe=1&startindex=${startIndex}`;
    const html = await fetchHtml(url, { headers: ICIMS_HEADERS });
    if (!html) break;

    const $ = load(html);
    const cardElements = $("li.iCIMS_JobCardItem").toArray();
    const jobs: Job[] = [];

    for (const card of cardElements) {
      const html = $(card).prop("outerHTML") ?? "";
      const job = await parseJobCard(html);
      if (job) jobs.push(job);
    }

    console.log(`HERE page startindex=${startIndex}: ${jobs.length} jobs`);
    for (const job of jobs) logger.info("", job);

    // Check if there are more pages
    const pageText = $("h2.iCIMS_SubHeader_Jobs").text();
    const match = pageText.match(/Page (\d+) of (\d+)/);
    if (match && Number(match[1]) >= Number(match[2])) break;
  }
}
