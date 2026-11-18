import ProjectCard from "../components/ProjectCard.jsx";
import { projects } from "../data/projects.js";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <section className="projects-page-heading section-wrap" data-scene-stage="3.1">
        <p className="eyebrow">PROJECT ARCHIVE / 001—003</p>
        <h1>Questions made<br /><em>visible.</em></h1>
        <p>Data tools, digital experiences, and small experiments. Nothing else—just the work.</p>
        <span className="archive-coordinate">SCROLL TO BROWSE / ↘</span>
      </section>
      <section className="projects-gallery section-wrap" aria-label="Selected projects">
        {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} stage={3.3 + index * 0.25} />)}
      </section>
      <div className="projects-page-footer section-wrap"><span>END OF VISIBLE UNIVERSE / MORE ON GITHUB</span><a href="https://github.com/agunda99" target="_blank" rel="noreferrer">Open GitHub ↗</a></div>
    </main>
  );
}
