import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

interface OSItem {
  name: string; org: string; meta: string; badge: string;
  description: string; tech: string[]; url: string;
}

export function OpenSource({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const items = (t.openSource || []) as OSItem[];
  const colors = ["#00f0ff", "#ff007f", "#ffb800"];

  return (
    <section id="OpenSource" ref={ref} className="grid-pattern" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "10%", left: "3%", fontSize: "clamp(6rem, 12vw, 12rem)" }}>貢献</span>
      <span className="ghost-num" aria-hidden="true">04</span>

      <div style={{
        position: "absolute", top: "12%", right: 0, width: "42%", height: "70%",
        background: "radial-gradient(ellipse at right top, rgba(0,240,255,0.04) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
          }}>04 — {t.openSourceTitle}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95,
            textTransform: "uppercase", marginBottom: "1.25rem",
          }}
        >
          Open <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Source</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }}
        />

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem",
        }}>
          {items.map((it, i) => {
            const c = colors[i % colors.length];
            return (
              <motion.a
                key={it.name} href={it.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="cyber-card hud-corners"
                style={{ display: "flex", flexDirection: "column", padding: "1.5rem", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "8px", letterSpacing: "0.2em",
                    textTransform: "uppercase", color: c, background: `${c}12`,
                    border: `1px solid ${c}30`, padding: "4px 10px",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}>{it.badge}</span>
                  <span style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "9px",
                    letterSpacing: "0.1em", color: "rgba(224,224,232,0.42)",
                  }}>{it.meta}</span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <h3 style={{
                    fontFamily: '"Space Grotesk"', fontSize: "1.5rem", fontWeight: 700,
                    color: "#fff", textTransform: "uppercase", lineHeight: 1,
                  }}>{it.name}</h3>
                  <span style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "10px", color: c, letterSpacing: "0.08em",
                  }}>/ {it.org}</span>
                </div>

                <p style={{
                  fontSize: "13px", lineHeight: 1.8, color: "rgba(224,224,232,0.72)",
                  flex: 1, marginBottom: "1.1rem",
                }}>{it.description}</p>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "0.5rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(0,240,255,0.06)",
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {it.tech.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: '"JetBrains Mono"', fontSize: "8px", letterSpacing: "0.05em",
                        color: "rgba(224,224,232,0.6)", border: "1px solid rgba(0,240,255,0.12)",
                        padding: "2px 7px",
                      }}>{tag}</span>
                    ))}
                  </div>
                  <span style={{ color: c, fontSize: "14px" }}>↗</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
