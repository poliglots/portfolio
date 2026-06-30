import PageHeader from "../components/layout/PageHeader";
import FilterBar from "../components/layout/FilterBar";
import JobCard from "../components/cards/JobCard";
import { useJobsData, TECH_STACKS } from "../hooks/useJobsData";

function JobsPage() {
  const {
    locations,
    sources,
    sourceFilters,
    locationFilters,
    techFilters,
    locationSearch,
    locationDropdownOpen,
    setLocationSearch,
    setLocationDropdownOpen,
    filtered,
    filteredLocations,
    toggleSource,
    toggleLocation,
    toggleTech,
    clearAllFilters,
  } = useJobsData();

  return (
    <>
      <PageHeader
        title="Job Market Watch"
        subtitle={`${filtered.length} roles · ${locations.length} locations · ${sourceFilters.length || sources.length} companies`}
      />
      <FilterBar>
        {/* Active filter tags */}
        <div className="filter-tags">
          {sourceFilters.map((s) => (
            <span key={s} className="filter-tag">
              {s} <button className="filter-tag-x" onClick={() => toggleSource(s)}>✕</button>
            </span>
          ))}
          {locationFilters.map((l) => (
            <span key={l} className="filter-tag">
              {l} <button className="filter-tag-x" onClick={() => toggleLocation(l)}>✕</button>
            </span>
          ))}
          {techFilters.map((t) => (
            <span key={t} className="filter-tag">
              {t} <button className="filter-tag-x" onClick={() => toggleTech(t)}>✕</button>
            </span>
          ))}
        </div>

        <div className="filter-actions">
          {/* Source filter */}
          <div className="filter-section">
            <label className="filter-section-label">Source</label>
            <div className="filter-level">
              {sources.map((level) => (
                <button
                  key={level}
                  className={`source-btn${sourceFilters.includes(level) ? " is-active" : ""}`}
                  onClick={() => toggleSource(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          {/* Location filter */}
          <div className="filter-section">
            <label className="filter-section-label">Location</label>
            <div className="filter-location-wrapper">
              <input
                className="location-search"
                type="text"
                placeholder="Search locations..."
                value={locationSearch}
                onFocus={() => setLocationDropdownOpen(true)}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setLocationDropdownOpen(true);
                }}
                onBlur={() => setTimeout(() => setLocationDropdownOpen(false), 200)}
              />
              {locationFilters.length > 0 && (
                <button
                  className="location-clear-all"
                  onClick={() => locationFilters.forEach((l) => toggleLocation(l))}
                  title="Clear all locations"
                >✕</button>
              )}
              <div className={`location-dropdown${locationDropdownOpen ? " visible" : ""}`}>
                {filteredLocations.length === 0 ? (
                  <div className="location-dropdown-empty">No locations found</div>
                ) : (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      className={`location-dropdown-item${locationFilters.includes(loc) ? " is-active" : ""}`}
                      onClick={() => {
                        toggleLocation(loc);
                        setLocationSearch("");
                        setLocationDropdownOpen(false);
                      }}
                    >
                      {locationFilters.includes(loc) && <span className="check-icon">✓</span>}
                      {loc}
                    </button>
                  ))
                )}
              </div>
            </div>
            {locationFilters.length > 0 && (
              <div className="location-pills">
                {locationFilters.map((l) => (
                  <span key={l} className="location-pill">
                    {l}
                    <button
                      className="location-pill-x"
                      onClick={() => toggleLocation(l)}
                    >✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="filter-divider" />

          {/* Tech stack filter */}
          <div className="filter-section">
            <label className="filter-section-label">Tech Stack</label>
            <div className="filter-tech">
              {TECH_STACKS.map((tech) => (
                <button
                  key={tech}
                  className={`tech-pill${techFilters.includes(tech) ? " is-active" : ""}`}
                  onClick={() => toggleTech(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-clear-wrap">
            <button className="filter-clear" onClick={clearAllFilters}>Clear all</button>
          </div>
        </div>
      </FilterBar>
      <div id="jobs-grid">
        {filtered.map((job) => (
          <JobCard key={`${job.id}-${job.postedAt}`} job={job} />
        ))}
      </div>
    </>
  );
}

export default JobsPage;
