// ── Blacklist configuration ────────────────────────────────────────────────

export const BLACKLISTED_WORDS = [
  "AnalysisAnalysis",
  "Live Updates",
  "GalleryGallery",
  "VideoVideo",
  "Follow Al Jazeera",
  "Browse today's tags",
  "The BBC is not responsible for the content of external sites",
  "Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved.",
];

export const BLACKLISTED_URL_PATTERNS = ["video", "gallery", "photo", "image"];

/**
 * Check if a headline matches any blacklisted keyword.
 */
export function isHeadlineGarbage(headline: string): boolean {
  return BLACKLISTED_WORDS.some((word) => headline.includes(word));
}

/**
 * Check if a paragraph is garbage (matches blacklist or too short).
 */
export function isParaGarbage(para: string): boolean {
  if (BLACKLISTED_WORDS.some((word) => para.includes(word))) return true;
  if (para.length < 100) return true;
  return false;
}

/**
 * Check if a URL is blacklisted.
 */
export function isUrlBlacklisted(link: string): boolean {
  return BLACKLISTED_URL_PATTERNS.some((pattern) => link.includes(pattern));
}
