import PageHeader from "../components/layout/PageHeader";
import FilterBar from "../components/layout/FilterBar";
import NewsCard from "../components/cards/NewsCard";
import { useNewsData } from "../hooks/useNewsData";

function NewsPage() {
  const {
    sources,
    sourceFilter,
    setSourceFilter,
    filteredAndRanked,
  } = useNewsData();

  return (
    <>
      <PageHeader
        title="News Intelligence"
        subtitle={`${filteredAndRanked.length} stories · ${sources.length} sources · aggregated in real-time`}
      />
      <FilterBar>
        <div className="filter-sources">
          <button
            className={`source-all${sourceFilter === "" ? " is-active" : ""}`}
            onClick={() => setSourceFilter("")}
          >
            All Sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              className={`source-btn${sourceFilter === s ? " is-active" : ""}`}
              onClick={() => setSourceFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterBar>
      <div id="news-grid">
        {filteredAndRanked.map(({ item: newsLog, rank }) => (
          <NewsCard key={`${newsLog.link}-${newsLog.updatedAt}`} newsLog={newsLog} headlineRank={rank} />
        ))}
      </div>
    </>
  );
}

export default NewsPage;
