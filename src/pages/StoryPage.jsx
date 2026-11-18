import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import useScrollStory from "../hooks/useScrollStory.js";
import ScrollScene from "../scenes/ScrollScene.jsx";

const telemetry = [
  "01 / CHAOS · a million points, no map",
  "02 / COLLECTION · capture, filter, give it a home",
  "03 / ANALYSIS · question the pattern, not just the data",
  "04 / REVELATION · the signal becomes visible",
  "05 / INTERFACE · clarity, insight, action",
];

const glyphs = ["0", "1", "∑", "−", "1.4", "x²", "NULL", "↗", "%", "∅", "12:04", "0.08"];
const floatingGlyphs = Array.from({ length: 92 }, (_, index) => ({
  value: glyphs[(index * 7 + 3) % glyphs.length],
  left: `${(index * 53 + 7) % 98}%`,
  top: `${(index * 37 + 11) % 96}%`,
  delay: `${(index % 13) * -0.55}s`,
  duration: `${7 + (index % 8)}s`,
}));

const sourceRows = [
  { source: "Transactions", type: "DATABASE", count: "24,801 rows", color: "mint" },
  { source: "Customer notes", type: "SPREADSHEET", count: "1,204 entries", color: "amber" },
  { source: "Field surveys", type: "FORM DATA", count: "863 responses", color: "violet" },
];

const chartBars = [38, 51, 45, 63, 57, 76, 69, 89, 80, 100, 91, 73];

export default function StoryPage({ onNavigate }) {
  const { scrollState, activeSection } = useScrollStory();
  const [isPaused, setIsPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const isLight = activeSection >= 3;

  return (
    <main
      className={`story-page${isLight ? " is-light" : ""}${isPaused ? " is-motion-paused" : ""}`}
      data-scroll-progress={scrollState.current.progress}
      data-active-section={activeSection}
    >
      <div className="story-scene" aria-hidden="true">
        <Canvas
          dpr={[1, 1.4]}
          frameloop={isPaused ? "demand" : "always"}
          performance={{ min: 0.55 }}
          camera={{ position: [0, 0, 9], fov: 42 }}
        >
          <ScrollScene scrollState={scrollState} isPaused={isPaused} />
        </Canvas>
      </div>

      <div className="story-glyph-field" aria-hidden="true">
        {floatingGlyphs.map((glyph, index) => (
          <span
            key={index}
            style={{
              left: glyph.left,
              top: glyph.top,
              animationDelay: glyph.delay,
              animationDuration: glyph.duration,
              "--glyph-start-x": index % 2 ? "-24vw" : "24vw",
              "--glyph-start-y": index % 3 ? "-18vh" : "18vh",
            }}
          >
            {glyph.value}
          </span>
        ))}
      </div>

      <header className="story-topbar">
        <a className="story-brand" href="#portfolio" onClick={(event) => { event.preventDefault(); onNavigate?.("story"); }}>
          AA<span>.</span>
          <small>FIELD NOTES / 001</small>
        </a>
        <div className="story-live"><span /> THE SIGNAL IN THE NOISE</div>
        <button
          className="story-motion-toggle"
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-pressed={isPaused}
        >
          {isPaused ? "Resume motion" : "Pause motion"}
        </button>
      </header>

      <nav className="story-side-index" aria-label="Story chapters">
        {telemetry.map((_, index) => (
          <a
            key={index}
            href={`#section-${index + 1}`}
            aria-label={`Go to chapter ${index + 1}`}
            aria-current={activeSection === index ? "step" : undefined}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(`section-${index + 1}`)?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              });
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </a>
        ))}
      </nav>

      <section id="section-1" className="story-act story-act--noise story-act--prologue">
        <div className="story-act-copy">
          <p className="story-kicker story-reveal"><span>01</span> / THE PROLOGUE — CHAOS</p>
          <h1 className="story-reveal">The signal<br />in the <em>noise.</em></h1>
          <p className="story-lede story-reveal">
            Every Monday morning, drowning in a million scattered points. No context,
            no meaning. Just noise.
          </p>
          <div className="story-quote-card story-quote-card--fade story-reveal">
            <span>THE OPINION IS EASY. THE EVIDENCE IS THE WORK.</span>
            <blockquote>“Without data, you are just another person with an opinion.”</blockquote>
            <cite>— W. EDWARDS DEMING</cite>
          </div>
        </div>
        <div className="story-chaos-caption story-reveal"><i /> 2,222+ SIGNALS / 0 CONTEXT</div>
        <div className="story-scroll-cue"><span /> SCROLL TO FIND THE THREAD</div>
        <span className="story-orbit-word" aria-hidden="true">NOISE</span>
      </section>

      <section id="section-2" className="story-act story-act--method story-act--collection">
        <div className="story-act-copy story-act-copy--method">
          <p className="story-kicker story-reveal"><span>02</span> / THE COLLECTION — THE FILTER</p>
          <h2 className="story-reveal">I give the<br />fragments a <em>home.</em></h2>
          <p className="story-lede story-reveal">
            Not just watch. I capture, filter the noise, pull the scattered
            fragments into a structure &mdash; I give them a home.
          </p>
          <div className="story-data-progress story-reveal">
            <div><span>THE COLLECTION</span><b>STRUCTURING SIGNAL</b></div>
            <div className="story-progress-track"><i className="story-progress-fill" /></div>
            <small>DATABASE <span>·</span> SPREADSHEET <span>·</span> FIELD NOTES</small>
          </div>
        </div>

        <div className="story-workbench story-reveal" aria-label="Collected data sources">
          <div className="story-workbench-head">
            <span>INCOMING / 03 SOURCES</span>
            <span className="story-sync"><i /> CAPTURE ACTIVE</span>
          </div>
          <div className="story-source-list">
            {sourceRows.map((row) => (
              <div className="story-source-row" key={row.source}>
                <span className={`story-source-icon story-source-icon--${row.color}`} aria-hidden="true">
                  {row.color === "mint" ? "▦" : row.color === "amber" ? "▤" : "⌁"}
                </span>
                <span className="story-source-name">{row.source}<small>{row.type}</small></span>
                <span className="story-source-count">{row.count}</span>
                <span className="story-source-check" aria-label="collected">✓</span>
              </div>
            ))}
          </div>
          <div className="story-collection-footer">
            <div className="story-db-cylinder" aria-hidden="true"><i /><i /><i /></div>
            <div><b>ONE TRUSTED HOME</b><span>Validated · joined · ready to question</span></div>
            <span className="story-db-count">26,868+<br /><small>RECORDS</small></span>
          </div>
        </div>
      </section>

      <section id="section-3" className="story-act story-act--analysis">
        <div className="story-analysis-copy">
          <p className="story-kicker story-reveal"><span>03</span> / THE TORTURE — THE ANALYSIS</p>
          <h2 className="story-reveal">Asking<br /><em>better</em><br />questions.</h2>
          <p className="story-lede story-reveal">
            I twist the numbers, apply statistical weights and interrogate every
            outlier. It’s not <q>"torture"</q>, it’s clarity. Looking for a signal
            hidden in the noise.
          </p>
          <div className="story-method-chips story-reveal">
            <span>MEAN <b>μ</b></span><span>MEDIAN <b>x̃</b></span><span>REGRESSION <b>ŷ = α + βx</b></span>
          </div>
        </div>

        <div className="story-analysis-board story-reveal">
          <div className="story-analysis-board-head"><span>MODEL / 04</span><span>OUTLIERS RETAINED, NOT ERASED</span></div>
          <div className="story-analysis-chart">
            <div className="story-analysis-grid"><i /><i /><i /><i /></div>
            <svg viewBox="0 0 520 230" role="img" aria-label="Scatter plot with a fitted regression trend">
              <path className="story-analysis-band" d="M22 190 C120 165 180 157 250 121 S390 76 500 34 L500 76 C390 118 330 155 250 164 S120 190 22 218Z" />
              <path className="story-analysis-trend" d="M22 205 C120 179 180 161 250 143 S390 98 500 55" />
              {[ [52,182],[82,191],[113,156],[145,169],[179,139],[207,151],[238,120],[267,143],[299,111],[326,125],[358,91],[389,111],[419,70],[450,85],[476,50] ].map(([x,y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
              ))}
            </svg>
            <span className="story-axis story-axis--x">OBSERVATION →</span>
            <span className="story-axis story-axis--y">OUTCOME ↑</span>
          </div>
          <div className="story-analysis-equation"><span>BEST FIT</span><b>ŷ = 2.4 + 0.83x</b><small>p &lt; 0.05 · illustrative model</small></div>
          <div className="story-analysis-quote">
            <span>THE WARNING LABEL</span>
            <blockquote>“If you torture the data long enough, it will confess to anything.”</blockquote>
            <cite>— RONALD COASE</cite>
          </div>
        </div>
      </section>

      <section id="section-4" className="story-act story-act--revelation">
        <div className="story-revelation-copy">
          <p className="story-kicker story-reveal"><span>04</span> / THE REVELATION — LIGHT</p>
          <h2 className="story-reveal">Chaos becomes<br /><em>a story.</em></h2>
          <p className="story-lede story-reveal">
            Chaos becomes order. The noise into signal, Signal to decision &amp; the decision directs the story. Suddenly, I&apos;m not blind anymore. I see the road ahead &ndash; The Future is clear.
          </p>
          <div className="story-quote-card story-quote-card--light story-reveal">
            <blockquote>“Data is the new oil.”</blockquote>
            <cite>— CLIVE HUMBY</cite>
            <small>Useful only when refined—with care, context, and purpose.</small>
          </div>
        </div>

        <div className="story-insights-grid story-reveal" aria-label="Illustrative charts and insights">
          <div className="story-insights-heading"><span>THE PATTERN, MADE VISIBLE</span><b><i /> ACT WITH CONFIDENCE</b></div>
          <article className="story-insight-card story-insight-card--bars">
            <small>ACTIVITY / MONTH</small><b>Steady growth</b>
            <div className="story-bars" aria-label="Monthly activity bar chart">
              {chartBars.map((height, index) => <i key={index} style={{ "--bar-height": `${height}%`, "--bar-delay": `${index * 45}ms` }} />)}
            </div>
            <div className="story-chart-months"><span>JAN</span><span>APR</span><span>AUG</span><span>DEC</span></div>
          </article>
          <article className="story-insight-card story-insight-card--line">
            <small>RETENTION / TREND</small><b>One clear direction</b>
            <svg viewBox="0 0 260 100" preserveAspectRatio="none" role="img" aria-label="Rising retention trend line">
              <path d="M0 79 C20 74 28 57 53 64 S83 67 104 48 S132 55 152 39 S183 45 201 29 S228 35 260 10" />
            </svg>
            <div className="story-chart-months"><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div>
          </article>
          <article className="story-insight-card story-insight-card--donut">
            <small>PORTFOLIO / MIX</small><b>Balanced by design</b>
            <div className="story-donut"><span>74<small>%</small></span></div>
            <div className="story-donut-legend"><i /> VERIFIED SIGNAL</div>
          </article>
          <div className="story-insight-foot"><span>FROM A MILLION POINTS</span><b>TO ONE BETTER QUESTION ↗</b></div>
        </div>
      </section>

      <section id="section-5" className="story-act story-act--epilogue">
        <div className="story-epilogue-copy">
          <p className="story-kicker story-reveal"><span>05</span> / THE EPILOGUE — THE INTERFACE</p>
          <h2 className="story-reveal">The view<br />from the <em>top.</em></h2>
          <p className="story-lede story-reveal">This is the view from the top. Clarity. Insight. Action.</p>
          <div className="story-quote-card story-quote-card--light story-reveal">
            <blockquote>“In God we trust; all others must bring data.”</blockquote>
            <cite>— W. EDWARDS DEMING</cite>
          </div>
          <p className="story-epilogue-signoff story-reveal">I make the next move easier to see.</p>
        </div>

        <div className="story-final-dashboard story-reveal" aria-label="Illustrative executive dashboard">
          <div className="story-final-sidebar">
            <span className="story-final-mark">A<span>.</span></span>
            <i className="is-current">▦</i><i>⌁</i><i>◷</i><i>▤</i>
            <small>INSIGHT / 01</small>
          </div>
          <div className="story-final-main">
            <div className="story-final-top"><span>WORKSPACE / OVERVIEW</span><span>● LIVE / SAMPLE</span></div>
            <div className="story-final-welcome"><div><small>MONDAY, 09:00 · EXECUTIVE VIEW</small><h3>Good morning.<br />Here’s the signal.</h3></div><span>LAST 12 MONTHS⌄</span></div>
            <div className="story-final-metrics">
              <div><small>RECORDS CONNECTED</small><b>26,868</b><span>Across three sources</span></div>
              <div><small>STRONGEST SIGNAL</small><b>+18.4%</b><span>↗ compared to last period</span></div>
              <div><small>DATA QUALITY</small><b>98.6%</b><span>Validated before reporting</span></div>
            </div>
            <div className="story-final-chart">
              <div><small>THE STORY IN ONE VIEW</small><b>Momentum is building.</b></div>
              <svg viewBox="0 0 600 130" preserveAspectRatio="none" role="img" aria-label="Illustrative trend line showing consistent growth">
                <defs><linearGradient id="finalChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5a9c70" stopOpacity=".22" /><stop offset="100%" stopColor="#5a9c70" stopOpacity="0" /></linearGradient></defs>
                <path className="story-final-area" d="M0 112 C42 101 54 92 94 98 S154 77 191 84 S241 58 287 72 S350 48 388 52 S447 27 483 37 S546 18 600 8 L600 130 L0 130Z" />
                <path className="story-final-line" d="M0 112 C42 101 54 92 94 98 S154 77 191 84 S241 58 287 72 S350 48 388 52 S447 27 483 37 S546 18 600 8" />
              </svg>
              <div className="story-chart-months"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>DEC</span></div>
            </div>
            <div className="story-final-bottom">
              <span className="story-report-status"><i /> REPORT READY · THE PATTERN IS CLEAR</span>
              <button className="story-report-action" type="button" onClick={() => onNavigate?.("projects")}>OPEN THE REPORT <b>↗</b></button>
            </div>
            <svg className="story-demo-cursor" viewBox="0 0 24 30" aria-hidden="true"><path d="M2 1v23l6.5-6 4.1 9 4.1-1.8-4.1-9H22L2 1Z" fill="#15241d" stroke="#fff" strokeWidth="1.5" /></svg>
          </div>
        </div>
      </section>

      <div className="story-telemetry" aria-live="polite">{telemetry[activeSection]}</div>
      <div className="story-bottom-mark" aria-hidden="true">AUSTINE AGUNDA <span>·</span> DATA, WITH INTENTION</div>
    </main>
  );
}
