export default function PortfolioNavigation({ page, onNavigate, theme, onThemeChange }) {
  const links = [
    { page: "intro", label: "Intro", href: "#intro" },
    { page: "story", label: "Story", href: "#portfolio" },
    { page: "projects", label: "Projects", href: "#projects" },
    { page: "contact", label: "Contact", href: "#contact" },
  ];

  return (
    <header className="portfolio-nav">
      <a className="wordmark" href="#portfolio" aria-label="Austine Agunda story" onClick={(event) => { event.preventDefault(); onNavigate("story"); }}>AA<span>.</span></a>
      <nav aria-label="Portfolio navigation">
        {links.map((link) => (
          <a href={link.href} key={link.page} aria-current={page === link.page ? "page" : undefined} onClick={(event) => { event.preventDefault(); onNavigate(link.page); }}>{link.label}</a>
        ))}
      </nav>
      <a className="nav-download" href="/cv/Austine_Agunda_CV_Data_Analyst.pdf" download aria-label="Download Austine Agunda's CV">
        <span>Download CV</span><span className="nav-download-short">CV ↓</span>
      </a>
      <button className="theme-toggle" type="button" onClick={onThemeChange} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
        {theme === "dark" ? "☼" : "☾"}
      </button>
    </header>
  );
}
