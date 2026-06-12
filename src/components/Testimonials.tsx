import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

function TestimonialCard({ item, i, inView }: {
  item: { img: string; name: string; email: string; testimonial: string };
  i: number; inView: boolean;
}) {
  const [hovering, setHovering] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const accent = i % 2 === 0 ? "#00f0ff" : "#ff007f";
  const accentAlt = i % 2 === 0 ? "#ff007f" : "#ffb800";

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
  };
  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay: i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); resetTilt(); }}
      onMouseMove={handleTilt}
      style={{
        perspective: "800px",
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${i * 0.8}s`,
      }}
    >
      {/* Neon border wrapper for angled clip */}
      <div ref={tiltRef} style={{
        transformStyle: "preserve-3d",
        padding: "1px",
        background: hovering
          ? `linear-gradient(135deg, ${accent}80, ${accentAlt}40, ${accent}80)`
          : `linear-gradient(135deg, ${accent}30, transparent, ${accent}20)`,
        clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
        transition: "background 0.5s, transform 0.15s ease-out",
        boxShadow: hovering
          ? `0 0 30px ${accent}15, 0 0 60px ${accent}08`
          : "none",
      }}>
        <div style={{
          background: "rgba(8,10,18,0.92)",
          backdropFilter: "blur(12px)",
          clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
        }}>
          {/* Holographic shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(105deg, transparent 30%, ${accent}08 38%, ${accentAlt}05 44%, transparent 52%)`,
            backgroundSize: "200% 100%",
            animation: hovering ? "holo-shimmer 3s ease-in-out infinite" : "none",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* Data-pad header bar */}
          <div style={{
            padding: "0.75rem 1.5rem",
            borderBottom: `1px solid ${accent}15`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: `linear-gradient(90deg, ${accent}06, transparent)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: accent, boxShadow: `0 0 8px ${accent}`,
                }}
              />
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "8px",
                letterSpacing: "0.2em", color: `${accent}60`,
                textTransform: "uppercase",
              }}>
                DATA_PAD //0{i + 1}
              </span>
            </div>
            <div style={{ display: "flex", gap: "3px" }}>
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
                  animate={hovering ? { scale: [1, 1.04, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
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
                <div style={{
                  position: "absolute", top: -4, left: -4,
                  width: "12px", height: "12px",
                  borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`,
                }} />
                <div style={{
                  position: "absolute", bottom: -4, right: -4,
                  width: "12px", height: "12px",
                  borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                {/* Neon name */}
                <div style={{
                  fontFamily: '"Space Grotesk"', fontSize: "1rem",
                  fontWeight: 700, color: "#fff",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  textShadow: hovering ? `0 0 12px ${accent}60, 0 0 24px ${accent}30` : "none",
                  transition: "text-shadow 0.4s",
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontFamily: '"JetBrains Mono"', fontSize: "9px",
                  color: accent, opacity: 0.5, marginTop: "4px",
                  letterSpacing: "0.1em",
                }}>
                  {item.email}
                </div>
              </div>

              {/* Decorative quote */}
              <div style={{
                fontFamily: '"Space Grotesk"', fontSize: "4rem",
                fontWeight: 700, lineHeight: 0.6,
                color: `${accent}10`, userSelect: "none",
              }}>"</div>
            </div>

            {/* Testimonial text with vertical accent */}
            <div style={{ position: "relative", flex: 1 }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: "2px", height: "100%",
                background: `linear-gradient(to bottom, ${accent}50, ${accentAlt}30, transparent)`,
                boxShadow: `0 0 8px ${accent}20`,
              }} />
              <p style={{
                fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: "1.95",
                color: "rgba(224,224,232,0.8)",
                textShadow: "0 0 12px rgba(0,240,255,0.06)",
                paddingLeft: "1.25rem",
                fontStyle: "italic",
              }}>
                {item.testimonial}
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
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: accent, boxShadow: `0 0 8px ${accent}`,
                  }}
                />
                <span style={{
                  fontFamily: '"JetBrains Mono"', fontSize: "8px",
                  color: "rgba(224,224,232,0.2)", letterSpacing: "0.15em",
                }}>VERIFIED</span>
                {/* Signal bars */}
                <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px" }}>
                  {[3, 5, 7, 10].map((h, bi) => (
                    <motion.div
                      key={bi}
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: bi * 0.2 }}
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
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "8px",
                color: `${accent}30`, letterSpacing: "0.1em",
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
      <span className="ghost-num" aria-hidden="true">04</span>

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
            letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
          }}>
            04 — {t.testimonialsTitle}
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
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.75rem",
        }}>
          {t.testimonials.map((item: { img: string; name: string; email: string; testimonial: string }, i: number) => (
            <TestimonialCard key={item.name} item={item} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
