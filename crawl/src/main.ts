import { readNews } from "./crawling/news/index.ts";
import { crawlAwsJobs } from "./crawling/jobs/aws.ts";
import { crawlGoogleJobs } from "./crawling/jobs/google.ts";
import { crawlIcimsJobs } from "./crawling/jobs/icims.ts";
import { crawlMastercardJobs } from "./crawling/jobs/mastercard.ts";
import { NEWS_SITES } from "./config/news-sites.ts";
import { writeTime } from "./storage/json.ts";

/**
 * Orchestrator: runs all crawlers in parallel, then writes timestamp.
 */
async function main() {
  // Run all news crawlers in parallel
  const newsPromises = NEWS_SITES.map((site) => readNews(site));

  // Run all job crawlers in parallel
  const jobPromises = [
    crawlAwsJobs(),
    crawlGoogleJobs(),
    crawlIcimsJobs(),
    crawlMastercardJobs(),
  ];

  await Promise.all([...newsPromises, ...jobPromises]);
  writeTime();
  console.log("All crawlers completed.");
}

await main();
