import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

interface Project { title: string; description: string; technologies: string[]; websiteURL: string; image: string; }

/* ── Preview Panel (right side) ── */
function PreviewPanel({ project }: { project: Project | null }) {
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
        opacity: project ? 0.8 : 0.4, transition: "all 0.4s",
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
          <div style={{
            width: "6px", height: "6px",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: project ? "#00f0ff" : "rgba(0,240,255,0.2)",
            boxShadow: project ? "0 0 6px #00f0ff50" : "none",
            transition: "all 0.3s",
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: "8px",
            letterSpacing: "0.2em", color: "rgba(0,240,255,0.35)",
          }}>PREVIEW_FEED</span>
        </div>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: project ? "#00ff88" : "rgba(255,255,255,0.1)",
          boxShadow: project ? "0 0 6px #00ff88" : "none",
          transition: "all 0.3s",
        }} />
      </div>

      {/* Image area */}
      <div style={{
        height: "200px", position: "relative", overflow: "hidden",
        background: "rgba(0,0,0,0.3)",
      }}>
        {project ? (
          <>
            <img
              key={project.title}
              src={project.image} alt={project.title}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "brightness(0.8) saturate(1.1)",
                animation: "fadeIn 0.3s ease",
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
        ) : (
          <div style={{
            height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: '"JetBrains Mono"', fontSize: "9px",
            color: "rgba(0,240,255,0.15)", letterSpacing: "0.15em",
          }}>
            AWAITING_SIGNAL...
          </div>
        )}
      </div>

      {/* Details area */}
      <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
        {project ? (
          <>
            <h4 style={{
              fontFamily: '"Space Grotesk"', fontSize: "1.1rem",
              fontWeight: 700, color: "#fff", textTransform: "uppercase",
              lineHeight: 1.2, marginBottom: "0.5rem",
            }}>{project.title}</h4>

            <p style={{
              fontSize: "12px", lineHeight: 1.75, color: "rgba(224,224,232,0.7)",
              marginBottom: "0.75rem",
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
                    fontFamily: '"JetBrains Mono"', fontSize: "8px",
                    padding: "2.5px 8px", letterSpacing: "0.05em",
                    color: c, opacity: 0.6,
                    background: `${c}08`, border: `1px solid ${c}18`,
                    clipPath: "polygon(5px 0, calc(100% - 5px) 0, 100% 50%, calc(100% - 5px) 100%, 5px 100%, 0 50%)",
                  }}>{tag}</span>
                );
              })}
            </div>

            {/* Stack depth */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", marginTop: "0.65rem",
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "7px",
                color: "rgba(0,240,255,0.25)", letterSpacing: "0.15em",
              }}>STACK</span>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 6 }).map((_, si) => (
                  <div key={si} style={{
                    width: "8px", height: "3px", borderRadius: "1px",
                    background: si < Math.min(project.technologies.length, 6)
                      ? (si < 2 ? "#00f0ff" : si < 4 ? "#ffb800" : "#ff007f")
                      : "rgba(255,255,255,0.04)",
                  }} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: '"JetBrains Mono"', fontSize: "9px",
            color: "rgba(0,240,255,0.12)", letterSpacing: "0.1em",
            padding: "1rem 0",
          }}>{">"} hover a record to preview</div>
        )}
      </div>

      {/* Bottom neon */}
      <div style={{
        height: "1px",
        background: project
          ? "linear-gradient(90deg, transparent, #00f0ff40, #ff007f40, transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,240,255,0.05), transparent)",
        transition: "all 0.3s",
      }} />
    </div>
  );
}

/* ── Project Row ── */
function ProjectRow({ p, i, inView, active, onHover }: {
  p: Project; i: number; inView: boolean; active: boolean;
  onHover: () => void;
}) {
  return (
    <motion.a
      href={p.websiteURL} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onHover}
      style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "1rem 1.25rem",
        textDecoration: "none", position: "relative",
        borderBottom: "1px solid rgba(0,240,255,0.04)",
        transition: "background 0.25s",
        background: active ? "rgba(0,240,255,0.03)" : "transparent",
      }}
    >
      {/* Left accent */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
        background: active ? "linear-gradient(to bottom, #00f0ff, #ff007f)" : "transparent",
        boxShadow: active ? "0 0 8px rgba(0,240,255,0.3)" : "none",
        transition: "all 0.25s",
      }} />

      {/* Index */}
      <span style={{
        fontFamily: '"JetBrains Mono"', fontSize: "11px",
        color: active ? "#00f0ff" : "rgba(0,240,255,0.18)",
        textShadow: active ? "0 0 6px rgba(0,240,255,0.3)" : "none",
        letterSpacing: "0.1em", minWidth: "24px",
        transition: "all 0.25s",
      }}>{String(i + 1).padStart(2, "0")}</span>

      {/* Diamond */}
      <div style={{
        width: "7px", height: "7px", flexShrink: 0,
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        background: active ? "#00f0ff" : "rgba(0,240,255,0.12)",
        boxShadow: active ? "0 0 6px #00f0ff40" : "none",
        transition: "all 0.25s",
      }} />

      {/* Title */}
      <span style={{
        fontFamily: '"Space Grotesk"', fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
        fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.55)",
        textTransform: "uppercase", flex: 1,
        letterSpacing: "0.02em",
        transition: "color 0.25s",
      }}>{p.title}</span>

      {/* Tech count badge */}
      <span className="hide-mobile" style={{
        fontFamily: '"JetBrains Mono"', fontSize: "8px",
        padding: "2px 8px", letterSpacing: "0.1em",
        color: active ? "rgba(0,240,255,0.5)" : "rgba(0,240,255,0.15)",
        border: `1px solid ${active ? "rgba(0,240,255,0.15)" : "rgba(0,240,255,0.06)"}`,
        clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
        transition: "all 0.25s",
      }}>{p.technologies.length} TECH</span>

      {/* Arrow */}
      <span style={{
        color: active ? "#00f0ff" : "rgba(0,240,255,0.1)",
        fontSize: "13px",
        transition: "all 0.25s",
        transform: active ? "translateX(2px)" : "translateX(0)",
        display: "inline-block",
      }}>→</span>
    </motion.a>
  );
}

/* ── Section divider ── */
function SectionDivider({ num, label, color, count, inView }: {
  num: string; label: string; color: string; count: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "2.5rem 0 0.5rem" }}
    >
      <div style={{
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
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${color}10, transparent)` }} />
      <span style={{
        fontFamily: '"JetBrains Mono"', fontSize: "7.5px",
        color: "rgba(224,224,232,0.15)", letterSpacing: "0.12em",
      }}>[{count}]</span>
    </motion.div>
  );
}

export function Portfolio({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const projects = t.projects as Project[];
  const backendProjects = t.backendProjectsList as Project[];
  const devopsProjects = t.devopsProjectsList as Project[];
  const total = projects.length + backendProjects.length + devopsProjects.length;
  // Never show an empty preview — default to the first record until hover
  const previewProject = hoveredProject ?? projects[0] ?? null;

  return (
    <section id="Projects" ref={ref} className="grid-pattern" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ bottom: "5%", left: "2%", fontSize: "clamp(6rem, 14vw, 13rem)" }}>作品</span>
      <span className="ghost-num" aria-hidden="true">03</span>

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
            letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
          }}>03 — {t.portfolioTitle}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 0.95,
            textTransform: "uppercase", marginBottom: "0.5rem",
          }}
        >
          Mission <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Archive</span>
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
            marginBottom: "1rem",
            textShadow: "0 0 15px rgba(0,240,255,0.12)",
          }}
        >
          {">"} {total} classified records found
        </motion.p>

        {/* Two-panel layout */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem",
          alignItems: "start",
        }} className="mobile-col">
          {/* Left: project list */}
          <div>
            <SectionDivider num="01" label={t.role} color="#00f0ff" count={projects.length} inView={inView} />
            <div style={{ borderTop: "1px solid rgba(0,240,255,0.05)" }}>
              {projects.map((p, i) => (
                <ProjectRow key={p.title} p={p} i={i} inView={inView}
                  active={hoveredProject?.title === p.title}
                  onHover={() => setHoveredProject(p)}
                />
              ))}
            </div>

            <SectionDivider num="02" label={t.backendProjects} color="#ff007f" count={backendProjects.length} inView={inView} />
            <div style={{ borderTop: "1px solid rgba(0,240,255,0.05)" }}>
              {backendProjects.map((p, i) => (
                <ProjectRow key={p.title} p={p} i={i} inView={inView}
                  active={hoveredProject?.title === p.title}
                  onHover={() => setHoveredProject(p)}
                />
              ))}
            </div>

            <SectionDivider num="03" label={t.devopsProjects} color="#ffb800" count={devopsProjects.length} inView={inView} />
            <div style={{ borderTop: "1px solid rgba(0,240,255,0.05)" }}>
              {devopsProjects.map((p, i) => (
                <ProjectRow key={p.title} p={p} i={i} inView={inView}
                  active={hoveredProject?.title === p.title}
                  onHover={() => setHoveredProject(p)}
                />
              ))}
            </div>
          </div>

          {/* Right: preview panel */}
          <PreviewPanel project={previewProject} />
        </div>
      </div>
    </section>
  );
}
