import { useEffect, useState } from "react";
import IntroPage from "./components/IntroPage.jsx";
import PortfolioShell from "./components/PortfolioShell.jsx";

function pageFromHash() {
  if (window.location.hash === "#projects") return "projects";
  if (window.location.hash === "#contact") return "contact";
  if (window.location.hash === "#portfolio" || window.location.hash === "#story") return "story";
  return "intro";
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const syncWithHistory = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncWithHistory);
    window.addEventListener("hashchange", syncWithHistory);
    return () => {
      window.removeEventListener("popstate", syncWithHistory);
      window.removeEventListener("hashchange", syncWithHistory);
    };
  }, []);

  function navigate(nextPage) {
    const hash = nextPage === "story" ? "#portfolio" : nextPage === "intro" ? "#intro" : `#${nextPage}`;
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  function toggleTheme() {
    setTheme((current) => current === "light" ? "dark" : "light");
  }

  return page === "intro"
    ? <IntroPage onOpen={() => navigate("story")} theme={theme} onThemeChange={toggleTheme} />
    : <PortfolioShell page={page} onNavigate={navigate} theme={theme} onThemeChange={toggleTheme} />;
}
