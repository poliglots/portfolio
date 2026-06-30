import type { PageName } from "../../types";

interface LandingPageProps {
  navigateTo: (page: PageName) => void;
  utcTime?: string;
}

/**
 * Landing page with feature cards.
 */
export default function LandingPage({ navigateTo }: LandingPageProps) {
  return (
    <div id="landing">
      <div className="landing-eyebrow">
        <span className="nav-updated-dot" />
        Live aggregation
      </div>
      <h1 className="landing-title">polyglot.dev</h1>
      <p className="landing-subtitle">
        Real-time news aggregation and job market intelligence — curated from
        the world's top sources in one unified feed.
      </p>
      <div className="landing-cards">
        <div className="landing-card" onClick={() => navigateTo("news")}>
          <div className="landing-card-icon">📰</div>
          <h2 className="landing-card-title">News Intelligence</h2>
          <p className="landing-card-desc">
            Headlines from BBC, CNN, Al Jazeera, NYT, Washington Post, Reuters,
            and Euronews — deduplicated and ranked by importance.
          </p>
          <span className="landing-card-cta">Explore News →</span>
        </div>
        <div className="landing-card" onClick={() => navigateTo("jobs")}>
          <div className="landing-card-icon">💼</div>
          <h2 className="landing-card-title">Job Market Watch</h2>
          <p className="landing-card-desc">
            Software engineering roles from Amazon, Google, HERE Technologies,
            and Mastercard — filtered by tech stack, location, and more.
          </p>
          <span className="landing-card-cta">Browse Jobs →</span>
        </div>
      </div>
    </div>
  );
}
