import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import type { JobLog } from "../../../crawl/src/store";

const jobsDataPromise = fetch("./jobs.json").then((r) => r.json());

const TECH_STACKS = [
  "Python", "Java", "Go", "TypeScript", "JavaScript", "C++",
  "Rust", "Kotlin", "SQL", "AWS", "Kubernetes", "React", "Node.js", "ML", "AI",
];

function JobsPage() {
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [techFilters, setTechFilters] = useState<string[]>([]);
  const [jobsData, setJobsData] = useState<JobLog[]>([]);

  useEffect(() => {
    jobsDataPromise.then((data: JobLog[]) => {
      const seen = new Set<string>();
      const deduped = data.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      setJobsData(deduped);
    });
  }, []);

  const locations = [...new Set(
    jobsData
      .map((item) => item.location.split(",").at(-1)?.trim())
      .filter(Boolean) as string[]
  )].sort();

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const toggleSource = (src: string) =>
    setSourceFilters((prev) => (prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]));

  const filtered = jobsData
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .filter((item) => {
      if (sourceFilters.length > 0 && !sourceFilters.includes(item.level)) return false;
      if (locationFilters.length > 0 && !locationFilters.some((l) => item.location.toLowerCase().includes(l.toLowerCase()))) return false;
      if (techFilters.length > 0) {
        const haystack = [item.title, item.description, item.jobDescription ?? "", item.basicQualifications ?? "", item.preferredQualifications ?? ""].join(" ").toLowerCase();
        if (!techFilters.some((t) => haystack.includes(t.toLowerCase()))) return false;
      }
      return true;
    });

  return (
    <>
      <div id="page-header">
        <h1 className="page-title">Job Market Watch</h1>
        <p className="page-subtitle">
          {filtered.length} roles · {locations.length} locations · {sourceFilters.length || [...new Set(jobsData.map(i => i.level))].length} companies
        </p>
      </div>
      <div id="filter-bar">
        <div className="filter-tags">
          {sourceFilters.map((s) => (
            <span key={s} className="filter-tag">
              {s} <button className="filter-tag-x" onClick={() => toggleSource(s)}>✕</button>
            </span>
          ))}
          {locationFilters.map((l) => (
            <span key={l} className="filter-tag">
              {l} <button className="filter-tag-x" onClick={() => setLocationFilters((p) => p.filter((x) => x !== l))}>✕</button>
            </span>
          ))}
          {techFilters.map((t) => (
            <span key={t} className="filter-tag">
              {t} <button className="filter-tag-x" onClick={() => setTechFilters((p) => p.filter((x) => x !== t))}>✕</button>
            </span>
          ))}
        </div>
        <div className="filter-actions">
          <div className="filter-section">
            <label className="filter-section-label">Source</label>
            <div className="filter-level">
              {[...new Set(jobsData.map((i) => i.level))].sort().map((level) => (
                <button
                  key={level}
                  className={`source-btn${sourceFilters.includes(level) ? " is-active" : ""}`}
                  onClick={() => setSourceFilters((p) => p.includes(level) ? p.filter((x) => x !== level) : [...p, level])}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-divider" />
          <div className="filter-section">
            <label className="filter-section-label">Location</label>
            <div className="filter-location-wrapper">
              <input
                className="location-search"
                type="text"
                placeholder="Search locations..."
                value={locationSearch}
                onFocus={() => setLocationDropdownOpen(true)}
                onChange={(e) => { setLocationSearch(e.target.value); setLocationDropdownOpen(true); }}
                onBlur={() => setTimeout(() => setLocationDropdownOpen(false), 200)}
              />
              {locationFilters.length > 0 && (
                <button
                  className="location-clear-all"
                  onClick={() => setLocationFilters([])}
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
                        setLocationFilters((p) => p.includes(loc) ? p.filter((x) => x !== loc) : [...p, loc]);
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
            {/* selected pills shown below wrapper */}
            {locationFilters.length > 0 && (
              <div className="location-pills">
                {locationFilters.map((l) => (
                  <span key={l} className="location-pill">
                    {l}
                    <button
                      className="location-pill-x"
                      onClick={() => setLocationFilters((p) => p.filter((x) => x !== l))}
                    >✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="filter-divider" />
          <div className="filter-section">
            <label className="filter-section-label">Tech Stack</label>
            <div className="filter-tech">
              {TECH_STACKS.map((tech) => (
                <button
                  key={tech}
                  className={`tech-pill${techFilters.includes(tech) ? " is-active" : ""}`}
                  onClick={() => setTechFilters((p) => p.includes(tech) ? p.filter((x) => x !== tech) : [...p, tech])}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-clear-wrap">
            <button className="filter-clear" onClick={() => { setSourceFilters([]); setLocationFilters([]); setTechFilters([]); }}>Clear all</button>
          </div>
        </div>
      </div>
      <div id="jobs-grid">
        {filtered.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </>
  );
}

export default JobsPage;
