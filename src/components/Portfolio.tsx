import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import "./Portfolio.css";

interface Project { title: string; description: string; technologies: string[]; websiteURL: string; image: string; }

const GLYPHS = "アカサタナハマヤ0123456789ABCDEF#%&*<>/=+";
const EASE = [0.16, 1, 0.3, 1] as const;

/* Decrypts `text` from cyber-glyphs once `active` flips true (in-view gated).
   Reduced-motion → renders the plain string immediately. */
function useDecrypt(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setOut(text); return; }
    let raf = 0, frame = 0;
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
      if (frame++ < done) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, active]);
  return out;
}

function DecryptWord({ text, active, className, color }: {
  text: string; active: boolean; className?: string; color?: string;
}) {
  const out = useDecrypt(text, active);
  // className/color live on the visible overlay: background-clip:text effects
  // (accent-shine) only paint the element's own text, not absolute children.
  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden" }}>{text}</span>
      <span className={className}
        style={{ position: "absolute", inset: 0, whiteSpace: "nowrap", ...(color ? { color } : {}) }}>{out}</span>
    </span>
  );
}

/* ── Preview Panel (right side) ── */
function PreviewPanel({ project, scanning }: { project: Project | null; scanning: boolean }) {
  return (
    <div className="hide-mobile" style={{
      position: "sticky", top: "80px",
      height: "fit-content",
      clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
      background: "rgba(8,10,18,0.92)",
      border: "1px solid rgba(0,240,255,0.08)",
      overflow: "hidden",
      transition: "border-color 0.3s",
      ...(project ? { borderColor: "rgba(0,240,255,0.15)" } : {}),
    }}>
      {/* Top neon line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 3,
        background: project
          ? "linear-gradient(90deg, transparent, #00f0ff, #ff007f, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,240,255,0.15), transparent)",
        opacity: project ? 0.8 : 0.4, transition: "background 0.4s, opacity 0.4s",
      }} />

      {/* CRT scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* Header bar */}
      <div style={{
        padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(0,240,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div aria-hidden="true" style={{
            width: "6px", height: "6px",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: project ? "#00f0ff" : "rgba(0,240,255,0.2)",
            boxShadow: project ? "0 0 6px #00f0ff50" : "none",
            transition: "background 0.3s, box-shadow 0.3s",
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.14em", color: "rgba(0,240,255,0.7)",
            textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 10px rgba(0,240,255,0.3)",
          }}>PREVIEW_FEED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {scanning && (
            <span style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              letterSpacing: "0.14em", color: "#ffb800",
              textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 10px rgba(255,184,0,0.45)",
            }}>
              AUTO_SCAN
              <span className="cursor-blink" aria-hidden="true" style={{ background: "#ffb800" }} />
            </span>
          )}
          <div aria-hidden="true" style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: project ? "#00ff88" : "rgba(255,255,255,0.1)",
            boxShadow: project ? "0 0 6px #00ff88" : "none",
            transition: "background 0.3s, box-shadow 0.3s",
          }} />
        </div>
      </div>

      {/* Signal-acquire wipe on every record swap */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={project ? project.title : "awaiting"}
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          exit={{ opacity: 0, filter: "hue-rotate(40deg)", transition: { duration: 0.18 } }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* Image area */}
          <div style={{
            height: "200px", position: "relative", overflow: "hidden",
            background: "rgba(0,0,0,0.3)",
          }}>
            {project ? (
              <>
                <img
                  src={project.image} alt={project.title}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: "brightness(0.8) saturate(1.1)",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(to top, rgba(8,10,18,0.9) 0%, transparent 50%)",
                }} />
                {/* Corner brackets */}
                <div style={{ position: "absolute", top: "8px", left: "8px", width: "14px", height: "14px",
                  borderTop: "1.5px solid rgba(0,240,255,0.4)", borderLeft: "1.5px solid rgba(0,240,255,0.4)" }} />
                <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "14px", height: "14px",
                  borderBottom: "1.5px solid rgba(255,0,127,0.4)", borderRight: "1.5px solid rgba(255,0,127,0.4)" }} />
              </>
            ) : null}
          </div>

          {/* Details area */}
          <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
            {project ? (
              <>
                <h4 style={{
                  fontFamily: '"Space Grotesk"', fontSize: "1.1rem",
                  fontWeight: 700, color: "#fff", textTransform: "uppercase",
                  lineHeight: 1.2, marginBottom: "0.5rem",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 18px rgba(0,240,255,0.2)",
                }}>{project.title}</h4>

                <p style={{
                  fontSize: "12px", lineHeight: 1.75, color: "rgba(224,224,232,0.75)",
                  marginBottom: "0.75rem",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                  display: "-webkit-box", WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>{project.description}</p>

                {/* Tech tags */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "4px",
                  paddingTop: "0.6rem", borderTop: "1px solid rgba(0,240,255,0.05)",
                }}>
                  {project.technologies.map((tag, ti) => {
                    const c = ["#00f0ff", "#ff007f", "#ffb800"][ti % 3];
                    return (
                      <span key={tag} style={{
                        fontFamily: '"JetBrains Mono"', fontSize: "10px",
                        padding: "2.5px 9px", letterSpacing: "0.05em",
                        color: c, opacity: 0.85,
                        textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                        background: `${c}0a`, border: `1px solid ${c}25`,
                        clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)",
                      }}>{tag}</span>
                    );
                  })}
                </div>

                {/* Stack depth (ornament) */}
                <div aria-hidden="true" style={{
                  display: "flex", alignItems: "center", gap: "8px", marginTop: "0.65rem",
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "9px",
                    color: "rgba(0,240,255,0.45)", letterSpacing: "0.1em",
                  }}>STACK</span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 6 }).map((_, si) => (
                      <div key={si} style={{
                        width: "8px", height: "3px",
                        background: si < Math.min(project.technologies.length, 6)
                          ? (si < 2 ? "#00f0ff" : si < 4 ? "#ffb800" : "#ff007f")
                          : "rgba(255,255,255,0.04)",
                      }} />
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom neon */}
      <div style={{
        height: "1px",
        background: project
          ? "linear-gradient(90deg, transparent, #00f0ff40, #ff007f40, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,240,255,0.05), transparent)",
        transition: "background 0.3s",
      }} />
    </div>
  );
}

/* ── Project Row ── */
function ProjectRow({ p, i, accent, active, touch, onEngage }: {
  p: Project; i: number; accent: string; active: boolean; touch: boolean;
  onEngage: () => void;
}) {
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    // Touch: first tap decrypts (select + inline reveal), second tap follows the link
    if (touch && !active) {
      e.preventDefault();
      onEngage();
    }
  };

  return (
    <motion.a
      className="proj-row"
      href={p.websiteURL} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 6) * 0.05, duration: 0.55, ease: EASE }}
      whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 28 } }}
      onMouseEnter={() => { if (!touch) onEngage(); }}
      onFocus={() => { if (!touch) onEngage(); }}
      onClick={handleClick}
      style={{
        background: active ? `linear-gradient(90deg, ${accent}0d, transparent 65%)` : "transparent",
      }}
    >
      {/* Left accent bar — grows from the top on activation */}
      <div aria-hidden="true" style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
        background: `linear-gradient(to bottom, ${accent}, ${accent}55)`,
        boxShadow: `0 0 10px ${accent}55`,
        transform: active ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "top",
        transition: "transform 0.25s ease",
      }} />

      <div className="proj-row-main">
        {/* Index */}
        <span style={{
          fontFamily: '"JetBrains Mono"', fontSize: "11px",
          color: active ? "#00f0ff" : "rgba(0,240,255,0.45)",
          textShadow: active ? "0 0 8px rgba(0,240,255,0.45)" : "none",
          letterSpacing: "0.1em", minWidth: "24px",
          transition: "color 0.25s, text-shadow 0.25s",
        }}>{String(i + 1).padStart(2, "0")}</span>

        {/* Diamond — group accent, not always cyan */}
        <div aria-hidden="true" style={{
          width: "7px", height: "7px", flexShrink: 0,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: active ? accent : `${accent}59`,
          boxShadow: active ? `0 0 8px ${accent}66` : "none",
          transition: "background 0.25s, box-shadow 0.25s",
        }} />

        {/* Title */}
        <span style={{
          fontFamily: '"Space Grotesk"', fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
          fontWeight: 700,
          color: active ? "#fff" : touch ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.78)",
          textShadow: active
            ? `0 1px 2px rgba(0,0,0,0.7), 0 0 18px ${accent}40`
            : "0 1px 2px rgba(0,0,0,0.6)",
          textTransform: "uppercase", flex: 1,
          letterSpacing: "0.02em",
          transition: "color 0.25s, text-shadow 0.25s",
        }}>{p.title}</span>

        {/* Tech count badge */}
        <span className="hide-mobile" style={{
          fontFamily: '"JetBrains Mono"', fontSize: "10px",
          padding: "2px 8px", letterSpacing: "0.14em",
          color: active ? "rgba(0,240,255,0.85)" : "rgba(0,240,255,0.55)",
          border: `1px solid ${active ? "rgba(0,240,255,0.3)" : "rgba(0,240,255,0.12)"}`,
          clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          transition: "color 0.25s, border-color 0.25s",
        }}>{p.technologies.length} TECH</span>

        {/* Arrow */}
        <span aria-hidden="true" style={{
          color: active ? "#00f0ff" : "rgba(0,240,255,0.3)",
          fontSize: "13px",
          textShadow: active ? "0 0 10px rgba(0,240,255,0.6)" : "none",
          transform: active ? "translateX(2px)" : "none",
          display: "inline-block",
          transition: "color 0.25s, transform 0.25s, text-shadow 0.25s",
        }}>→</span>
        <span className="sr-only">(opens in new tab)</span>
      </div>

      {/* Touch-only inline reveal: image + tech chips under the selected row */}
      {touch && (
        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <div className="proj-mobile-reveal-pad">
                <div style={{
                  position: "relative", height: "140px", overflow: "hidden",
                  border: "1px solid rgba(0,240,255,0.12)", marginBottom: "0.6rem",
                  background: "rgba(0,0,0,0.3)",
                }}>
                  <img src={p.image} alt="" style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: "brightness(0.8) saturate(1.1)",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(to top, rgba(8,10,18,0.85), transparent 55%)",
                  }} />
                  <div style={{ position: "absolute", top: "6px", left: "6px", width: "12px", height: "12px",
                    borderTop: "1.5px solid rgba(0,240,255,0.4)", borderLeft: "1.5px solid rgba(0,240,255,0.4)" }} />
                  <div style={{ position: "absolute", bottom: "6px", right: "6px", width: "12px", height: "12px",
                    borderBottom: "1.5px solid rgba(255,0,127,0.4)", borderRight: "1.5px solid rgba(255,0,127,0.4)" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {p.technologies.map((tag, ti) => {
                    const c = ["#00f0ff", "#ff007f", "#ffb800"][ti % 3];
                    return (
                      <span key={tag} style={{
                        fontFamily: '"JetBrains Mono"', fontSize: "10px",
                        padding: "2.5px 9px", letterSpacing: "0.05em",
                        color: c, opacity: 0.85,
                        textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                        background: `${c}0a`, border: `1px solid ${c}25`,
                        clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)",
                      }}>{tag}</span>
                    );
                  })}
                </div>
                <div style={{
                  fontFamily: '"JetBrains Mono"', fontSize: "10px",
                  letterSpacing: "0.14em", marginTop: "0.6rem",
                  color: "rgba(0,240,255,0.7)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 8px rgba(0,240,255,0.3)",
                }}>
                  <span aria-hidden="true">↗ </span>TAP AGAIN TO OPEN
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.a>
  );
}

/* ── Section divider ── */
function SectionDivider({ num, label, color, count }: {
  num: string; label: string; color: string; count: number;
}) {
  return (
    <motion.div
      className="archive-divider"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <div aria-hidden="true" style={{
        width: "10px", height: "10px",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        background: color, boxShadow: `0 0 8px ${color}50`,
      }} />
      <span style={{
        fontFamily: '"JetBrains Mono"', fontSize: "13px",
        letterSpacing: "0.2em", color, fontWeight: 600,
        textShadow: `0 0 10px ${color}40`,
      }}>{num}</span>
      <div style={{ width: "14px", height: "1px", background: `${color}60` }} />
      <span style={{
        fontFamily: '"JetBrains Mono"', fontSize: "11px",
        letterSpacing: "0.18em", color: "rgba(224,224,232,0.65)", textTransform: "uppercase",
        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${color}10, transparent)` }} />
      <span style={{
        fontFamily: '"JetBrains Mono"', fontSize: "10px",
        color: "rgba(224,224,232,0.5)", letterSpacing: "0.12em",
      }}>[{count}]</span>
    </motion.div>
  );
}

export function Portfolio({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const sectionVisible = useInView(ref, { amount: 0.1 });
  const reduced = useReducedMotion();

  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches); }, []);

  const [hovered, setHovered] = useState<Project | null>(null);
  const [scanning, setScanning] = useState(false);
  const [autoIdx, setAutoIdx] = useState(0);
  const lastInteraction = useRef(Date.now());

  const projects = t.projects as Project[];
  const backendProjects = t.backendProjectsList as Project[];
  const devopsProjects = t.devopsProjectsList as Project[];
  const flat = useMemo(
    () => [...projects, ...backendProjects, ...devopsProjects],
    [projects, backendProjects, devopsProjects],
  );
  const total = flat.length;

  const groups = [
    { num: "01", label: t.role as string, color: "#00f0ff", items: projects },
    { num: "02", label: t.backendProjects as string, color: "#ff007f", items: backendProjects },
    { num: "03", label: t.devopsProjects as string, color: "#ffb800", items: devopsProjects },
  ];

  // Mirror volatile state into refs so timers never read stale closures
  const scanningRef = useRef(scanning); scanningRef.current = scanning;
  const hoveredRef = useRef(hovered); hoveredRef.current = hovered;
  const autoIdxRef = useRef(autoIdx); autoIdxRef.current = autoIdx;

  /* AUTO_SCAN arm: after 5s without interaction, start cycling records.
     Skipped entirely on touch, under reduced motion, or when off-screen. */
  useEffect(() => {
    if (reduced || touch || !sectionVisible) { setScanning(false); return; }
    const id = window.setInterval(() => {
      if (document.hidden || scanningRef.current) return;
      if (Date.now() - lastInteraction.current > 5000) {
        const from = hoveredRef.current ? flat.findIndex(p => p.title === hoveredRef.current?.title) : -1;
        setAutoIdx(from >= 0 ? from : 0);
        setHovered(null);
        setScanning(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [reduced, touch, sectionVisible, flat]);

  /* AUTO_SCAN cycle: advance every 4s while scanning (paused when tab hidden) */
  useEffect(() => {
    if (!scanning) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setAutoIdx(v => (v + 1) % flat.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [scanning, flat.length]);

  /* Any pointer activity over the archive: hand control back to the user.
     The scanned record is adopted as the selection so the preview never snaps. */
  const stopScan = useCallback(() => {
    lastInteraction.current = Date.now();
    if (scanningRef.current) {
      scanningRef.current = false; // sync now — mouseenter/mousemove land in the same batch
      setHovered(flat[autoIdxRef.current % flat.length] ?? null);
      setScanning(false);
    }
  }, [flat]);

  const engage = useCallback((p: Project) => {
    lastInteraction.current = Date.now();
    scanningRef.current = false; // prevent a trailing stopScan from clobbering this selection
    hoveredRef.current = p;
    setScanning(false);
    setHovered(p);
  }, []);

  const activeProject = hovered ?? (scanning ? flat[autoIdx % flat.length] ?? null : null);
  // Never show an empty preview — default to the first record until hover
  const previewProject = activeProject ?? flat[0] ?? null;

  return (
    <section id="Projects" ref={ref} className="grid-pattern" style={{
      padding: "90px 2rem 140px", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ bottom: "5%", left: "2%", fontSize: "clamp(6rem, 14vw, 13rem)" }}>作品</span>
      <span className="ghost-num" aria-hidden="true">04</span>

      <div style={{
        position: "absolute", top: "15%", right: 0, width: "50vw", height: "60vh",
        background: "radial-gradient(ellipse at right, rgba(255,0,127,0.035) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,240,255,0.35)",
          }}>04 — {t.portfolioTitle}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          aria-label="Mission Archive"
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95,
            textTransform: "uppercase", marginBottom: "0.5rem",
          }}
        >
          <DecryptWord text="Mission" active={inView} />{" "}
          <DecryptWord text="Archive" active={inView} className="glow-pink accent-shine" color="#ff007f" />
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.12 }}
          className="neon-line" style={{ width: "120px", margin: "0.75rem 0 1rem" }}
        />
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: '"JetBrains Mono"', fontSize: "clamp(12px, 1.2vw, 15px)",
            color: "rgba(224,224,232,0.7)", letterSpacing: "0.05em",
            marginBottom: "1.25rem",
            textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 15px rgba(0,240,255,0.12)",
          }}
        >
          {">"} {total} classified records found
        </motion.p>

        {/* Two-panel layout */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem",
          alignItems: "start",
        }} className="mobile-col">
          {/* Left: ARCHIVE_INDEX device */}
          <motion.div
            className="archive-frame hud-corners"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EASE }}
            onMouseMove={stopScan}
          >
            <div className="archive-toprule" aria-hidden="true" />
            <div className="archive-crt" aria-hidden="true" />

            <div className="archive-head">
              <span className="archive-head-label" aria-hidden="true">[ARCHIVE_INDEX v3.1]</span>
              <span className="archive-dots" aria-hidden="true">
                <i style={{ background: "#00f0ff", boxShadow: "0 0 6px rgba(0,240,255,0.6)" }} />
                <i style={{ background: "#ff007f", boxShadow: "0 0 6px rgba(255,0,127,0.6)" }} />
                <i style={{ background: "#ffb800", boxShadow: "0 0 6px rgba(255,184,0,0.6)" }} />
              </span>
            </div>

            {touch && <div className="proj-tap-hint">TAP TO DECRYPT // TAP AGAIN TO OPEN</div>}

            <div className="archive-groups">
              {groups.map(g => (
                <div key={g.num}>
                  <SectionDivider num={g.num} label={g.label} color={g.color} count={g.items.length} />
                  <div style={{ borderTop: "1px solid rgba(0,240,255,0.08)" }}>
                    {g.items.map((p, i) => (
                      <ProjectRow key={p.title} p={p} i={i} accent={g.color}
                        active={activeProject?.title === p.title}
                        touch={touch} onEngage={() => engage(p)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="archive-foot">
              {groups.map(g => (
                <div className="archive-tally" key={g.num}>
                  <span className="tally-label" style={{ color: g.color, textShadow: `0 0 8px ${g.color}55` }}>
                    {g.num}
                  </span>
                  <span className="tally-cells" aria-hidden="true">
                    {Array.from({ length: 8 }).map((_, ci) => (
                      <i key={ci} style={{
                        background: ci < g.items.length ? g.color : `${g.color}20`,
                        boxShadow: ci < g.items.length ? `0 0 4px ${g.color}66` : "none",
                      }} />
                    ))}
                  </span>
                  <span className="tally-count">{String(g.items.length).padStart(2, "0")}</span>
                </div>
              ))}
              <div className="archive-status">
                {">"} archive integrity: 100% — {total} records indexed
                <span className="cursor-blink" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Right: preview panel */}
          <PreviewPanel project={previewProject} scanning={scanning && !hovered} />
        </div>
      </div>
    </section>
  );
}
