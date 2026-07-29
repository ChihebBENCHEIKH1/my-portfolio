import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import "./OpenSource.css";

interface OSItem {
  name: string; org: string; meta: string; badge: string;
  description: string; tech: string[]; url: string;
}

const ACCENTS = ["#00f0ff", "#ff007f", "#ffb800"];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LIFT_SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

export function OpenSource({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const items = (t.openSource || []) as OSItem[];

  return (
    <section id="OpenSource" className="grid-pattern" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "10%", left: "3%", fontSize: "clamp(6rem, 12vw, 12rem)" }}>貢献</span>
      <span className="ghost-num" aria-hidden="true">05</span>

      <div style={{
        position: "absolute", top: "12%", right: 0, width: "42%", height: "70%",
        background: "radial-gradient(ellipse at right top, rgba(0,240,255,0.04) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,240,255,0.35)",
          }}>05 — {t.openSourceTitle}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95,
            textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "-0.02em",
          }}
        >
          Open <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Source</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="neon-line" style={{ width: "120px", marginBottom: "1rem", transformOrigin: "left" }}
        />

        <motion.p
          className="os-statusline" aria-hidden="true"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {"> git fetch upstream :: "}{items.length}{" refs merged "}
          <span className="cursor-blink" aria-hidden="true" />
        </motion.p>

        <div className="os-grid">
          {items.map((it, i) => {
            const c = ACCENTS[i % ACCENTS.length];
            return (
              <motion.a
                key={it.name} href={it.url} target="_blank" rel="noopener noreferrer"
                className="os-card"
                style={{ "--accent": c } as CSSProperties}
                initial={{ opacity: 0, y: 32, rotateX: 8 }}
                whileInView={{
                  opacity: 1, y: 0, rotateX: 0,
                  transition: { delay: i * 0.12, duration: 0.7, ease: EASE },
                }}
                viewport={{ once: true, amount: 0.35 }}
                whileHover={{ y: -6, transition: LIFT_SPRING }}
                whileFocus={{ y: -6, transition: LIFT_SPRING }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="os-corner os-corner-tl" aria-hidden="true" />
                <span className="os-corner os-corner-br" aria-hidden="true" />
                <span className="os-notch" aria-hidden="true" />
                <span className="os-sheen" aria-hidden="true" />
                <svg
                  className="os-glyph" aria-hidden="true" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                >
                  <circle cx="6" cy="6" r="2.6" />
                  <circle cx="6" cy="18" r="2.6" />
                  <circle cx="18" cy="6" r="2.6" />
                  <path d="M6 8.6v6.8" />
                  <path d="M18 8.6a9.4 9.4 0 0 1-9.4 9.4" />
                </svg>

                <div className="os-card-head">
                  <span className="os-badge">{it.badge}</span>
                  <span className="os-meta">{it.meta}</span>
                </div>

                <div className="os-title-row">
                  <h3 className="os-name">{it.name}</h3>
                  <span className="os-org">/ {it.org}</span>
                </div>

                <p className="os-desc">{it.description}</p>

                <div className="os-foot">
                  <div className="os-tags">
                    {it.tech.map((tag) => (
                      <span key={tag} className="os-tag">{tag}</span>
                    ))}
                  </div>
                  <span className="os-arrow" aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in new tab)</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
