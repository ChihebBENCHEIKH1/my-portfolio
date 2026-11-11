import { useEffect } from "react";
import { useSceneStore } from "../store/sceneStore";
import "./SectionFlow.css";

export function SectionFlow() {
  const section = useSceneStore(s => s.activeSection);
  const daylight = useSceneStore(s => s.daylight);
  const interactive = useSceneStore(s => s.interactive);
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("#main-content > section");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { rootMargin: "-8% 0px -8% 0px", threshold: 0 });
    sections.forEach(element => observer.observe(element));
    return () => { observer.disconnect(); sections.forEach(element => { delete element.dataset.inView; }); };
  }, []);
  const visible = section !== "hero" && !interactive;
  return <div className="section-atmosphere" data-visible={visible} data-day={daylight} aria-hidden="true">
    <div className="section-glow section-glow-cyan" data-lit={section === "about" || section === "opensource"} />
    <div className="section-glow section-glow-rose" data-lit={section === "projects" || section === "contact"} />
    <div className="section-glow section-glow-violet" data-lit={section === "experience" || section === "testimonials"} />
  </div>;
}
