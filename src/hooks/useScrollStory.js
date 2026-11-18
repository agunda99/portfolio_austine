import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollStory() {
  const scrollState = useRef({ progress: 0 });
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reducedMotion ? 1 : 0.1,
      smoothWheel: !reducedMotion,
    });

    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const progressTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (trigger) => {
        scrollState.current.progress = trigger.progress;
      },
    });

    const sectionIds = ["section-1", "section-2", "section-3", "section-4", "section-5"];
    const sectionTriggers = sectionIds.map((id, index) => (
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      })
    ));

    // Let GSAP reveal the copy and scrub the collection meter against Lenis scroll.
    const animationContext = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".story-reveal", { autoAlpha: 1, y: 0 });
        gsap.set(".story-progress-fill", { scaleX: 1 });
        return;
      }

      gsap.utils.toArray(".story-reveal").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 32 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      gsap.to(".story-progress-fill", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: "#section-2", start: "top 75%", end: "bottom 60%", scrub: 0.7 },
      });

      const reportButton = document.querySelector(".story-report-action");
      const reportCursor = document.querySelector(".story-demo-cursor");
      if (reportButton && reportCursor) {
        gsap.timeline({
          scrollTrigger: { trigger: "#section-5", start: "top 60%", once: true },
        })
          .fromTo(reportCursor, { x: -110, y: 75, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" })
          .to(reportButton, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 }, "-=0.15")
          .fromTo(".story-report-status", { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.1");
      }
    }, document.documentElement);

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      gsap.ticker.remove(ticker);
      progressTrigger.kill();
      sectionTriggers.forEach((trigger) => trigger.kill());
      animationContext.revert();
    };
  }, []);

  return { scrollState, activeSection };
}
