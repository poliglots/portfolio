import { fetchJson } from "../http.ts";
import { logger } from "../../logging/index.ts";
import type { Job } from "../../store.ts";
import { parseAwsRaw } from "./parsers.ts";
import { AWS_JOBS_BASE_URL, AWS_JOBS_SEARCH_URL } from "../../config/job-sites.ts";

const DEBUG_MODE = Boolean(process.env.DEBUG_MODE) || false;

/**
 * Crawl Amazon Jobs API for software development roles.
 */
export async function crawlAwsJobs(): Promise<void> {
  try {
    const count = DEBUG_MODE ? "10" : "100";
    const params = new URLSearchParams({
      base_query: "",
      job_count: count,
      result_limit: count,
      sort: "recent",
    });
    params.append("category[]", "software-development");

    const data = await fetchJson<{ jobs: Record<string, unknown>[] }>(
      `${AWS_JOBS_SEARCH_URL}?${params}`,
      { headers: { Accept: "application/json" } }
    );

    if (!data?.jobs) return;

    for (const raw of data.jobs) {
      const parsed = parseAwsRaw(raw);
      const job: Job = {
        ...parsed,
        id: parsed.id || String(raw.id_icims ?? ""),
        source: "aws",
        url: `${AWS_JOBS_BASE_URL}${raw.job_path}`,
      };
      logger.info("", job);
    }
  } catch (error) {
    console.error("Error crawling AWS jobs:", error);
  }
}
