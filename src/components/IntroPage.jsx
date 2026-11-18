export default function IntroPage({ onOpen, theme, onThemeChange }) {
  return (
    <main className="intro" id="home">
      <header className="intro-top">
        <a className="wordmark" href="#home" aria-label="Austine Agunda home">AA<span>.</span></a>
        <span className="intro-location">NAIROBI, KENYA</span>
        <button className="theme-toggle" type="button" onClick={onThemeChange} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          {theme === "dark" ? "☼" : "☾"}
        </button>
      </header>

      <section className="intro-card" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="eyebrow"><span className="status-dot" /> A SHORT INTRODUCTION</p>
          <h1 id="intro-title">Austine<br />Agunda<span className="heading-period">.</span></h1>
          <p className="intro-role">Growth &amp; Data Analyst <span>·</span> Statistician</p>
          <p className="intro-summary">I connect statistics, customer insight, and thoughtful digital experiences to help turn data into clear next steps.</p>
          <div className="intro-actions">
            <button className="button button-dark" type="button" onClick={onOpen}>My Story <span aria-hidden="true">↗</span></button>
            <a className="button button-light" href="/cv/Austine_Agunda_CV_Data_Analyst.pdf" download>Download CV <span aria-hidden="true">↓</span></a>
          </div>
          <div className="intro-contact">
            <a href="mailto:agundaaustine@yahoo.com">agundaaustine@yahoo.com</a>
            <a href="tel:+254707835758">+254 707 835 758</a>
          </div>
        </div>
        <aside className="intro-art" aria-label="Data, growth, and people">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-star" aria-hidden="true">✳</div>
          <div className="art-monogram" aria-hidden="true">A<span>.</span></div>
          <div className="art-caption"><span>CURIOUS BY NATURE.</span><span>PRACTICAL BY DESIGN.</span></div>
          <span className="art-coordinate">DATA · GROWTH · PEOPLE</span>
        </aside>
      </section>

      <footer className="intro-footer">
        <span>STATISTICS · ANALYSIS · DIGITAL EXPERIENCES</span>
        <div className="social-links">
          <a href="https://github.com/agunda99" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://linkedin.com/in/austine_agunda" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </footer>
    </main>
  );
}
