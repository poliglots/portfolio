import type { Site } from "../store.ts";

/**
 * Configuration for each news source.
 * Defines CSS selectors and fetch settings per site.
 */
export const NEWS_SITES: Site[] = [
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
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv=144.0) Gecko/20100101 Firefox/144.0",
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
