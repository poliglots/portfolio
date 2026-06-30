import { useState, useEffect } from "react";

/**
 * Generic hook for loading data from a fetcher promise.
 */
export function useDataFetcher<T>(fetcher: () => Promise<T>): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetcher().then((result) => setData(result));
  }, [fetcher]);

  return data;
}
