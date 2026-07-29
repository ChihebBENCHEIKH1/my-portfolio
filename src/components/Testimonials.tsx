import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import "./Testimonials.css";

const GLYPHS = "アカサタナハマヤ0123456789ABCDEF#%&*<>/=+";

/**
 * Local decrypt: reveals `text` left→right over ~1.1s once `active` flips true.
 * Reduced motion → renders the final text immediately. Runs once.
 */
function useDecrypt(text: string, active: boolean, delay: number) {
  const [out, setOut] = useState(text);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let start = 0;
    const dur = 1100;
    const timer = window.setTimeout(() => {
      setRunning(true);
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min((now - start) / dur, 1);
        const frontier = Math.floor(p * text.length);
        let s = text.slice(0, frontier);
        for (let idx = frontier; idx < text.length; idx++) {
          const c = text[idx];
          s += c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else {
          setOut(text);
          setRunning(false);
        }
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [text, active, delay]);

  return { out, running };
}

function TestimonialCard({ item, i }: {
  item: { img: string; name: string; email: string; testimonial: string };
  i: number;
}) {
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const tiltRaf = useRef(0);
  const cardInView = useInView(cardRef, { once: true, amount: 0.3 });
  const accent = i % 2 === 0 ? "#00f0ff" : "#ff007f";
  const accentAlt = i % 2 === 0 ? "#ff007f" : "#ffb800";
  const { out: quote, running: decrypting } = useDecrypt(item.testimonial, cardInView, 350 + i * 180);

  useEffect(() => () => cancelAnimationFrame(tiltRaf.current), []);

  // rAF-throttled tilt: store the latest pointer, flush once per frame.
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    pointer.current = { x: e.clientX, y: e.clientY };
    if (tiltRaf.current) return;
    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0;
      const el = tiltRef.current;
      const p = pointer.current;
      if (!el || !p) return;
      const r = el.getBoundingClientRect();
      const px = (p.x - r.left) / r.width - 0.5;
      const py = (p.y - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
    });
  };
  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  const live = hovering && !reduced;

  return (
    <motion.div
      ref={cardRef}
      className="tst-card"
      tabIndex={0}
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); resetTilt(); }}
      onFocus={() => setHovering(true)}
      onBlur={() => { setHovering(false); resetTilt(); }}
      onMouseMove={handleTilt}
    >
      {/* Neon gradient rim around the angled clip */}
      <div
        ref={tiltRef}
        className="tst-frame"
        style={{
          background: hovering
            ? `linear-gradient(135deg, ${accent}80, ${accentAlt}40, ${accent}80)`
            : `linear-gradient(135deg, ${accent}30, transparent, ${accent}20)`,
          boxShadow: hovering
            ? `0 0 30px ${accent}15, 0 0 60px ${accent}08`
            : "none",
        }}
      >
        <div className="tst-panel holo-shimmer">
          {/* Data-pad header bar */}
          <div style={{
            padding: "0.75rem 1.5rem",
            borderBottom: `1px solid ${accent}15`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: `linear-gradient(90deg, ${accent}06, transparent)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.div
                animate={live ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.7 }}
                transition={live ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
                style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: accent, boxShadow: `0 0 8px ${accent}`,
                }}
              />
              <span aria-hidden="true" style={{
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.28em", color: `${accent}b3`,
                textTransform: "uppercase",
                textShadow: `0 0 8px ${accent}30`,
              }}>
                DATA_PAD //0{i + 1}
              </span>
            </div>
            <div aria-hidden="true" style={{ display: "flex", gap: "3px" }}>
              {[accent, accentAlt, "rgba(255,255,255,0.1)"].map((c, ci) => (
                <div key={ci} style={{
                  width: "3px", height: "8px", background: c, opacity: 0.4,
                  borderRadius: "1px",
                }} />
              ))}
            </div>
          </div>

          <div style={{ padding: "1.75rem 1.75rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header: glowing avatar + info */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
              {/* Glowing avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <motion.div
                  animate={live ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={live ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
                  style={{
                    width: "54px", height: "54px",
                    borderRadius: "6px", overflow: "hidden",
                    boxShadow: hovering
                      ? `0 0 20px ${accent}40, 0 0 40px ${accent}20`
                      : `0 0 10px ${accent}20`,
                    transition: "box-shadow 0.4s",
                  }}
                >
                  <img src={item.img} alt={item.name} loading="lazy" decoding="async" width="108" height="108" style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: hovering ? "brightness(1.2) saturate(1.2)" : "brightness(0.85)",
                    transition: "filter 0.4s",
                  }} />
                </motion.div>
                {/* Corner brackets */}
                <div aria-hidden="true" style={{
                  position: "absolute", top: -4, left: -4,
                  width: "12px", height: "12px",
                  borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`,
                }} />
                <div aria-hidden="true" style={{
                  position: "absolute", bottom: -4, right: -4,
                  width: "12px", height: "12px",
                  borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                {/* Neon name — dark occluder first, glow second */}
                <div style={{
                  fontFamily: '"Space Grotesk"', fontSize: "1rem",
                  fontWeight: 700, color: "#fff",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  textShadow: hovering
                    ? `0 1px 2px rgba(0,0,0,0.7), 0 0 12px ${accent}60, 0 0 24px ${accent}30`
                    : "0 1px 2px rgba(0,0,0,0.7)",
                  transition: "text-shadow 0.4s",
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontFamily: '"JetBrains Mono"', fontSize: "10px",
                  color: `${accent}bf`, marginTop: "4px",
                  letterSpacing: "0.1em",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                }}>
                  {item.email}
                </div>
              </div>

              {/* Decorative quote — pulses toward the accent while decrypting */}
              <div aria-hidden="true" style={{
                fontFamily: '"Space Grotesk"', fontSize: "4rem",
                fontWeight: 700, lineHeight: 0.6,
                color: decrypting ? `${accent}30` : `${accent}10`,
                textShadow: decrypting ? `0 0 20px ${accent}30` : "none",
                transition: "color 0.4s, text-shadow 0.4s",
                userSelect: "none",
              }}>"</div>
            </div>

            {/* Testimonial text with vertical accent */}
            <div style={{ position: "relative", flex: 1 }}>
              <div aria-hidden="true" style={{
                position: "absolute", top: 0, left: 0, width: "2px", height: "100%",
                background: `linear-gradient(to bottom, ${accent}50, ${accentAlt}30, transparent)`,
                boxShadow: `0 0 8px ${accent}20`,
              }} />
              <p style={{
                fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: "1.95",
                color: "rgba(232,234,240,0.92)",
                textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                paddingLeft: "1.25rem",
                fontStyle: "italic",
              }}>
                <span className="sr-only">{item.testimonial}</span>
                <span aria-hidden="true">{quote}</span>
              </p>
            </div>

            {/* Bottom status bar with signal bars */}
            <div style={{
              marginTop: "1.5rem", paddingTop: "1rem",
              borderTop: `1px solid ${accent}10`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <motion.div
                  animate={live ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.7 }}
                  transition={live ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
                  style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: accent, boxShadow: `0 0 8px ${accent}`,
                  }}
                />
                <span style={{
                  fontFamily: '"JetBrains Mono"', fontSize: "10px",
                  color: "rgba(224,224,232,0.7)", letterSpacing: "0.14em",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                }}>VERIFIED</span>
                {/* Signal bars — animate only while hovered/focused */}
                <div aria-hidden="true" style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px" }}>
                  {[3, 5, 7, 10].map((h, bi) => (
                    <motion.div
                      key={bi}
                      animate={live ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.55 }}
                      transition={live
                        ? { duration: 1.5, repeat: Infinity, delay: bi * 0.2 }
                        : { duration: 0.3 }}
                      style={{
                        width: "2px", height: `${h}px`,
                        background: accent, borderRadius: "1px",
                        transformOrigin: "bottom",
                        opacity: 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span aria-hidden="true" style={{
                fontFamily: '"JetBrains Mono"', fontSize: "9px",
                color: `${accent}66`, letterSpacing: "0.1em",
              }}>REF_0{i + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="Testimonials" ref={ref} className="grid-pattern cv-auto" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "10%", right: "5%", fontSize: "clamp(5rem, 12vw, 11rem)" }}>証言</span>
      <span className="ghost-num" aria-hidden="true">06</span>

      <div style={{
        position: "absolute", top: "10%", left: "5%", width: "40vw", height: "50vh",
        background: "radial-gradient(ellipse, rgba(0,240,255,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%", width: "30vw", height: "40vh",
        background: "radial-gradient(ellipse, rgba(255,0,127,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
          }}>
            06 — {t.testimonialsTitle}
          </span>
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
          Signal <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Intercepts</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.12 }}
          className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "1.75rem",
        }}>
          {t.testimonials.map((item: { img: string; name: string; email: string; testimonial: string }, i: number) => (
            <TestimonialCard key={item.name} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
