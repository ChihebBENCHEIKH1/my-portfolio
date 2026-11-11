import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useSceneStore } from "../store/sceneStore";
import "./WorkExperience.css";

const GLYPHS = "アカサタナハマヤ0123456789ABCDEF#%&*<>/=+".split("");

/**
 * Local decrypt effect for the section heading — scrambles once when `active`
 * flips true. Reduced-motion renders plainly. Visible layers are aria-hidden;
 * the parent h2 carries the accessible label.
 */
function Decrypt({ text, active, className, style }: {
  text: string; active: boolean; className?: string; style?: CSSProperties;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setOut(text); return; }
    let frame = 0;
    const per = 1.7, hold = 6;
    const done = text.length * per + hold + 6;
    const tick = () => {
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " ") { s += " "; continue; }
        s += frame >= i * per + hold ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (frame++ < done) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, text]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span aria-hidden style={{ visibility: "hidden" }}>{text}</span>
      <span aria-hidden className={className}
        style={{ position: "absolute", inset: 0, whiteSpace: "nowrap", ...style }}>{out}</span>
    </span>
  );
}

function DataNode({
  job,
  i,
  accent,
}: {
  job: { img: string; title: string; company: string; description: string };
  i: number;
  accent: string;
}) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const setHoveredJobIndex = useSceneStore((s) => s.setHoveredJobIndex);

  const handleEnter = () => { setHovered(true); setHoveredJobIndex(i); };
  const handleLeave = () => { setHovered(false); setHoveredJobIndex(null); };

  return (
    <div className="we-row">
      {/* Timeline spine column — node dot rides the shared spine */}
      <div className="we-spinecol">
        <motion.div
          className="we-node-dot"
          initial={{ scale: 0, rotate: 45 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{
            background: hovered ? accent : "rgba(8,10,18,0.95)",
            border: `2px solid ${accent}`,
            boxShadow: hovered
              ? `0 0 15px ${accent}80, 0 0 30px ${accent}40`
              : `0 0 6px ${accent}30`,
          }}
        />
        {/* Pulse ring on hover (gated behind hover + reduced-motion) */}
        {hovered && !reduced && (
          <motion.div
            className="we-pulse-ring"
            aria-hidden="true"
            initial={{ scale: 0.5, opacity: 0.8, rotate: 45 }}
            animate={{ scale: 2.5, opacity: 0, rotate: 45 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ border: `1px solid ${accent}` }}
          />
        )}
      </div>

      {/* Data node card */}
      <motion.div
        className="we-card"
        style={{ "--accent": accent } as CSSProperties}
        initial={{ opacity: 0, x: -24, scale: 0.97 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.985 }}
        tabIndex={0}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {/* Top neon rule: cyan → pink */}
        <div className="we-toprule" aria-hidden="true" />

        {/* Scanline sweep on hover */}
        {hovered && !reduced && (
          <motion.div
            aria-hidden="true"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1, ease: "linear" }}
            style={{
              position: "absolute", left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
              boxShadow: `0 0 10px ${accent}30`,
              pointerEvents: "none", zIndex: 5,
            }}
          />
        )}

        {/* CRT scanlines */}
        <div className="we-crt" aria-hidden="true" />

        {/* Header bar */}
        <div className="we-cardhead">
          <div className="we-nodelabel" aria-hidden="true">
            <span className="we-blink" />
            DATA_NODE //0{i + 1}
          </div>
          <div className="we-cryptlabel" aria-hidden="true">
            {hovered ? "DECRYPTED" : "ENCRYPTED"}
          </div>
        </div>

        {/* Content */}
        <div className="we-content">
          {/* Company logo — HUD target frame */}
          <div className="we-logo">
            <img src={job.img} alt={job.company} width="48" height="48" loading="lazy" decoding="async" />
            <span className="we-bracket we-bracket-tl" aria-hidden="true" />
            <span className="we-bracket we-bracket-tr" aria-hidden="true" />
            <span className="we-bracket we-bracket-bl" aria-hidden="true" />
            <span className="we-bracket we-bracket-br" aria-hidden="true" />
          </div>

          <div className="we-body">
            <span className="we-role">{job.title}</span>
            <h3 className="we-company">{job.company}</h3>
            <p className="we-desc">{job.description}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="we-cardfoot">
          <div className="we-sector" aria-hidden="true">
            <span className="we-sector-tick" />
            <span className="we-sector-label">SECTOR_0{i + 1}</span>
          </div>
          {/* Signal bars (animate on hover only, gated by reduced-motion) */}
          <div className="we-bars" aria-hidden="true">
            {[0, 1, 2, 3].map(bi => (
              <motion.div
                key={bi}
                animate={hovered && !reduced ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.3 }}
                transition={hovered && !reduced
                  ? { duration: 1.2, repeat: Infinity, delay: bi * 0.15 }
                  : { duration: 0.3 }}
                style={{
                  width: "2px", height: `${6 + bi * 3}px`,
                  background: accent, transformOrigin: "bottom",
                  opacity: hovered ? 0.9 : 0.35,
                  transition: "opacity 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom neon line */}
        <div className="we-bottomline" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

/** Typed sign-off end cap — decorative HUD chrome (aria-hidden). */
function EndCap({ nodes }: { nodes: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const capInView = useInView(ref, { once: true, amount: 0.6 });
  const [txt, setTxt] = useState("");
  const full = `> connection_closed :: ${nodes} nodes · 2+ yrs · 0 rollbacks`;

  useEffect(() => {
    if (!capInView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setTxt(full); return; }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTxt(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [capInView, full]);

  return (
    <div ref={ref} className="we-endcap" aria-hidden="true">
      <div className="we-endrow">
        <div className="we-endcol">
          <span className="we-enddot" />
        </div>
        <span className="we-endtext">
          {txt}
          <span className="cursor-blink" />
        </span>
      </div>
      <motion.div
        className="neon-line we-endline"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

export function WorkExperience({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();
  const jobs: { img: string; title: string; company: string; description: string }[] = t.workExperienceList;

  const colors = ["#00f0ff", "#ff007f", "#ffb800"];

  return (
    <section id="WorkExperience" ref={ref} className="grid-pattern cv-auto we-section">
      <span className="kanji-bg" style={{ top: "8%", right: "5%", fontSize: "clamp(5rem, 12vw, 11rem)" }}>経験</span>
      <span className="ghost-num" aria-hidden="true">03</span>

      <div style={{
        position: "absolute", top: "20%", left: "5%", width: "40vw", height: "60vh",
        background: "radial-gradient(ellipse, rgba(0,240,255,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div className="we-wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,240,255,0.35)",
          }}>
            03 — {t.workExperience}
          </span>
        </motion.div>
        <motion.h2
          aria-label="Where I've Shipped"
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95, textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          <Decrypt text="Where I've" active={inView} />{" "}
          <Decrypt
            text="Shipped"
            active={inView}
            className="glow-pink accent-shine"
            style={{ color: "#ff007f" }}
          />
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }}
        />

        {/* Vertical timeline */}
        <div className="we-timeline">
          <div className="we-spine-track" aria-hidden="true" />
          <div className="we-spine" aria-hidden="true" />
          {!reduced && (
            <div className="we-packet-travel" aria-hidden="true"><div className="we-packet" /></div>
          )}

          {jobs.map((job, i) => (
            <DataNode
              key={job.company}
              job={job}
              i={i}
              accent={colors[i % colors.length]}
            />
          ))}

          <EndCap nodes={jobs.length} />
        </div>
      </div>
    </section>
  );
}
