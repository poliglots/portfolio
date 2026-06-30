/**
 * HTTP client wrapper for crawlers.
 * Handles fetch with headers and basic error logging.
 */

export interface FetchOptions {
  headers?: Record<string, string>;
}

/**
 * Fetch a URL and return the HTML/text response.
 * Logs errors but does not throw.
 */
export async function fetchHtml(url: string, options?: FetchOptions): Promise<string | null> {
  const init: RequestInit = {};
  if (options?.headers) init.headers = options.headers;
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`HTTP ${res.status} fetching ${url}`);
      return null;
    }
    return await res.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Fetch a URL and parse the response as JSON.
 * Logs errors but returns null on failure.
 */
export async function fetchJson<T>(url: string, options?: FetchOptions): Promise<T | null> {
  const init: RequestInit = {};
  if (options?.headers) init.headers = options.headers;
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`HTTP ${res.status} fetching JSON from ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error fetching JSON from ${url}:`, error);
    return null;
  }
}
