// ── Date & time formatting utilities ──────────────────────────────────────

export function formatDate(isoString: string): string {
  return new Date(isoString).toDateString();
}

export function formatDateLong(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get the current UTC timestamp for display in the nav bar.
 */
export function getUtcTime(): string {
  return new Date().toUTCString();
}
