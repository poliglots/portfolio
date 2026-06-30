import type { JobLog } from "../../../crawl/src/store";

/**
 * Deduplicate jobs by id.
 */
export function deduplicateJobs(items: JobLog[]): JobLog[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * Sort jobs by postedAt descending (newest first).
 */
export function sortJobs(items: JobLog[]): JobLog[] {
  return [...items].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

/**
 * Extract unique locations from a jobs dataset.
 */
export function extractLocations(items: JobLog[]): string[] {
  return [
    ...new Set(
      items
        .map((item) => item.location.split(",").at(-1)?.trim())
        .filter((loc): loc is string => !!loc)
    ),
  ].sort();
}

/**
 * Extract unique source names from a jobs dataset.
 */
export function extractSources(items: JobLog[]): string[] {
  return [...new Set(items.map((i) => i.level))].sort();
}

/**
 * Filter jobs by sources, locations, and tech stack.
 */
export function filterJobs(
  items: JobLog[],
  options: {
    sourceFilters?: string[];
    locationFilters?: string[];
    techFilters?: string[];
  }
): JobLog[] {
  const { sourceFilters = [], locationFilters = [], techFilters = [] } = options;

  return items.filter((item) => {
    // Source filter
    if (sourceFilters.length > 0 && !sourceFilters.includes(item.level)) return false;

    // Location filter
    if (locationFilters.length > 0) {
      const locationMatch = locationFilters.some((l) =>
        item.location.toLowerCase().includes(l.toLowerCase())
      );
      if (!locationMatch) return false;
    }

    // Tech stack filter — search across title, description, qualifications
    if (techFilters.length > 0) {
      const haystack = [
        item.title,
        item.description,
        item.jobDescription ?? "",
        item.basicQualifications ?? "",
        item.preferredQualifications ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!techFilters.some((t) => haystack.includes(t.toLowerCase()))) return false;
    }

    return true;
  });
}
