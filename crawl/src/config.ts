import type { Site } from "./store.ts";

// ── File Paths ──────────────────────────────────────────────────────────────

export const NEWS_TEXT_FILE = "../dist/news.log";
export const NEWS_JSON_FILE = "../dist/news.json";
export const JOBS_TEXT_FILE = "../dist/jobs.log";
export const JOBS_JSON_FILE = "../dist/jobs.json";
export const TIME_JSON_FILE = "../dist/time.json";

// ── News Site Config ────────────────────────────────────────────────────────

export default async function siteList(): Promise<Site[]> {
  let sites: Site[] = [
    {
      url: "https://edition.cnn.com",
      headLineLinkTag: "a",
      headLineTextTag: "span.container__headline-text",
      followLinkTextTag: "p",
      updatedAtTag: "span[data-last-publish]",
      updateAtAttribute: "data-last-publish",
      headlineCount: 3,
      headers: {},
    },
    {
      url: "https://www.bbc.com",
      headLineLinkTag: "a",
      headLineTextTag: "h2",
      followLinkTextTag: "p",
      updatedAtTag: "time[datetime]",
      updateAtAttribute: "datetime",
      headlineCount: 3,
      headers: {},
    },
    {
      url: "https://www.aljazeera.com",
      headLineLinkTag: "a",
      headLineTextTag: "span",
      followLinkTextTag: "p",
      updatedAtTag: "div.date-simple > span[aria-hidden]",
      updateAtAttribute: "text",
      headlineCount: 3,
      headers: {},
    },
    {
      url: "https://www.washingtonpost.com",
      headLineLinkTag: "a",
      headLineTextTag: "span",
      followLinkTextTag: "p",
      updatedAtTag: "time[datetime]",
      updateAtAttribute: "datetime",
      headlineCount: 3,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
        Host: "www.washingtonpost.com",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    },
    {
      url: "https://www.euronews.com",
      headLineLinkTag: "a",
      headLineTextTag: "h2",
      followLinkTextTag: ".c-article-content p",
      updatedAtTag: "time[datetime]",
      updateAtAttribute: "datetime",
      headlineCount: 3,
      headers: {},
    },
    {
      url: "https://www.reuters.com",
      headLineLinkTag: "a",
      headLineTextTag: "span",
      followLinkTextTag: "div.text-module__text__0GDob",
      updatedAtTag: "time[datetime]",
      updateAtAttribute: "datetime",
      headlineCount: 3,
      headers: {},
    },
    {
      url: "https://www.nytimes.com",
      headLineLinkTag: "a",
      headLineTextTag: "p",
      followLinkTextTag: "p",
      updatedAtTag: "time[datetime]",
      updateAtAttribute: "datetime",
      headlineCount: 3,
      headers: {},
    },
  ];

  return sites;
}

// ── Job Site Config ────────────────────────────────────────────────────────

export const AWS_JOBS_BASE_URL = "https://www.amazon.jobs";
export const AWS_JOBS_SEARCH_URL = "https://www.amazon.jobs/en/search.json";

export const GOOGLE_JOBS_URL =
  "https://www.google.com/about/careers/applications/jobs/results?sort_by=date&q=%22Software%20Engineer%22";
export const GOOGLE_JOBS_BASE_URL =
  "https://www.google.com/about/careers/applications/jobs/results";

export const ICIMS_SEARCH_URL =
  "https://careers-here.icims.com/jobs/search?ss=1&searchKeyword=Software+Engineer";

export const MASTERCARD_SEARCH_URL =
  "https://careers.mastercard.com/us/en/search-results";
