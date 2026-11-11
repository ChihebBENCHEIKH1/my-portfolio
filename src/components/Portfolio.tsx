import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ProjectPreview } from "./ProjectPreview";
import { PREVIEW_ACCENTS, type PreviewKind } from "./projectPreviewData";
import "./Portfolio.css";

type Project = { title: string; description: string; technologies: string[]; websiteURL: string; image: string; preview: PreviewKind };

export function Portfolio({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const reduced = useReducedMotion();
  const de = lang === "de";
  const groups: { label: string; accent: string; projects: Project[] }[] = [
    { label: t.role, accent: "#00e5ff", projects: t.projects },
    { label: t.backendProjects, accent: "#ed65bb", projects: t.backendProjectsList },
    { label: t.devopsProjects, accent: "#bc8aff", projects: t.devopsProjectsList },
  ];
  const projects = groups.flatMap(group => group.projects.map(project => ({ ...project, group: group.label, accent: PREVIEW_ACCENTS[project.preview] ?? group.accent })));

  return <section id="Projects" className="project-gallery grid-pattern">
    <span className="kanji-bg" aria-hidden="true" style={{ right: "4%", top: "6%", fontSize: "clamp(6rem, 15vw, 13rem)" }}>作品</span>
    <div className="project-gallery-inner">
      <motion.div initial={{ opacity: 0, y: reduced ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="gallery-heading">
        <span className="gallery-eyebrow">04 / {de ? "PROJEKTE" : "SELECTED PROJECTS"}</span>
        <h2>{de ? "Ideen. Code." : "Ideas. Code."}<br /><span>{de ? "Echte Systeme." : "Real systems."}</span></h2>
        <p>{de ? "KI, Full-Stack und Infrastruktur. Von der ersten Idee bis zum laufenden Produkt." : "AI, full-stack and infrastructure. From the first idea to a working product."}</p>
      </motion.div>
      <div className="project-gallery-grid">
        {projects.map((project, index) => <motion.a
          key={project.title}
          href={project.websiteURL}
          target="_blank"
          rel="noopener noreferrer"
          className={`project-art-card ${index === 0 ? "project-art-featured" : ""}`}
          data-preview={project.preview}
          style={{ "--project-accent": project.accent } as CSSProperties}
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : index % 2 * .08, ease: [.22,1,.36,1] }}
        >
          <div className="project-art-top"><span>{project.group}</span><span className="project-art-index">{String(index+1).padStart(2,"0")}</span></div>
          <div className="project-art-visual">
            <ProjectPreview kind={project.preview} image={project.image} de={de} />
          </div>
          <div className="project-art-body">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-art-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
            <div className="project-art-footer"><span>{de ? "Projekt ansehen" : "Explore project"}</span><span aria-hidden="true">↗</span></div>
          </div>
          <span className="sr-only">{de ? "(öffnet in einem neuen Tab)" : "(opens in a new tab)"}</span>
        </motion.a>)}
      </div>
    </div>
  </section>;
}
