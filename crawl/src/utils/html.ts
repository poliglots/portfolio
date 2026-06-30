// ── HTML utility functions ─────────────────────────────────────────────────

/**
 * Normalize a value to a clean string (no newlines/tabs, trimmed).
 */
export function clean(s: unknown): string {
  return String(s ?? "").replace(/[\n\r\t]/g, " ").trim();
}

/**
 * Strip HTML tags and normalize whitespace.
 */
export function stripHtml(s: string): string {
  return clean(s.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " "));
}
