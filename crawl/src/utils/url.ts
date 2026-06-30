// ── URL utility functions ──────────────────────────────────────────────────

/**
 * Normalize a headline link to an absolute URL.
 * If the link is already absolute or matches the base URL, return as-is.
 * Otherwise, prepend the base URL.
 */
export function normalizeUrl(link: string | undefined, baseUrl: string): string {
  if (!link) return baseUrl;
  if (link.includes(baseUrl) || link.startsWith("https") || link.startsWith("http")) {
    return link;
  }
  return `${baseUrl}${link}`;
}
