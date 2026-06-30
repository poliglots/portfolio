// Re-export core data types from crawl module
export type { News, NewsLog, Job, JobLog } from "../../../crawl/src/store";

// ── Navigation ──────────────────────────────────────────────────────────────

export type PageName = "landing" | "news" | "jobs";

// ── Theme ───────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

// ── Modal Parameter Interfaces ──────────────────────────────────────────────

export interface NewsModalParams {
  isActive: boolean;
  onClose: () => void;
  source: string;
  headline: string;
  link: string;
  details: string;
  imageUrl?: string;
}

export interface JobModalParams {
  isActive: boolean;
  onClose: () => void;
  source: string;
  title: string;
  company: string;
  location: string;
  url: string;
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
}

// ── Card Props ──────────────────────────────────────────────────────────────

export interface NewsCardProps {
  newsLog: import("../../../crawl/src/store").NewsLog;
  headlineRank?: number;
}

export interface JobCardProps {
  job: import("../../../crawl/src/store").JobLog;
}

// ── Filter State ────────────────────────────────────────────────────────────

export interface NewsFilters {
  sourceFilter: string;
}

export interface JobsFilters {
  sourceFilters: string[];
  locationFilters: string[];
  techFilters: string[];
  locationSearch: string;
  locationDropdownOpen: boolean;
}
