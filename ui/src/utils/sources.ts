// ── Source identification constants & helpers ──────────────────────────────

export const NEWS_SOURCES: string[] = ["bbc", "cnn", "euronews", "nytimes", "washingtonpost"];
export const JOB_SOURCES: string[] = ["aws", "google", "here", "mastercard"];
export const ALL_KNOWN_SOURCES = [...NEWS_SOURCES, ...JOB_SOURCES];

/**
 * Get the CSS class for a source badge.
 * Falls back to "default" if source is not in the known list.
 */
export function sourceBadgeClass(source: string): string {
  return ALL_KNOWN_SOURCES.includes(source) ? `source-${source}` : "source-default";
}

/**
 * Get the CSS class for a card background.
 * Falls back to "default" if source is not in the known list.
 */
export function cardClass(source: string): string {
  return ALL_KNOWN_SOURCES.includes(source) ? `card-${source}` : "card-default";
}
