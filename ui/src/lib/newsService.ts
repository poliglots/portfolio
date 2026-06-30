import type { NewsLog } from "../../../crawl/src/store";

/**
 * Deduplicate news items by imageUrl.
 * Items without imageUrl are kept as-is.
 */
export function deduplicateNews(items: NewsLog[]): NewsLog[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.imageUrl) return true;
    if (seen.has(item.imageUrl)) return false;
    seen.add(item.imageUrl);
    return true;
  });
}

/**
 * Sort news: headlines first (by priority), then by updatedAt descending.
 */
export function sortNews(items: NewsLog[]): NewsLog[] {
  return [...items].sort((a, b) => {
    const hDiff = (b.isHeadline ? 1 : 0) - (a.isHeadline ? 1 : 0);
    return hDiff !== 0 ? hDiff : b.updatedAt.localeCompare(a.updatedAt);
  });
}

/**
 * Assign headline rank (0 = primary, 1 = secondary, 2+ = editorial).
 * Returns the sorted array with each item's position among headlines.
 */
export function rankHeadlines(items: NewsLog[]): { item: NewsLog; rank: number }[] {
  const sorted = sortNews(items);
  let headlineCount = 0;
  return sorted.map((item) => {
    if (item.isHeadline) {
      const rank = headlineCount++;
      return { item, rank };
    }
    return { item, rank: -1 };
  });
}

/**
 * Extract unique source names from a news dataset.
 */
export function extractSources(items: NewsLog[]): string[] {
  return [...new Set(items.map((i) => i.level))].sort();
}

/**
 * Filter news by source level.
 */
export function filterBySource(items: NewsLog[], sourceFilter: string): NewsLog[] {
  if (!sourceFilter) return items;
  return items.filter((item) => item.level.toLowerCase() === sourceFilter.toLowerCase());
}
