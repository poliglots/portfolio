import { load } from "cheerio";
import fs from "node:fs";
import readline from "node:readline";
import type { NewsLog } from "../store.ts";
import { NEWS_TEXT_FILE, NEWS_JSON_FILE } from "../config/paths.ts";
import { isHeadlineGarbage, isParaGarbage, isUrlBlacklisted } from "./blacklist.ts";

/**
 * Transform raw HTML paragraphs into clean text, filtering garbage.
 */
export function transformParagraphs(newsPara: string): string {
  const $ = load(newsPara);
  const paragraphs = $("p");
  return paragraphs
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((para) => !isParaGarbage(para))
    .join(" ");
}

/**
 * Truncate text to a summary snippet (first N sentences).
 */
export function truncateToSnippet(text: string, sentenceCount: number): string {
  return text
    .split(".")
    .slice(0, sentenceCount)
    .join(". ")
    .concat(".");
}

/**
 * Process news log file → filter → deduplicate → write JSON.
 */
export async function processNewsLog(
  filePath: string = NEWS_TEXT_FILE,
  jsonFilePath: string = NEWS_JSON_FILE
): Promise<void> {
  const logArray: NewsLog[] = [];

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      const newsLog: NewsLog = JSON.parse(line);
      newsLog.level = newsLog.link.split(".")[1] ?? "Unknown";
      newsLog.details = transformParagraphs(newsLog.details);
      newsLog.message = truncateToSnippet(newsLog.details, 4);

      // Apply filters
      if (isHeadlineGarbage(newsLog.headline)) continue;
      if (newsLog.details.length <= 300) continue;
      if (isUrlBlacklisted(newsLog.link)) continue;

      logArray.push(newsLog);
    }

    // Deduplicate by headline (keep first occurrence)
    const uniqueLogs = logArray.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.headline === obj.headline)
    );

    fs.writeFileSync(jsonFilePath, JSON.stringify(uniqueLogs, null, 2));
  } catch (error) {
    console.error("Error processing news logs:", error);
  }
}
