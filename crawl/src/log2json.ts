import fs from "node:fs";
import readline from "node:readline";
import { type NewsLog, type JobLog } from "./store.ts";
import {
  NEWS_JSON_FILE,
  NEWS_TEXT_FILE,
  JOBS_JSON_FILE,
  JOBS_TEXT_FILE,
} from "./config.ts";
import { BlackListedWords, BlackListURLs } from "./filterList.ts";
import { load } from "cheerio";

// ── News: transform + filter log → JSON ─────────────────────────────────────

async function isHeadlineGarbage(news: NewsLog) {
  for (const word in BlackListedWords) {
    if (news.headline.includes(word)) return true;
  }
  return false;
}

async function isParaGarbage(para: string) {
  for (const word in BlackListedWords) {
    if (para.includes(word)) return true;
  }
  if (para.length < 100) return true;
  return false;
}

async function transformPara(news_para: string) {
  let final_para = "";
  const $ = load(news_para);
  let paragraphs = $("p");
  for (const paragraph of paragraphs) {
    let para = $(paragraph).text().trim();
    if (!(await isParaGarbage(para))) {
      final_para = final_para.concat(para);
    }
  }
  return final_para;
}

async function processNewsLog(
  filePath: string,
  jsonFilePath: string
): Promise<void> {
  const logArray: NewsLog[] = [];
  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    for await (const line of rl) {
      let newsLog: NewsLog = JSON.parse(line);
      newsLog.level = newsLog.link.split(".")[1] ?? "Unknown";
      newsLog.details = await transformPara(newsLog.details);
      newsLog.message = newsLog.details
        .split(".")
        .slice(0, 4)
        .join(". ")
        .concat(".");
      if (
        !(await isHeadlineGarbage(newsLog)) &&
        newsLog.details.length > 300 &&
        !BlackListURLs.some((item) => newsLog.link.includes(item))
      ) {
        logArray.push(newsLog);
      }
    }
    const uniqueLogs = logArray.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.headline === obj.headline)
    );
    fs.writeFileSync(jsonFilePath, JSON.stringify(uniqueLogs, null, 2));
  } catch (error) {
    console.error("Error in parsing/writing news logs:", error);
  }
}

// ── Jobs: transform + dedup log → JSON ──────────────────────────────────────

async function processJobsLog(
  filePath: string,
  jsonFilePath: string
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
        jobLog.message = jobLog.description
          .split(".")
          .slice(0, 3)
          .join(".")
          .concat(".");
        if (jobLog.id && jobLog.title) {
          logArray.push(jobLog);
        }
      } catch {
        console.warn("Skipping malformed log line");
      }
    }
    const uniqueLogs = logArray.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.id === obj.id)
    );
    fs.writeFileSync(jsonFilePath, JSON.stringify(uniqueLogs, null, 2));
  } catch (error) {
    console.error("Error in parsing/writing jobs logs:", error);
  }
}

// ── Entry ───────────────────────────────────────────────────────────────────

await processNewsLog(NEWS_TEXT_FILE, NEWS_JSON_FILE);
await processJobsLog(JOBS_TEXT_FILE, JOBS_JSON_FILE);
console.log("Log-to-JSON conversion complete.");
