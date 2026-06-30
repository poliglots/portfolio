import "./App.css";
import { useTheme } from "./hooks/useTheme";
import { useNavigation } from "./hooks/useNavigation";
import { useDataFetcher } from "./hooks/useDataFetcher";
import { fetchTimeData } from "./lib/dataService";
import NavBar from "./components/layout/NavBar";
import LandingPage from "./components/landing/LandingPage";
import NewsPage from "./pages/NewsPage";
import JobsPage from "./pages/JobsPage";

/**
 * App is the application shell.
 * - Manages theme via useTheme hook
 * - Manages navigation via useNavigation hook
 * - Delegates page rendering to individual page components
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { currentPage, navigateTo } = useNavigation();
  const timeData = useDataFetcher(fetchTimeData);

  const utcTime = timeData
    ? Object.values(timeData)[0]?.split("GMT")[0].trim() ?? ""
    : undefined;

  const renderPage = () => {
    switch (currentPage) {
      case "news":
        return <NewsPage />;
      case "jobs":
        return <JobsPage />;
      case "landing":
      default:
        return <LandingPage navigateTo={navigateTo} utcTime={utcTime} />;
    }
  };

  return (
    <div id="page">
      <NavBar
        currentPage={currentPage}
        navigateTo={navigateTo}
        theme={theme}
        toggleTheme={toggleTheme}
        utcTime={utcTime}
      />
      <div id="main">{renderPage()}</div>
    </div>
  );
}
