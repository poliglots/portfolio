import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import type { NewsLog } from "../../../crawl/src/store";

const newsDataPromise = fetch("./news.json").then((r) => r.json());

function NewsPage() {
  const [filterBy, setFilterBy] = useState("");
  const [newsData, setNewsData] = useState<NewsLog[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    newsDataPromise.then((data: NewsLog[]) => {
      const seen = new Set<string>();
      const deduped = data.filter((item) => {
        if (!item.imageUrl) return true;
        if (seen.has(item.imageUrl)) return false;
        seen.add(item.imageUrl);
        return true;
      });
      const srcs = [...new Set(deduped.map((i) => i.level))].sort();
      setNewsData(deduped);
      setSources(srcs);
    });
  }, []);

  const filtered = newsData
    .sort((a, b) => {
      const hDiff = (b.isHeadline ? 1 : 0) - (a.isHeadline ? 1 : 0);
      return hDiff !== 0 ? hDiff : b.updatedAt.localeCompare(a.updatedAt);
    })
    .filter((item) => !filterBy || item.level.toLowerCase() === filterBy.toLowerCase());

  let rank = 0;

  return (
    <>
      <div id="filter-bar">
        <div className="filter-sources">
          <button
            className={`source-all${filterBy === "" ? " is-active" : ""}`}
            onClick={() => setFilterBy("")}
          >
            All
          </button>
          {sources.map((s) => (
            <button
              key={s}
              className={`source-btn${filterBy === s ? " is-active" : ""}`}
              onClick={() => setFilterBy(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div id="news-grid">
        {filtered.map((newsLog, index) => {
          const headlineRank = newsLog.isHeadline ? rank++ : -1;
          return <NewsCard key={index} newsLog={newsLog} headlineRank={headlineRank} />;
        })}
      </div>
    </>
  );
}

export default NewsPage;
