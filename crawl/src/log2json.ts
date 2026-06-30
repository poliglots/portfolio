import { processNewsLog } from "./processing/news.ts";
import { processJobsLog } from "./processing/jobs.ts";

/**
 * Pipeline entry point: reads log files, transforms + filters, writes JSON.
 */
async function main() {
  await processNewsLog();
  await processJobsLog();
  console.log("Log-to-JSON conversion complete.");
}

await main();
