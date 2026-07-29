import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./About.css";

function CountUp({ value, inView }: { value: string; inView: boolean }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  const [num, setNum] = useState(m ? "0" : value);
  const [flare, setFlare] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const mm = value.match(/^([\d.]+)(.*)$/);
    if (!mm) { setNum(value); return; }
    const target = parseFloat(mm[1]);
    const decimals = mm[1].includes(".") ? 1 : 0;
    // Reduced motion: land on the final value immediately, no flare.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setNum(target.toFixed(decimals));
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    let flareTimer = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setNum((target * eased).toFixed(decimals));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setFlare(true);
        flareTimer = window.setTimeout(() => setFlare(false), 750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(flareTimer); };
  }, [inView, value]);

  return (
    <span className={flare ? "stat-num stat-num-flare" : "stat-num"}>
      <span className="stat-num-digits" style={m ? { minWidth: `${m[1].length}ch` } : undefined}>{num}</span>
      <span>{m ? m[2] : ""}</span>
    </span>
  );
}

function Gauge({ filled }: { filled: number }) {
  return (
    <div className="stat-gauge" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className={i < filled ? (i === filled - 1 ? "stat-cell on live" : "stat-cell on") : "stat-cell"}
        />
      ))}
    </div>
  );
}

const SKILLS = [
  { label: "LLM / AI", color: "#00f0ff", tags: ["ReAct Agents", "RAG", "LoRA / PEFT", "LangGraph", "LLM Integration"] },
  { label: "Languages & Backend", color: "#ff007f", tags: ["Python", "TypeScript", "Go", "Node.js", "Express", "FastAPI"] },
  { label: "Frontend", color: "#ffb800", tags: ["Next.js", "React", "Tailwind", "React Flow", "Socket.io"] },
  { label: "DevOps & Security", color: "#00f0ff", tags: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Bandit", "Semgrep", "Trivy", "SAST/DAST"] },
];

const STATS = [
  { value: "2+", label: "Years Exp", color: "#00f0ff", gauge: 4 },
  { value: "20+", label: "Projects", color: "#ff007f", gauge: 5 },
  { value: "99.9%", label: "Uptime", color: "#ffb800", gauge: 6 },
];

export function About({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  const reveal = (d: number) => ({
    initial: { opacity: 0, y: 24 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: "-40px" } as const,
    transition: { delay: d, duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const,
  });

  return (
    <section id="About" className="grid-pattern" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "10%", right: "3%", fontSize: "clamp(6rem, 12vw, 12rem)" }}>概要</span>
      <span className="ghost-num" aria-hidden="true">02</span>

      <div style={{
        position: "absolute", top: 0, right: 0, width: "40%", height: "80%",
        background: "radial-gradient(ellipse at right top, rgba(255,0,127,0.04) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div {...reveal(0)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,240,255,0.35)",
          }}>02 — ABOUT</span>
        </motion.div>

        <motion.h2 {...reveal(0.1)} style={{
          fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 700, color: "#fff", lineHeight: 0.95,
          marginBottom: "1.25rem", textTransform: "uppercase",
        }}>
          Neural <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Profile</span>
        </motion.h2>
        <motion.div {...reveal(0.15)} className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }} />

        {/* Stats row — live gauge modules */}
        <div ref={statsRef} className="stats-row">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-chip hud-corners"
              style={{ "--accent": s.color } as CSSProperties}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{
                opacity: 1, y: 0,
                transition: { delay: 0.12 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
            >
              <div className="stat-rule" aria-hidden="true" />
              <div className="stat-top">
                <CountUp value={s.value} inView={statsInView} />
                <span className="stat-label">{s.label}</span>
              </div>
              <Gauge filled={s.gauge} />
            </motion.div>
          ))}
        </div>

        <div className="mobile-col" style={{
          display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.5rem",
        }}>
          {/* Bio card */}
          <motion.div {...reveal(0.15)} className="about-panel hud-corners">
            <div className="panel-rule" aria-hidden="true" />

            <div aria-hidden="true" style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              letterSpacing: "0.28em", color: "rgba(0,240,255,0.6)",
              marginBottom: "1.5rem", textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0,240,255,0.25)",
            }}>
              {">"} profile.load()
            </div>
            <h3 style={{
              fontFamily: '"Space Grotesk"', fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 700, color: "#fff", lineHeight: 1.05,
              marginBottom: "1.5rem", textTransform: "uppercase",
            }}>
              Software Engineer<br />
              <span style={{ color: "#00f0ff", textShadow: "0 0 20px rgba(0,240,255,0.2)" }}>&amp; Secure AI Builder</span>
            </h3>
            <p style={{
              fontSize: "clamp(13px, 1.4vw, 16px)", lineHeight: "1.9", color: "rgba(224,224,232,0.85)",
              textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 18px rgba(0,240,255,0.08)",
              borderLeft: "2px solid rgba(0,240,255,0.35)",
              paddingLeft: "0.75rem",
            }}>
              {t.headerDescription}
            </p>

            {/* Tech summary */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
              marginTop: "2rem", paddingTop: "1.5rem",
              borderTop: "1px solid rgba(0,240,255,0.06)",
            }}>
              {[
                { lbl: "AI Systems", val: "ReAct · RAG · LoRA/PEFT · LangGraph", c: "#00f0ff" },
                { lbl: "Stack & Security", val: "Python · TypeScript · FastAPI · Next.js · SAST/DAST", c: "#ff007f" },
              ].map(({ lbl, val, c }) => (
                <div key={lbl}>
                  <div style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "10px",
                    letterSpacing: "0.14em", color: c,
                    marginBottom: "4px", textTransform: "uppercase",
                    textShadow: `0 0 8px ${c}40`,
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <div aria-hidden="true" style={{ width: "8px", height: "8px", border: `1.5px solid ${c}50`, background: `${c}10` }} />
                    {lbl}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(224,224,232,0.75)" }}>{val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills card */}
          <motion.div {...reveal(0.25)} className="about-panel about-panel-pink scan-sweep">
            <div className="panel-rule panel-rule-pink" aria-hidden="true" />
            {/* Corner accents (pink — panel ::before/::after are taken by scan-sweep) */}
            <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "20px",
              borderTop: "2px solid rgba(255,0,127,0.35)", borderLeft: "2px solid rgba(255,0,127,0.35)",
            }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px",
              borderBottom: "2px solid rgba(255,0,127,0.35)", borderRight: "2px solid rgba(255,0,127,0.35)",
            }} />

            <div aria-hidden="true" style={{
              fontFamily: '"JetBrains Mono"', fontSize: "11px",
              letterSpacing: "0.28em", color: "rgba(0,240,255,0.7)",
              marginBottom: "2rem", textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0,240,255,0.25)",
            }}>
              {">"} skills.list()
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {SKILLS.map((group, gi) => (
                <div key={group.label} style={{ "--accent": group.color } as CSSProperties}>
                  <div style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "11px",
                    letterSpacing: "0.14em", color: group.color,
                    textShadow: `0 0 8px ${group.color}40`,
                    marginBottom: "0.75rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    textTransform: "uppercase",
                  }}>
                    <div aria-hidden="true" style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: group.color, boxShadow: `0 0 8px ${group.color}40`,
                    }} />
                    {group.label}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {group.tags.map((tag, ti) => (
                      <motion.span
                        key={tag}
                        className="skill-tag"
                        initial={{ opacity: 0, scale: 0.92, y: 6 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: gi * 0.08 + ti * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >{tag}</motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
