import { load } from "cheerio";
import vm from "node:vm";
import { type Site, type News, type Job } from "./store.ts";
import siteList, {
  TIME_JSON_FILE,
  AWS_JOBS_BASE_URL,
  AWS_JOBS_SEARCH_URL,
  GOOGLE_JOBS_BASE_URL,
  GOOGLE_JOBS_URL,
  ICIMS_SEARCH_URL,
  MASTERCARD_SEARCH_URL,
} from "./config.ts";
import { logger } from "./logger.ts";
import { writeFileSync } from "node:fs";

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

async function readNews(site: Site) {
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

// ── Job Crawlers ────────────────────────────────────────────────────────────

// AWS
async function crawlAwsJobs() {
  try {
    const count = DEBUG_MODE ? "10" : "100";
    const params = new URLSearchParams({
      base_query: "",
      job_count: count,
      result_limit: count,
      sort: "recent",
    });
    params.append("category[]", "software-development");
    const res = await fetch(`${AWS_JOBS_SEARCH_URL}?${params}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    for (const raw of data.jobs ?? []) {
      const job: Job = {
        id: String(raw.id_icims ?? ""),
        source: "aws",
        title: clean(raw.title),
        company: clean(raw.company_name) || "Amazon Web Services",
        location: clean(raw.location),
        description: clean(raw.description_short),
        jobDescription: clean(raw.description),
        basicQualifications: clean(raw.basic_qualifications),
        preferredQualifications: clean(raw.preferred_qualifications),
        url: `${AWS_JOBS_BASE_URL}${raw.job_path}`,
        postedAt: raw.posted_date
          ? new Date(raw.posted_date).toISOString()
          : new Date().toISOString(),
      };
      logger.info("", job);
    }
  } catch (error) {
    console.error("Error crawling AWS jobs:", error);
  }
}

// Google
function logGoogleRaw(raw: any) {
  const id = String(raw[0] ?? "");
  const descHtml: string = raw[10]?.[1] ?? "";
  const job: Job = {
    id,
    source: "google",
    title: clean(raw[1]),
    company: clean(raw[7]) || "Google",
    location: clean(raw[9]?.[0]?.[0]),
    description: stripHtml(descHtml).slice(0, 250),
    jobDescription: clean(descHtml),
    basicQualifications: clean(raw[3]?.[1] ?? ""),
    preferredQualifications: clean(raw[4]?.[1] ?? ""),
    url: `${GOOGLE_JOBS_BASE_URL}/${id}`,
    postedAt: raw[12]?.[0]
      ? new Date(raw[12][0] * 1000).toISOString()
      : new Date().toISOString(),
  };
  logger.info("", job);
}

async function fetchGooglePage(page: number): Promise<any[]> {
  const url = `${GOOGLE_JOBS_URL}&page=${page}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
  });
  const html = await res.text();
  const scriptMatch = html.match(
    /<script class="ds:1"[^>]*>([\s\S]+?)<\/script>/
  );
  if (!scriptMatch) return [];
  let captured: any = null;
  const ctx = vm.createContext({
    AF_initDataCallback: (obj: any) => {
      captured = obj;
    },
  });
  vm.runInContext(scriptMatch[1], ctx);
  return captured?.data?.[0] ?? [];
}

async function crawlGoogleJobs() {
  const MAX_PAGES = DEBUG_MODE ? 1 : 10;
  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const rawJobs = await fetchGooglePage(page);
      if (rawJobs.length === 0) break;
      console.log(`Google page ${page}: ${rawJobs.length} jobs`);
      for (const raw of rawJobs) logGoogleRaw(raw);
    } catch (error) {
      console.error(`Error crawling Google jobs page ${page}:`, error);
      break;
    }
  }
}

// HERE (iCIMS)
const ICIMS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html",
};

async function fetchIcimsDetail(
  url: string
): Promise<
  Pick<Job, "jobDescription" | "basicQualifications" | "preferredQualifications">
> {
  try {
    const res = await fetch(url, { headers: ICIMS_HEADERS });
    const $ = load(await res.text());
    const sections: Record<string, string> = {};
    $("h2.iCIMS_InfoField_Job").each((_, el) => {
      const title = $(el).text().trim().toLowerCase();
      const content = clean($(el).next("div.iCIMS_InfoMsg_Job").html() ?? "");
      sections[title] = content;
    });
    return {
      jobDescription:
        sections["what's the role?"] ?? Object.values(sections)[0] ?? "",
      basicQualifications:
        sections["who are you?"] ?? Object.values(sections)[1] ?? "",
      preferredQualifications:
        sections["who are we?"] ?? Object.values(sections)[2] ?? "",
    };
  } catch {
    return {
      jobDescription: "",
      basicQualifications: "",
      preferredQualifications: "",
    };
  }
}

async function crawlIcimsPage(
  startIndex: number
): Promise<{ jobs: Job[]; hasMore: boolean }> {
  const url = `${ICIMS_SEARCH_URL}&in_iframe=1&startindex=${startIndex}`;
  const res = await fetch(url, { headers: ICIMS_HEADERS });
  const $ = load(await res.text());
  const cards = $("li.iCIMS_JobCardItem").toArray();
  const jobs: Job[] = [];
  for (const card of cards) {
    const $c = $(card);
    const anchor = $c.find("a.iCIMS_Anchor");
    const rawUrl = anchor.attr("href") ?? "";
    const detailUrl = rawUrl.includes("in_iframe=1")
      ? rawUrl
      : `${rawUrl}&in_iframe=1`;
    const publicUrl = rawUrl.replace(/[?&]in_iframe=1/, "");
    const idMatch = rawUrl.match(/\/jobs\/(\d+)\//);
    const id = idMatch?.[1] ?? "";
    if (!id) continue;
    const title = clean($c.find(".col-xs-12.title h3").text());
    const location = clean(
      $c.find(".col-xs-6.header.left span").not(".sr-only").text()
    );
    const description = clean($c.find(".col-xs-12.description").text()).slice(
      0,
      250
    );
    const detail = await fetchIcimsDetail(detailUrl);
    jobs.push({
      id,
      source: "here",
      title,
      company: "HERE Technologies",
      location,
      description,
      url: publicUrl,
      postedAt: new Date().toISOString(),
      ...detail,
    });
  }
  const pageText = $("h2.iCIMS_SubHeader_Jobs").text();
  const match = pageText.match(/Page (\d+) of (\d+)/);
  const hasMore = match
    ? Number(match[1]) < Number(match[2])
    : false;
  return { jobs, hasMore };
}

async function crawlIcimsJobs() {
  const PAGE_SIZE = 20;
  const MAX_PAGES = DEBUG_MODE ? 1 : 10;
  let startIndex = 0;
  try {
    while (startIndex < MAX_PAGES * PAGE_SIZE) {
      const { jobs, hasMore } = await crawlIcimsPage(startIndex);
      console.log(
        `HERE page startindex=${startIndex}: ${jobs.length} jobs`
      );
      for (const job of jobs) logger.info("", job);
      if (!hasMore) break;
      startIndex += PAGE_SIZE;
    }
  } catch (error) {
    console.error("Error crawling HERE jobs:", error);
  }
}

// Mastercard
function extractMastercardJson(
  html: string
): { jobs: any[]; totalHits: number } {
  const start = html.indexOf('{"status":200');
  if (start < 0) return { jobs: [], totalHits: 0 };
  const content = html.slice(start);
  let depth = 0,
    end = 0;
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

async function crawlMastercardJobs() {
  const PAGE_SIZE = 10;
  const MAX_PAGES = DEBUG_MODE ? 1 : 10;
  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const from = page * PAGE_SIZE;
      const url =
        page === 0
          ? MASTERCARD_SEARCH_URL
          : `${MASTERCARD_SEARCH_URL}?from=${from}&s=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      });
      const { jobs: rawJobs, totalHits } = extractMastercardJson(
        await res.text()
      );
      if (rawJobs.length === 0) break;
      console.log(
        `Mastercard page ${page + 1}: ${rawJobs.length} jobs (${totalHits} total)`
      );
      for (const raw of rawJobs) {
        const jobUrl = (raw.applyUrl ?? "").replace(/\/apply$/, "");
        const job: Job = {
          id: clean(raw.jobId),
          source: "mastercard",
          title: clean(raw.title),
          company: "Mastercard",
          location: clean(raw.cityStateCountry ?? raw.location),
          description: clean(raw.descriptionTeaser),
          jobDescription: clean(raw.descriptionTeaser),
          basicQualifications: "",
          preferredQualifications: "",
          url: jobUrl || `${MASTERCARD_SEARCH_URL}`,
          postedAt: raw.postedDate
            ? new Date(raw.postedDate).toISOString()
            : new Date().toISOString(),
        };
        logger.info("", job);
      }
      if (from + PAGE_SIZE >= totalHits) break;
    }
  } catch (error) {
    console.error("Error crawling Mastercard jobs:", error);
  }
}

// ── Timestamp Writer ────────────────────────────────────────────────────────

async function writeTime() {
  try {
    writeFileSync(TIME_JSON_FILE, `{"time":"${new Date()}"}`);
  } catch {
    console.log("error in writing time");
  }
}

// ── Entry ───────────────────────────────────────────────────────────────────

async function main() {
  // Run news and job crawlers in parallel
  const [sites] = await Promise.all([siteList()]);

  // Run all news crawlers in parallel
  const newsPromises = sites.map((site) => readNews(site));

  // Run all job crawlers in parallel
  const jobPromises = [
    crawlAwsJobs(),
    crawlGoogleJobs(),
    crawlIcimsJobs(),
    crawlMastercardJobs(),
  ];

  await Promise.all([...newsPromises, ...jobPromises]);
  await writeTime();
  console.log("All crawlers completed.");
}

await main();
