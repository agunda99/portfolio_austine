import { lazy, Suspense, useEffect, useRef, useState } from "react";
import PortfolioNavigation from "./PortfolioNavigation.jsx";
import StoryPage from "../pages/StoryPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";

const ThreeStudy = lazy(() => import("../ThreeStudy.jsx"));

export default function PortfolioShell({ page, onNavigate, theme, onThemeChange }) {
  const [palette, setPalette] = useState("Original");
  const progressRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      });
    };
    const moveGlow = (event) => {
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("pointermove", moveGlow, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("pointermove", moveGlow);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [page]);

  return (
    <div className="portfolio-shell" data-theme={theme} data-palette={palette} data-page={page}>
      {page !== "projects" && page !== "story" && (
        <>
          <div className="page-progress" ref={progressRef} aria-hidden="true" />
          <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
          <div className="scene-backdrop" aria-hidden="true"><Suspense fallback={null}><ThreeStudy /></Suspense></div>
        </>
      )}
      {page !== "story" && <PortfolioNavigation page={page} onNavigate={onNavigate} theme={theme} onThemeChange={onThemeChange} />}
      <div className="portfolio-content">
        {page === "projects" ? <ProjectsPage /> : page === "contact" ? <ContactPage /> : <StoryPage onNavigate={onNavigate} onPaletteChange={setPalette} palette={palette} />}
      </div>
      {page !== "story" && (
        <footer className="portfolio-footer section-wrap">
          <span>© {new Date().getFullYear()} Austine Agunda · Nairobi, Kenya</span>
          {page !== "contact" && <button type="button" onClick={() => onNavigate("contact")}>Make contact ↗</button>}
        </footer>
      )}
    </div>
  );
}
