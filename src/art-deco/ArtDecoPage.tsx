import { useEffect, useRef, useState, type CSSProperties } from "react";
import { textContent } from "../utils/Text";
import { ProjectPreview } from "../components/ProjectPreview";
import type { PreviewKind } from "../components/projectPreviewData";
import { DecoCity } from "./DecoCity";
import cvEnglish from "../assets/cv/Chiheb_CV.pdf";
import cvGerman from "../assets/cv/Chiheb_CV_de.pdf";

export function ArtDecoPage() {
  const [de, setDe] = useState(() => new URL(location.href).searchParams.get("lang") === "de");
  const [night, setNight] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [buildings, setBuildings] = useState(13);
  const [light, setLight] = useState(1);
  const [glowing, setGlowing] = useState(false);
  const glowTimer = useRef<number>();
  const main = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const t = textContent[de ? "de" : "eng"];
  const projects = [...t.projects, ...t.backendProjectsList, ...t.devopsProjectsList];
  const illuminate = () => {
    window.clearTimeout(glowTimer.current); setGlowing(true);
    glowTimer.current = window.setTimeout(() => setGlowing(false), 2200);
  };
  useEffect(() => () => window.clearTimeout(glowTimer.current), []);
  useEffect(() => {
    document.documentElement.lang = de ? "de" : "en";
    document.title = de ? "Chiheb Ben Cheikh — Art-Déco-Portfolio" : "Chiheb Ben Cheikh — Art Deco Portfolio";
    const url = new URL(location.href);
    if (de) url.searchParams.set("lang", "de"); else url.searchParams.delete("lang");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [de]);
  useEffect(() => {
    if (!exploring) return;
    const content = main.current;
    const trigger = launch.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    content?.setAttribute("inert", ""); content?.setAttribute("aria-hidden", "true");
    close.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setExploring(false); return; }
      if (event.key !== "Tab") return;
      const targets = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input') ?? []);
      const first = targets[0], last = targets[targets.length-1];
      if (!panel.current?.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = overflow;
      content?.removeAttribute("inert"); content?.removeAttribute("aria-hidden");
      window.removeEventListener("keydown", keyboard);
      trigger?.focus();
    };
  }, [exploring]);
  useEffect(() => {
    const targets = document.querySelectorAll(".deco-reveal");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("deco-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return <div className="deco-page" data-night={night} data-exploring={exploring}>
    <a className="deco-skip" href="#deco-content">{de ? "Zum Inhalt" : "Skip to content"}</a>
    <DecoCity night={night} buildings={buildings} light={light} glowing={glowing} exploring={exploring} onIlluminate={illuminate} />
    <main ref={main} id="deco-content">
      <header className="deco-header"><a className="deco-brand" href="#deco-home" aria-label="Chiheb Ben Cheikh"><span>CB</span><small>CHIHEB<br />BEN CHEIKH</small></a><nav aria-label={de ? "Hauptnavigation" : "Main navigation"}><a href="#deco-work">{de ? "Projekte" : "Selected work"}</a><a href="#deco-about">{de ? "Über mich" : "About"}</a><a href="#deco-contact">{de ? "Kontakt" : "Contact"}</a></nav><div className="deco-header-actions"><button type="button" className="deco-language" onClick={() => setDe(!de)} aria-label={de ? "Switch to English" : "Auf Deutsch wechseln"}>{de ? "DE" : "EN"}</button><button type="button" className="deco-theme" onClick={() => setNight(!night)} aria-pressed={night} aria-label={de ? "Nachtmodus" : "Night mode"}>{night ? "☾" : "☀"}</button></div></header>
      <section id="deco-home" className="deco-hero">
        <div className="deco-hero-frame" aria-hidden="true"><i /><i /></div>
        <div className="deco-hero-copy"><span className="deco-eyebrow">SOFTWARE ENGINEER · AI & SECURE SYSTEMS</span><div className="deco-ornament" aria-hidden="true"><span />◇<span /></div><h1>CHIHEB<br /><span>BEN CHEIKH</span></h1><p>{de ? <>Von einer Idee<br />zu einem funktionierenden System.</> : <>From an idea<br />to a working system.</>}</p><div className="deco-hero-actions"><a className="deco-button" href="#deco-work">{de ? "Projekte entdecken" : "Discover the work"}<span>↗</span></a><a className="deco-text-link" href="#deco-contact">{de ? "Kontakt aufnehmen" : "Get in touch"}<span>→</span></a></div></div>
        <div className="deco-hero-caption"><span>APPLIED AI</span><i />FULL-STACK<i /><span>SECURE BY DESIGN</span></div>
      </section>
      <section id="deco-work" className="deco-section deco-work">
        <div className="deco-section-heading deco-reveal"><div><span className="deco-kicker">I / {de ? "AUSGEWÄHLTE PROJEKTE" : "SELECTED WORK"}</span><h2>{de ? <>Ideen mit<br /><em>Substanz.</em></> : <>Ideas with<br /><em>substance.</em></>}</h2></div><p>{de ? "KI, Full-Stack und Infrastruktur. Eine Auswahl von Systemen, die ich entworfen und gebaut habe." : "Applied AI, full-stack products and infrastructure. A selection of systems I have designed and built."}</p></div>
        <div className="deco-project-grid">{projects.map((project,index) => <a className="deco-project project-art-card deco-reveal" key={project.title} href={project.websiteURL} target="_blank" rel="noopener noreferrer" style={{ "--project-accent": "#c2aa7a" } as CSSProperties}><div className="deco-project-number"><span>0{index+1}</span><span>{index<2 ? "AI & SYSTEMS" : index===5 ? "SECURITY" : "FULL-STACK"}</span><b>↗</b></div><div className="deco-project-preview project-art-visual"><ProjectPreview kind={project.preview as PreviewKind} image={project.image} de={de} /></div><div className="deco-project-copy"><h3>{project.title}</h3><p>{project.description}</p><div className="deco-project-tech">{project.technologies.slice(0,4).map(tech=><span key={tech}>{tech}</span>)}</div><span className="deco-project-link">{de ? "Projekt ansehen" : "View project"}<i>↗</i></span><span className="deco-sr-only">{de ? "Öffnet in einem neuen Tab" : "Opens in a new tab"}</span></div></a>)}</div>
      </section>
      <section id="deco-about" className="deco-section deco-about">
        <div className="deco-about-heading deco-reveal"><span className="deco-kicker">II / {de ? "DER MENSCH DAHINTER" : "THE PERSON BEHIND IT"}</span><h2>{de ? <>Mit Sorgfalt<br /><em>entwickelt.</em></> : <>Built<br /><em>with care.</em></>}</h2><div className="deco-about-emblem" aria-hidden="true"><span>CB</span><i /><b>CODE / SYSTEMS / CURIOSITY</b></div></div>
        <div className="deco-about-copy deco-reveal"><p className="deco-intro">{de ? "Ich bin Chiheb, Software Engineer mit Schwerpunkt auf angewandter KI und sicheren Systemen." : "I'm Chiheb, a software engineer focused on applied AI and secure systems."}</p><p>{de ? "Ich entwickle LLM-Anwendungen, RAG-Pipelines und autonome Agenten und bringe sie mit einem vollständigen Produkt-Stack in Produktion. Sicherheit, Tests und Infrastruktur gehören von Anfang an dazu." : "I build LLM applications, RAG pipelines and autonomous agents, and bring them to production with a full product stack. Security, testing and infrastructure are part of the work from the start."}</p><div className="deco-experience">{t.workExperienceList.map(job=><div key={job.company}><span>◇</span><div><strong>{job.company}</strong><small>{job.title}</small></div></div>)}</div><a className="deco-text-link" href={de ? cvGerman : cvEnglish} target="_blank" rel="noopener noreferrer">{de ? "Lebenslauf ansehen" : "Read my résumé"}<span>↗</span></a></div>
      </section>
      <section id="deco-contact" className="deco-section deco-contact"><div className="deco-ornament" aria-hidden="true"><span />◇<span /></div><span className="deco-kicker">III / {de ? "KONTAKT" : "LET'S TALK"}</span><h2 className="deco-reveal">{de ? <>Eine Idee<br /><em>im Kopf?</em></> : <>A project<br /><em>in mind?</em></>}</h2><a className="deco-email" href={`mailto:${t.email}`}>{t.email}<span>↗</span></a><div className="deco-contact-links"><a href="https://github.com/ChihebBENCHEIKH1" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={de ? cvGerman : cvEnglish} target="_blank" rel="noopener noreferrer">{de ? "Lebenslauf" : "Résumé"} ↗</a></div></section>
      <footer className="deco-footer"><span>© {new Date().getFullYear()} CHIHEB BEN CHEIKH</span><span>SOFTWARE, WITH CHARACTER.</span><a href="#deco-home">{de ? "Nach oben" : "Back to top"} ↑</a></footer>
    </main>
    <button ref={launch} type="button" className="deco-explore-launch" hidden={exploring} onClick={()=>setExploring(true)}><span>◇</span>{de ? "Stadt entdecken" : "Explore the city"}</button>
    {exploring && <div ref={panel} className="deco-playground" role="dialog" aria-modal="true" aria-labelledby="deco-city-title"><div className="deco-playground-heading"><div><span className="deco-kicker">THE CITY EDITION</span><h2 id="deco-city-title">{de ? "Deine Stadt. Dein Licht." : "Your city. Your light."}</h2><p>{de ? "Klicke auf die Türme, um die Stadt aufleuchten zu lassen." : "Click the towers to illuminate the skyline."}</p></div><button ref={close} type="button" className="deco-city-close" onClick={()=>setExploring(false)}>{de ? "Zurück" : "Back to portfolio"}<span>×</span></button></div><div className="deco-city-controls"><div><span>{de ? "GEBÄUDE" : "BUILDINGS"}</span><div className="deco-stepper"><button type="button" disabled={buildings<=6} aria-label={de ? "Gebäude entfernen" : "Remove building"} onClick={()=>setBuildings(buildings-1)}>−</button><output aria-live="polite">{buildings}</output><button type="button" disabled={buildings>=22} aria-label={de ? "Gebäude hinzufügen" : "Add building"} onClick={()=>setBuildings(buildings+1)}>+</button></div></div><label><span>{de ? "LICHT" : "LIGHT"}</span><input aria-label={de ? "Lichtstärke" : "Light intensity"} type="range" min=".2" max="1.6" step=".1" value={light} onChange={event=>setLight(Number(event.currentTarget.value))} /></label><div><span>{de ? "ATMOSPHÄRE" : "ATMOSPHERE"}</span><button type="button" className="deco-city-time" aria-pressed={night} onClick={()=>setNight(!night)}>{night ? (de ? "☾ Nacht" : "☾ Evening") : (de ? "☀ Tag" : "☀ Daylight")}</button></div><button type="button" className="deco-illuminate" onClick={illuminate}>{de ? "Stadt erleuchten" : "Illuminate the city"} ✧</button></div></div>}
  </div>;
}
