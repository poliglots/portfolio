import "./App.css";
import NewsCard from "./NewsCard";
import JobCard from "./JobCard";
import { useState, useEffect } from "react";

// ─── Simple page state ────────────────────────────────────────────────────
let setCurrentPage: (p: "landing" | "news" | "jobs") => void = () => {};

function navigateTo(page: "landing" | "news" | "jobs") {
  setCurrentPage(page);
}

// ─── Data loaders ──────────────────────────────────────────────────────────
const newsDataPromise = fetch("./news.json").then((r) => r.json());
const jobsDataPromise = fetch("./jobs.json").then((r) => r.json());
const timeUrl = new URL("./time.json", import.meta.url).href;

// ─── App ───────────────────────────────────────────────────────────────────

function App() {
  const [page, set] = useState<"landing" | "news" | "jobs">("landing");
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  );
  const [timeData, setTimeData] = useState<any>(null);

  setCurrentPage = set;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch(timeUrl).then((r) => r.json()).then((d) => setTimeData(d));
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div id="page">
      <nav id="navbar">
        <a className="nav-brand" href="#" onClick={(e) => { e.preventDefault(); navigateTo("landing"); }}>
          polyglot.dev
        </a>
        <button
          className={`nav-tab${page === "news" ? " is-active" : ""}`}
          onClick={() => navigateTo("news")}
        >
          News
        </button>
        <button
          className={`nav-tab${page === "jobs" ? " is-active" : ""}`}
          onClick={() => navigateTo("jobs")}
        >
          Jobs
        </button>
        <span className="nav-updated">
          updated {timeData?.time?.split("GMT")[0].trim() ?? ''} UTC
        </span>
        <button className="nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "☾" : "☀"}
        </button>
      </nav>

      <div id="main">
        {page === "landing" && <LandingPage />}
        {page === "news" && <NewsSection />}
        {page === "jobs" && <JobsSection />}
      </div>
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────

function LandingPage() {
  return (
    <div id="landing">
      <h1 className="landing-title">polyglot.dev</h1>
      <p className="landing-subtitle">
        Real-time news aggregation and job market insights.
      </p>
      <div className="landing-cards">
        <div className="landing-card" onClick={() => navigateTo("news")}>
          <div className="landing-card-icon">📰</div>
          <h2 className="landing-card-title">News</h2>
          <p className="landing-card-desc">
            Aggregated headlines from BBC, CNN, Al Jazeera, NYT, Washington Post, Reuters, and Euronews.
          </p>
          <span className="landing-card-cta">View News →</span>
        </div>
        <div className="landing-card" onClick={() => navigateTo("jobs")}>
          <div className="landing-card-icon">💼</div>
          <h2 className="landing-card-title">Jobs</h2>
          <p className="landing-card-desc">
            Software engineering roles from Amazon, Google, HERE Technologies, and Mastercard.
          </p>
          <span className="landing-card-cta">View Jobs →</span>
        </div>
      </div>
    </div>
  );
}

// ─── News Section ──────────────────────────────────────────────────────────

function NewsSection() {
  const [filterBy, setFilterBy] = useState("");
  const [newsData, setNewsData] = useState<any[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    newsDataPromise.then((data: any[]) => {
      const seen = new Set<string>();
      const deduped = data.filter((item) => {
        if (!item.imageUrl) return true;
        if (seen.has(item.imageUrl)) return false;
        seen.add(item.imageUrl);
        return true;
      });
      const srcs = [...new Set(deduped.map((i: any) => i.level))].sort();
      setNewsData(deduped);
      setSources(srcs);
    });
  }, []);

  const filtered = newsData
    .sort((a: any, b: any) => {
      const hDiff = (b.isHeadline ? 1 : 0) - (a.isHeadline ? 1 : 0);
      return hDiff !== 0 ? hDiff : b.updatedAt.localeCompare(a.updatedAt);
    })
    .filter((item: any) => !filterBy || item.level.toLowerCase() === filterBy.toLowerCase());

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
        {filtered.map((newsLog: any, index: number) => {
          const headlineRank = newsLog.isHeadline ? rank++ : -1;
          return <NewsCard key={index} newsLog={newsLog} headlineRank={headlineRank} />;
        })}
      </div>
    </>
  );
}

// ─── Jobs Section ──────────────────────────────────────────────────────────

function JobsSection() {
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [techFilters, setTechFilters] = useState<string[]>([]);
  const [jobsData, setJobsData] = useState<any[]>([]);

  const TECH_STACKS = [
    "Python", "Java", "Go", "TypeScript", "JavaScript", "C++",
    "Rust", "Kotlin", "SQL", "AWS", "Kubernetes", "React", "Node.js", "ML", "AI",
  ];

  useEffect(() => {
    jobsDataPromise.then((data: any[]) => {
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
      .map((item: any) => item.location.split(",").at(-1)?.trim())
      .filter(Boolean) as string[]
  )].sort();

  const toggleSource = (src: string) =>
    setSourceFilters((prev) => (prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]));

  const filtered = jobsData
    .sort((a: any, b: any) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .filter((item: any) => {
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
        {filtered.map((job: any, index: number) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </>
  );
}

export default App;
