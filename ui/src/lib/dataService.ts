/**
 * Generic JSON data fetching service.
 * Wraps fetch with caching so multiple callers don't duplicate network requests.
 */

function createFetcher<T>(jsonPath: string) {
  let cache: Promise<T> | null = null;

  return () => {
    if (!cache) {
      cache = fetch(jsonPath).then((r) => r.json());
    }
    return cache;
  };
}

/** Fetch the news data JSON */
export const fetchNewsData = createFetcher<unknown>("./news.json");

/** Fetch the jobs data JSON */
export const fetchJobsData = createFetcher<unknown>("./jobs.json");

/** Fetch the time data JSON */
export const fetchTimeData = createFetcher<Record<string, string>>("./time.json");
