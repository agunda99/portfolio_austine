import { useRef } from "react";

export default function ProjectCard({ project, index, stage }) {
  const cardRef = useRef(null);

  function tiltCard(event) {
    if (event.pointerType === "touch") return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cardRef.current.style.setProperty("--tilt-x", `${-y * 5}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${x * 7}deg`);
  }

  function resetTilt() {
    cardRef.current?.style.setProperty("--tilt-x", "0deg");
    cardRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <article className="project-card reveal-on-scroll" data-scene-stage={stage} ref={cardRef} onPointerMove={tiltCard} onPointerLeave={resetTilt}>
      <a className="project-image-link" href={project.demo || project.source} target="_blank" rel="noreferrer">
        <img src={project.image} alt={project.alt} loading="lazy" />
        <span className="project-index">0{index + 1}</span>
        <span className="project-open" aria-hidden="true">↗</span>
        <span className="image-scan" aria-hidden="true" />
      </a>
      <div className="project-meta">{project.type}</div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="project-links">
        {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
        <a href={project.source} target="_blank" rel="noreferrer">Source code ↗</a>
      </div>
    </article>
  );
}
