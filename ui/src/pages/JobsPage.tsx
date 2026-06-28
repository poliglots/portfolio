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
          <button className="filter-clear" onClick={() => { setSourceFilters([]); setLocationFilters([]); setTechFilters([]); }}>Clear all</button>
          <div className="filter-locations">
            {locations.slice(0, 6).map((loc) => (
              <button
                key={loc}
                className={`location-btn${locationFilters.includes(loc) ? " is-active" : ""}`}
                onClick={() => setLocationFilters((p) => p.includes(loc) ? p.filter((x) => x !== loc) : [...p, loc])}
              >
                {loc}
              </button>
            ))}
          </div>
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
