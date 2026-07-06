import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function CountUp({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) { setDisplay(value); return; }
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = m[1].includes(".") ? 1 : 0;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((target * eased).toFixed(decimals) + (p === 1 ? suffix : ""));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <>{display}</>;
}

const SKILLS = [
  { label: "Languages & Backend", color: "#00f0ff", tags: ["Python", "TypeScript", "Go", "Node.js", "Express", "FastAPI", "SQL"] },
  { label: "Frontend", color: "#ff007f", tags: ["Next.js", "React", "Tailwind", "React Flow", "Socket.io"] },
  { label: "LLM / AI", color: "#ffb800", tags: ["ReAct Agents", "RAG", "LoRA / PEFT", "LangGraph"] },
  { label: "DevOps & Security", color: "#00f0ff", tags: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Bandit", "Semgrep", "Trivy", "SAST/DAST"] },
];

const STATS = [
  { value: "2+", label: "Years Exp", color: "#00f0ff" },
  { value: "20+", label: "Projects", color: "#ff007f" },
  { value: "99.9%", label: "Uptime", color: "#ffb800" },
];

export function About({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const reveal = (d: number) => ({
    initial: { opacity: 0, y: 24 } as const,
    animate: inView ? { opacity: 1, y: 0 } : ({} as any),
    transition: { delay: d, duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const,
  });

  return (
    <section id="About" ref={ref} className="grid-pattern" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "10%", right: "3%", fontSize: "clamp(6rem, 12vw, 12rem)" }}>概要</span>
      <span className="ghost-num" aria-hidden="true">01</span>

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
            letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
          }}>01 — ABOUT</span>
        </motion.div>

        <motion.h2 {...reveal(0.1)} style={{
          fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 700, color: "#fff", lineHeight: 0.95,
          marginBottom: "1.25rem", textTransform: "uppercase",
        }}>
          Neural <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Profile</span>
        </motion.h2>
        <motion.div {...reveal(0.15)} className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }} />

        {/* Stats row */}
        <motion.div {...reveal(0.12)} style={{
          display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "baseline", gap: "8px",
              padding: "10px 20px",
              background: "rgba(8,10,18,0.6)",
              border: `1px solid ${s.color}18`,
              borderRadius: "6px",
              backdropFilter: "blur(10px)",
            }}>
              <span style={{
                fontFamily: '"Space Grotesk"', fontSize: "1.8rem",
                fontWeight: 700, color: s.color,
                textShadow: `0 0 20px ${s.color}30`,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}><CountUp value={s.value} inView={inView} /></span>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "9px",
                letterSpacing: "0.15em", color: "rgba(224,224,232,0.7)",
                textTransform: "uppercase",
              }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="mobile-col" style={{
          display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.5rem",
        }}>
          {/* Bio card */}
          <motion.div {...reveal(0.15)} style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(8,10,18,0.85), rgba(12,14,24,0.75))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,240,255,0.08)",
            padding: "2.5rem",
            position: "relative", overflow: "hidden",
            boxShadow: "0 4px 30px rgba(0,0,0,0.25), 0 0 40px rgba(0,240,255,0.02)",
          }}>
            {/* Subtle top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg, transparent 10%, rgba(0,240,255,0.3) 50%, transparent 90%)",
            }} />
            {/* Corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "20px",
              borderTop: "1.5px solid rgba(0,240,255,0.25)", borderLeft: "1.5px solid rgba(0,240,255,0.25)",
              borderRadius: "2px 0 0 0",
            }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px",
              borderBottom: "1.5px solid rgba(0,240,255,0.25)", borderRight: "1.5px solid rgba(0,240,255,0.25)",
              borderRadius: "0 0 2px 0",
            }} />

            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              letterSpacing: "0.2em", color: "rgba(0,240,255,0.35)",
              marginBottom: "1.5rem", textTransform: "uppercase",
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
              fontSize: "clamp(13px, 1.4vw, 16px)", lineHeight: "1.9", color: "rgba(224,224,232,0.8)",
              textShadow: "0 0 18px rgba(0,240,255,0.1)",
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
                { lbl: "Primary", val: "Python · TypeScript · Node.js · FastAPI · Next.js", c: "#00f0ff" },
                { lbl: "AI & Security", val: "ReAct · RAG · LoRA/PEFT · Bandit · SAST/DAST", c: "#ff007f" },
              ].map(({ lbl, val, c }) => (
                <div key={lbl}>
                  <div style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "9px",
                    letterSpacing: "0.2em", color: c,
                    marginBottom: "4px", textTransform: "uppercase",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", border: `1.5px solid ${c}50`, background: `${c}10` }} />
                    {lbl}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(224,224,232,0.75)" }}>{val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills card */}
          <motion.div {...reveal(0.25)} style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(8,10,18,0.85), rgba(12,14,24,0.75))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,240,255,0.08)",
            padding: "2.5rem",
            position: "relative",
            boxShadow: "0 4px 30px rgba(0,0,0,0.25), 0 0 40px rgba(0,240,255,0.02)",
          }}>
            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg, transparent 10%, rgba(255,0,127,0.3) 50%, transparent 90%)",
            }} />
            {/* Corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "20px",
              borderTop: "1.5px solid rgba(255,0,127,0.25)", borderLeft: "1.5px solid rgba(255,0,127,0.25)",
              borderRadius: "2px 0 0 0",
            }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px",
              borderBottom: "1.5px solid rgba(255,0,127,0.25)", borderRight: "1.5px solid rgba(255,0,127,0.25)",
              borderRadius: "0 0 2px 0",
            }} />

            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "11px",
              letterSpacing: "0.2em", color: "rgba(0,240,255,0.7)",
              marginBottom: "2rem", textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0,240,255,0.25)",
            }}>
              {">"} skills.list()
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {SKILLS.map((group, gi) => (
                <div key={group.label}>
                  <div style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "11px",
                    letterSpacing: "0.25em", color: group.color,
                    textShadow: `0 0 8px ${group.color}40`,
                    marginBottom: "0.75rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    textTransform: "uppercase",
                  }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: group.color, boxShadow: `0 0 8px ${group.color}40`,
                    }} />
                    {group.label}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {group.tags.map((tag, ti) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 + gi * 0.1 + ti * 0.05 }}
                        style={{
                          fontFamily: '"JetBrains Mono"', fontSize: "11px",
                          padding: "6px 14px", letterSpacing: "0.08em",
                          border: `1px solid ${group.color}30`,
                          color: "rgba(224,224,232,0.8)",
                          background: `${group.color}08`,
                          borderRadius: "4px",
                          transition: "all 0.2s",
                        }}
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
