import "./App.css";
import NewsPage from "./pages/NewsPage";
import JobsPage from "./pages/JobsPage";
import { useState, useEffect } from "react";

// ─── Simple page state ────────────────────────────────────────────────────
let setCurrentPage: (p: "landing" | "news" | "jobs") => void = () => {};

function navigateTo(page: "landing" | "news" | "jobs") {
  setCurrentPage(page);
}

// ─── Data loaders ──────────────────────────────────────────────────────────
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
        {page === "news" && <NewsPage />}
        {page === "jobs" && <JobsPage />}
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





export default App;
