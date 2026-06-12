import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useSceneStore } from "../store/sceneStore";

function DataNode({
  job,
  i,
  accent,
  inView,
}: {
  job: { img: string; title: string; company: string; description: string };
  i: number;
  accent: string;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const setHoveredJobIndex = useSceneStore((s) => s.setHoveredJobIndex);

  const handleEnter = () => { setHovered(true); setHoveredJobIndex(i); };
  const handleLeave = () => { setHovered(false); setHoveredJobIndex(null); };

  return (
    <div style={{ display: "flex", gap: "0", alignItems: "stretch", position: "relative" }}>
      {/* Timeline spine — left side */}
      <div style={{
        width: "60px", flexShrink: 0, display: "flex", flexDirection: "column",
        alignItems: "center", position: "relative",
      }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "2px",
          background: `linear-gradient(to bottom, ${accent}30, ${accent}15, ${accent}30)`,
        }} />
        {/* Node dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
          style={{
            position: "relative", top: "2rem", zIndex: 2,
            width: "16px", height: "16px",
            background: hovered ? accent : "rgba(8,10,18,0.9)",
            border: `2px solid ${accent}`,
            borderRadius: "2px",
            transform: "rotate(45deg)",
            boxShadow: hovered
              ? `0 0 15px ${accent}80, 0 0 30px ${accent}40`
              : `0 0 6px ${accent}30`,
            transition: "all 0.4s",
          }}
        />
        {/* Pulse ring on hover */}
        {hovered && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: "absolute", top: "calc(2rem + 2px)", zIndex: 1,
              width: "12px", height: "12px",
              border: `1px solid ${accent}`,
              borderRadius: "2px", transform: "rotate(45deg)",
            }}
          />
        )}
      </div>

      {/* Data node card */}
      <motion.div
        initial={{ opacity: 0, x: -24, scale: 0.97 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          flex: 1, position: "relative", overflow: "hidden",
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          background: hovered
            ? "rgba(8,10,18,0.95)"
            : "rgba(8,10,18,0.8)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${hovered ? accent + "40" : accent + "15"}`,
          boxShadow: hovered
            ? `0 8px 40px rgba(0,0,0,0.5), 0 0 30px ${accent}12, 0 0 60px ${accent}06`
            : "0 4px 25px rgba(0,0,0,0.35)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          marginBottom: "1.5rem",
        }}
      >
        {/* Top neon line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: hovered
            ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
            : `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
          opacity: hovered ? 0.8 : 0.5,
          transition: "all 0.4s",
        }} />

        {/* Scanline overlay on hover */}
        {hovered && (
          <motion.div
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
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          pointerEvents: "none", zIndex: 3,
        }} />

        {/* Header bar */}
        <div style={{
          padding: "1rem 1.5rem 0.75rem",
          borderBottom: `1px solid ${accent}12`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono"', fontSize: "9px",
            letterSpacing: "0.2em", color: `${accent}80`,
            textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: accent, boxShadow: `0 0 8px ${accent}`,
              }}
            />
            DATA_NODE //0{i + 1}
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono"', fontSize: "8px",
            color: hovered ? accent : "rgba(224,224,232,0.2)",
            letterSpacing: "0.15em",
            transition: "color 0.3s",
          }}>
            {hovered ? "DECRYPTED" : "ENCRYPTED"}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {/* Company logo */}
          <div style={{
            width: "52px", height: "52px", flexShrink: 0, position: "relative",
          }}>
            <img src={job.img} alt={job.company} style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: "4px",
              border: `1px solid ${accent}40`,
              filter: hovered ? "brightness(1.1)" : "brightness(0.8)",
              transition: "filter 0.3s",
            }} />
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: -2, left: -2, width: "8px", height: "8px",
              borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`,
              opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s",
            }} />
            <div style={{ position: "absolute", bottom: -2, right: -2, width: "8px", height: "8px",
              borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`,
              opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s",
            }} />
          </div>

          <div style={{ flex: 1 }}>
            <span style={{
              display: "inline-block", marginBottom: "6px",
              padding: "3px 12px",
              clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)",
              background: `${accent}15`, color: accent,
              fontFamily: '"JetBrains Mono"', fontSize: "8px",
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>{job.title}</span>
            <h3 style={{
              fontFamily: '"Space Grotesk"', fontSize: "1.4rem",
              fontWeight: 700, color: "#fff", lineHeight: 1.1,
              textTransform: "uppercase", marginBottom: "0.75rem",
              textShadow: hovered ? `0 0 15px ${accent}20` : "none",
              transition: "text-shadow 0.3s",
            }}>{job.company}</h3>
            <p style={{
              fontSize: "clamp(12px, 1.3vw, 15px)", lineHeight: "1.8",
              color: hovered ? "rgba(224,224,232,0.85)" : "rgba(224,224,232,0.65)",
              textShadow: hovered ? "0 0 15px rgba(0,240,255,0.08)" : "none",
              transition: "all 0.3s",
            }}>{job.description}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "0.75rem 1.5rem",
          borderTop: `1px solid rgba(255,255,255,0.04)`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "14px", height: "2px", background: accent, boxShadow: `0 0 4px ${accent}40` }} />
            <span style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              color: "rgba(224,224,232,0.2)", letterSpacing: "0.15em",
            }}>SECTOR_0{i + 1}</span>
          </div>
          {/* Signal bars */}
          <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
            {[0, 1, 2, 3].map(bi => (
              <motion.div
                key={bi}
                animate={hovered ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.3 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: bi * 0.15 }}
                style={{
                  width: "2px", height: `${6 + bi * 3}px`,
                  background: accent, transformOrigin: "bottom",
                  opacity: hovered ? 0.8 : 0.3,
                  transition: "opacity 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom neon line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, ${accent}30, transparent)`,
        }} />
      </motion.div>
    </div>
  );
}

export function WorkExperience({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const jobs: { img: string; title: string; company: string; description: string }[] = t.workExperienceList;

  const colors = ["#00f0ff", "#ff007f", "#ffb800"];

  return (
    <section id="WorkExperience" ref={ref} className="grid-pattern cv-auto" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ top: "8%", right: "5%", fontSize: "clamp(5rem, 12vw, 11rem)" }}>経験</span>
      <span className="ghost-num" aria-hidden="true">02</span>

      <div style={{
        position: "absolute", top: "20%", left: "5%", width: "40vw", height: "60vh",
        background: "radial-gradient(ellipse, rgba(0,240,255,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}
        >
          <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "10px",
            letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
          }}>
            02 — {t.workExperience}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95, textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          Where I've <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Shipped</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="neon-line" style={{ width: "120px", marginBottom: "2.5rem" }}
        />

        {/* Vertical timeline */}
        <div style={{ position: "relative" }}>
          {jobs.map((job, i) => (
            <DataNode
              key={job.company}
              job={job}
              i={i}
              accent={colors[i % colors.length]}
              inView={inView}
            />
          ))}

          {/* Terminal end cap */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0",
          }}>
            <div style={{
              width: "60px", display: "flex", justifyContent: "center", flexShrink: 0,
            }}>
              <div style={{
                width: "8px", height: "8px",
                background: "#00f0ff",
                borderRadius: "50%",
                boxShadow: "0 0 10px #00f0ff80, 0 0 20px #00f0ff40",
              }} />
            </div>
            <span style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              color: "rgba(0,240,255,0.3)", letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>
              {">"} END_OF_TRANSMISSION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
