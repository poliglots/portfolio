import { readNews } from "./news.ts";
import { crawlAwsJobs, crawlGoogleJobs, crawlIcimsJobs, crawlMastercardJobs } from "./jobs.ts";
import siteList, {
  TIME_JSON_FILE,
} from "./config.ts";
import { writeFileSync } from "node:fs";

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

// ── Utility ─────────────────────────────────────────────────────────────────

const clean = (s: unknown) =>
  String(s ?? "").replace(/[\n\r\t]/g, " ").trim();

const stripHtml = (s: string) =>
  clean(s.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " "));

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
