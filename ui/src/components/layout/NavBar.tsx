import type { PageName, Theme } from "../../types";

interface NavBarProps {
  currentPage: PageName;
  navigateTo: (page: PageName) => void;
  theme: Theme;
  toggleTheme: () => void;
  utcTime?: string;
}

/**
 * Top navigation bar.
 */
export default function NavBar({
  currentPage,
  navigateTo,
  theme,
  toggleTheme,
  utcTime,
}: NavBarProps) {
  const showTime = currentPage !== "landing" && utcTime;

  return (
    <nav id="navbar">
      <a
        className="nav-brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigateTo("landing");
        }}
      >
        <span className="nav-brand-icon">p</span>
        polyglot.dev
      </a>
      <span className="nav-divider" />
      <div className="nav-tab-group">
        {(["landing", "news", "jobs"] as PageName[]).map((page) => (
          <button
            key={page}
            className={`nav-tab${currentPage === page ? " is-active" : ""}`}
            onClick={() => navigateTo(page)}
          >
            {page === "landing" ? "Home" : page === "news" ? "News" : "Jobs"}
          </button>
        ))}
      </div>
      {showTime && (
        <>
          <span className="nav-updated">
            <span className="nav-updated-dot" />
            {utcTime} UTC
          </span>
        </>
      )}
      <button className="nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? "☾" : "☀"}
      </button>
    </nav>
  );
}
