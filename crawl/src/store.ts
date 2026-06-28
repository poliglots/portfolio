// ── News Types ──────────────────────────────────────────────────────────────

export interface Site {
  url: string;
  headLineLinkTag: string;
  headLineTextTag: string;
  followLinkTextTag: string;
  headers: Record<string, string>;
  updatedAtTag: string;
  updateAtAttribute: string;
  headlineCount?: number;
}

export interface News {
  link: string;
  headline: string;
  details: string;
  updatedAt: string;
  imageUrl?: string;
  isHeadline?: boolean;
}

export interface NewsLog extends News {
  level: string;
  message: string;
}

// ── Job Types ───────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  source?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobDescription?: string;
  basicQualifications?: string;
  preferredQualifications?: string;
  url: string;
  postedAt: string;
}

export interface JobLog extends Job {
  level: string;
  message: string;
}
