import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export function Contact({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [focused, setFocused] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const setField = (key: string, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${t.contactEmail}?subject=${subject}&body=${body}`;
  };

  const field = (name: string): CSSProperties => ({
    width: "100%",
    background: focused === name ? "rgba(0,240,255,0.05)" : "rgba(8,10,18,0.8)",
    border: `1px solid ${focused === name ? "rgba(0,240,255,0.35)" : "rgba(255,255,255,0.04)"}`,
    borderLeft: focused === name ? "3px solid rgba(0,240,255,0.6)" : "1px solid rgba(255,255,255,0.04)",
    color: "#e0e0e8",
    fontSize: "12px",
    padding: "14px 16px 14px 32px",
    outline: "none",
    letterSpacing: "0.04em",
    fontFamily: '"JetBrains Mono", monospace',
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: focused === name
      ? "0 0 25px rgba(0,240,255,0.06), inset 0 0 25px rgba(0,240,255,0.02)"
      : "none",
  });

  return (
    <section id="Contact" ref={ref} className="grid-pattern cv-auto" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ bottom: "5%", right: "3%", fontSize: "clamp(6rem, 14vw, 13rem)" }}>接続</span>
      <span className="ghost-num" aria-hidden="true">05</span>
      <span className="kanji-bg" style={{ top: "12%", left: "5%", fontSize: "clamp(3rem, 6vw, 6rem)", color: "rgba(255,184,0,0.015)" }}>通信</span>

      <div style={{
        position: "absolute", top: "20%", right: "10%", width: "30vw", height: "40vh",
        background: "radial-gradient(ellipse, rgba(255,0,127,0.05) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, width: "50vw", height: "50vh",
        background: "radial-gradient(ellipse at left bottom, rgba(0,240,255,0.05) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "1fr 1.4fr",
        gap: "4rem", alignItems: "start",
      }} className="contact-grid">

        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
          >
            <div style={{ width: "30px", height: "1px", background: "#00f0ff" }} />
            <span style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              letterSpacing: "0.3em", color: "#00f0ff", textTransform: "uppercase",
            }}>
              05 — {t.contactTitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily: '"Space Grotesk"', fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700, color: "#fff", lineHeight: 0.95,
              textTransform: "uppercase", marginBottom: "1.5rem",
            }}
          >
            Open A<br />
            <span className="glow-pink accent-shine" style={{ color: "#ff007f" }}>Channel</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            style={{
              fontSize: "clamp(13px, 1.3vw, 16px)", color: "rgba(224,224,232,0.8)",
              lineHeight: "1.85", marginBottom: "2.5rem",
              textShadow: "0 0 15px rgba(0,240,255,0.1)",
              borderLeft: "2px solid rgba(0,240,255,0.35)",
              paddingLeft: "0.75rem",
            }}
          >
            Open to full-time roles, freelance projects, and interesting collaborations.
          </motion.p>

          {/* Contact links — angled terminal panel */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex", flexDirection: "column", gap: "1rem",
              padding: "1.5rem",
              background: "rgba(8,10,18,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,240,255,0.08)",
              borderLeft: "3px solid rgba(0,240,255,0.3)",
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
            }}
          >
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              color: "rgba(0,240,255,0.6)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: "0.25rem",
              textShadow: "0 0 8px rgba(0,240,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>// SECURE CHANNELS</span>
              <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px" }}>
                {[3, 5, 7, 10].map((h, bi) => (
                  <motion.div
                    key={bi}
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: bi * 0.2 }}
                    style={{
                      width: "2px", height: `${h}px`,
                      background: "#00f0ff", borderRadius: "1px",
                      transformOrigin: "bottom", opacity: 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
            <a href={`mailto:${t.contactEmail}`} style={{
              fontFamily: '"JetBrains Mono"', fontSize: "13px", color: "#00f0ff",
              textDecoration: "none", letterSpacing: "0.08em",
              textShadow: "0 0 8px rgba(0,240,255,0.25)",
              display: "flex", alignItems: "center", gap: "0.6rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(0,240,255,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.textShadow = "none"; }}
            >
              <span style={{ color: "rgba(0,240,255,0.7)", textShadow: "0 0 6px rgba(0,240,255,0.3)" }}>{">"}_</span>
              {t.contactEmail}
            </a>
            <a href="https://github.com/ChihebBENCHEIKH1" target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: '"JetBrains Mono"', fontSize: "13px",
                color: "rgba(224,224,232,0.65)", textDecoration: "none",
                letterSpacing: "0.08em",
                display: "flex", alignItems: "center", gap: "0.6rem",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ff007f"; (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255,0,127,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(224,224,232,0.65)"; (e.currentTarget as HTMLElement).style.textShadow = "none"; }}
            >
              <span style={{ color: "rgba(255,0,127,0.7)", textShadow: "0 0 6px rgba(255,0,127,0.3)" }}>{">"}_</span>
              github.com/ChihebBENCHEIKH1
            </a>
            <a href="https://www.linkedin.com/in/chiheb-ben-cheikh/" target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: '"JetBrains Mono"', fontSize: "13px",
                color: "rgba(224,224,232,0.65)", textDecoration: "none",
                letterSpacing: "0.08em",
                display: "flex", alignItems: "center", gap: "0.6rem",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ffb800"; (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255,184,0,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(224,224,232,0.65)"; (e.currentTarget as HTMLElement).style.textShadow = "none"; }}
            >
              <span style={{ color: "rgba(255,184,0,0.7)", textShadow: "0 0 6px rgba(255,184,0,0.3)" }}>{">"}_</span>
              linkedin/chiheb-ben-cheikh
            </a>
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              color: "rgba(0,240,255,0.45)", letterSpacing: "0.15em",
              marginTop: "0.5rem", paddingTop: "0.5rem",
              borderTop: "1px solid rgba(0,240,255,0.08)",
            }}>
              STATUS: ACTIVE | SIGNAL: STRONG
            </div>
          </motion.div>
        </div>

        {/* Right — terminal form */}
        <motion.form
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: "flex", flexDirection: "column",
            clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
            border: "1px solid rgba(0,240,255,0.1)",
            background: "rgba(5,5,10,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,240,255,0.03)",
            position: "relative", overflow: "hidden",
          }}
          onSubmit={handleSubmit}
        >
          {/* CRT scanline */}
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            pointerEvents: "none", zIndex: 2,
          }} />

          {/* Terminal header */}
          <div style={{
            padding: "0.75rem 1.5rem",
            borderBottom: "1px solid rgba(0,240,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(0,240,255,0.02)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {["#ff007f", "#ffb800", "#00f0ff"].map(c => (
                  <div key={c} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: c, opacity: 0.6,
                  }} />
                ))}
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.15em", color: "rgba(0,240,255,0.6)",
                textShadow: "0 0 8px rgba(0,240,255,0.2)",
              }}>
                [SECURE_TERMINAL v2.4.1]
              </span>
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              letterSpacing: "0.1em", color: "rgba(0,240,255,0.5)",
              display: "flex", gap: "12px", alignItems: "center",
            }}>
              <span>FILE</span>
              <span>EDIT</span>
              <span style={{ color: "rgba(255,0,127,0.6)" }}>TRANSMIT</span>
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "4px", height: "4px", borderRadius: "50%",
                  background: "#00ff88",
                }}
              />
            </div>
          </div>

          {/* Form body with tight grid */}
          <div className="grid-tight" style={{
            padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["name", "IDENT", "Your name"], ["email", "FREQ", "your@email.com"]].map(([key, lbl, ph]) => (
                <div key={key}>
                  <label style={{
                    fontFamily: '"JetBrains Mono"', fontSize: "10px",
                    letterSpacing: "0.25em", color: "rgba(0,240,255,0.65)",
                    textShadow: "0 0 6px rgba(0,240,255,0.15)",
                    display: "flex", alignItems: "center", gap: "4px",
                    marginBottom: "8px",
                  }}>
                    <span style={{ color: "rgba(0,240,255,0.5)" }}>{">"}</span> {lbl}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                      fontFamily: '"JetBrains Mono"', fontSize: "10px",
                      color: focused === key ? "rgba(0,240,255,0.7)" : "rgba(0,240,255,0.35)",
                      transition: "color 0.3s", zIndex: 1,
                    }}>{">"}_</span>
                    <input type={key === "email" ? "email" : "text"} placeholder={ph}
                      style={field(key)}
                      value={form[key as "name" | "email"]}
                      onChange={e => setField(key, e.target.value)}
                      required
                      aria-label={lbl}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label style={{
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.25em", color: "rgba(0,240,255,0.65)",
                textShadow: "0 0 6px rgba(0,240,255,0.15)",
                display: "flex", alignItems: "center", gap: "4px",
                marginBottom: "8px",
              }}>
                <span style={{ color: "rgba(0,240,255,0.5)" }}>{">"}</span> SUBJECT
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  fontFamily: '"JetBrains Mono"', fontSize: "10px",
                  color: focused === "subject" ? "rgba(0,240,255,0.7)" : "rgba(0,240,255,0.35)",
                  transition: "color 0.3s", zIndex: 1,
                }}>{">"}_</span>
                <input type="text" placeholder="What's this about?" style={field("subject")}
                  value={form.subject} onChange={e => setField("subject", e.target.value)}
                  aria-label="Subject"
                  onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)} />
              </div>
            </div>

            <div>
              <label style={{
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.25em", color: "rgba(0,240,255,0.65)",
                textShadow: "0 0 6px rgba(0,240,255,0.15)",
                display: "flex", alignItems: "center", gap: "4px",
                marginBottom: "8px",
              }}>
                <span style={{ color: "rgba(0,240,255,0.5)" }}>{">"}</span> PAYLOAD
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "12px", top: "14px",
                  fontFamily: '"JetBrains Mono"', fontSize: "10px",
                  color: focused === "message" ? "rgba(0,240,255,0.7)" : "rgba(0,240,255,0.35)",
                  transition: "color 0.3s", zIndex: 1,
                }}>{">"}_</span>
                <textarea rows={5} placeholder="Tell me about your project..."
                  style={{ ...field("message"), resize: "none" }}
                  value={form.message} onChange={e => setField("message", e.target.value)}
                  required
                  aria-label="Message"
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* 3D Submit button */}
            <button
              type="submit"
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              style={{
                width: "100%", padding: "16px",
                background: hoveredBtn
                  ? "linear-gradient(90deg, rgba(255,0,127,0.25), rgba(0,240,255,0.12))"
                  : "rgba(255,0,127,0.1)",
                border: hoveredBtn
                  ? "1px solid rgba(255,0,127,0.5)"
                  : "1px solid rgba(255,0,127,0.2)",
                color: "#ff007f",
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.25em", textTransform: "uppercase",
                cursor: "pointer",
                position: "relative", overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                boxShadow: hoveredBtn
                  ? "0 4px 0 rgba(200,0,100,0.4), 0 8px 25px rgba(255,0,127,0.2), 0 0 40px rgba(255,0,127,0.1)"
                  : "0 3px 0 rgba(200,0,100,0.2), 0 6px 15px rgba(255,0,127,0.08)",
                transform: hoveredBtn
                  ? "perspective(500px) rotateX(0deg) translateY(-2px)"
                  : "perspective(500px) rotateX(3deg)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                textShadow: hoveredBtn ? "0 0 12px rgba(255,0,127,0.5)" : "none",
              }}
            >
              {hoveredBtn && (
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 0.6, ease: "linear" }}
                  style={{
                    position: "absolute", top: 0, bottom: 0, width: "50%",
                    background: "linear-gradient(90deg, transparent, rgba(255,0,127,0.15), transparent)",
                    pointerEvents: "none",
                  }}
                />
              )}
              <span>Transmit</span>
              <span style={{ fontSize: "14px" }}>→</span>
            </button>
          </div>
        </motion.form>
      </div>

      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  );
}
