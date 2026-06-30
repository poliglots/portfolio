import fs from "node:fs";
import readline from "node:readline";
import type { JobLog } from "../store.ts";
import { JOBS_TEXT_FILE, JOBS_JSON_FILE } from "../config/paths.ts";
import { truncateToSnippet } from "./news.ts";

/**
 * Process jobs log file → validate → deduplicate → write JSON.
 */
export async function processJobsLog(
  filePath: string = JOBS_TEXT_FILE,
  jsonFilePath: string = JOBS_JSON_FILE
): Promise<void> {
  const logArray: JobLog[] = [];

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const jobLog: JobLog = JSON.parse(line);
        jobLog.level = jobLog.source ?? "unknown";
        jobLog.message = truncateToSnippet(jobLog.description, 3);

        // Validate: must have id and title
        if (jobLog.id && jobLog.title) {
          logArray.push(jobLog);
        }
      } catch {
        console.warn("Skipping malformed log line");
      }
    }

    // Deduplicate by id (keep first occurrence)
    const uniqueLogs = logArray.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.id === obj.id)
    );

    fs.writeFileSync(jsonFilePath, JSON.stringify(uniqueLogs, null, 2));
  } catch (error) {
    console.error("Error processing jobs logs:", error);
  }
}
