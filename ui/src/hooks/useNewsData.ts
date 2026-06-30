import { useState, useEffect, useMemo } from "react";
import type { NewsLog } from "../../../crawl/src/store";
import { fetchNewsData } from "../lib/dataService";
import {
  deduplicateNews,
  rankHeadlines,
  extractSources,
  filterBySource,
} from "../lib/newsService";

interface UseNewsDataReturn {
  newsData: NewsLog[];
  sources: string[];
  rankedHeadlines: { item: NewsLog; rank: number }[];
  sourceFilter: string;
  setSourceFilter: (s: string) => void;
  filteredAndRanked: { item: NewsLog; rank: number }[];
}

/**
 * Loads, deduplicates, ranks headlines, and manages source filtering for news.
 */
export function useNewsData(): UseNewsDataReturn {
  const [rawData, setRawData] = useState<NewsLog[]>([]);
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    fetchNewsData().then((data) => {
      const parsed = data as NewsLog[];
      setRawData(parsed);
    });
  }, []);

  const sources = useMemo(() => extractSources(rawData), [rawData]);

  const deduped = useMemo(() => deduplicateNews(rawData), [rawData]);

  const rankedHeadlines = useMemo(
    () => rankHeadlines(deduped),
    [deduped]
  );

  const filteredData = useMemo(
    () => filterBySource(deduped, sourceFilter),
    [deduped, sourceFilter]
  );

  // Re-rank headlines within the filtered set
  const filteredAndRanked = useMemo(() => rankHeadlines(filteredData), [filteredData]);

  return {
    newsData: filteredData,
    sources,
    rankedHeadlines,
    sourceFilter,
    setSourceFilter,
    filteredAndRanked,
  };
}
