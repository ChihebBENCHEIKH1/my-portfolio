import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import "./Contact.css";

const GLYPHS = "アカサタナハマヤ0123456789ABCDEF#%&*<>/=+";

export function Contact({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [phase, setPhase] = useState<"idle" | "charging" | "sent">("idle");
  const [btnLabel, setBtnLabel] = useState("TRANSMIT");
  const timers = useRef<number[]>([]);
  const scrambleInt = useRef(0);

  useEffect(() => () => {
    timers.current.forEach(id => window.clearTimeout(id));
    window.clearInterval(scrambleInt.current);
  }, []);

  const setField = (key: string, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const validity: Record<string, boolean> = {
    name: form.name.trim().length >= 2,
    email: /^\S+@\S+\.\S+$/.test(form.email),
    subject: form.subject.trim().length >= 2,
    message: form.message.trim().length >= 2,
  };

  // Reveal `text` left→right through cyber-glyphs on the button label.
  const scrambleTo = (text: string, dur: number) => {
    window.clearInterval(scrambleInt.current);
    const start = performance.now();
    scrambleInt.current = window.setInterval(() => {
      const p = Math.min((performance.now() - start) / dur, 1);
      const frontier = Math.floor(p * text.length);
      let s = text.slice(0, frontier);
      for (let i = frontier; i < text.length; i++)
        s += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      setBtnLabel(s);
      if (p >= 1) window.clearInterval(scrambleInt.current);
    }, 40);
  };

  const fireMailto = () => {
    const subject = encodeURIComponent(form.subject || `Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${t.contactEmail}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    if (reduced) {
      fireMailto();
      setPhase("sent");
      timers.current.push(window.setTimeout(() => {
        setPhase("idle");
        setBtnLabel("TRANSMIT");
      }, 2000));
      return;
    }
    setPhase("charging");
    scrambleTo("ENCRYPTING PAYLOAD…", 350);
    timers.current.push(window.setTimeout(() => scrambleTo("TRANSMITTING…", 300), 450));
    timers.current.push(window.setTimeout(() => {
      fireMailto();
      setPhase("sent");
    }, 950));
    timers.current.push(window.setTimeout(() => {
      setPhase("idle");
      setBtnLabel("TRANSMIT");
    }, 2950));
  };

  return (
    <section id="Contact" ref={ref} className="grid-pattern cv-auto" style={{
      padding: "140px 2rem", position: "relative", overflow: "hidden",
    }}>
      <span className="kanji-bg" style={{ bottom: "5%", right: "3%", fontSize: "clamp(6rem, 14vw, 13rem)" }}>接続</span>
      <span className="ghost-num" aria-hidden="true">07</span>
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
              letterSpacing: "0.28em", color: "#00f0ff", textTransform: "uppercase",
            }}>
              07 — {t.contactTitle}
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
              textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 15px rgba(0,240,255,0.1)",
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
              background: "rgba(8,10,18,0.92)",
              border: "1px solid rgba(0,240,255,0.08)",
              borderLeft: "3px solid rgba(0,240,255,0.3)",
              boxShadow: "inset 0 0 40px rgba(0,240,255,0.03)",
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
            }}
          >
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              color: "rgba(0,240,255,0.7)", letterSpacing: "0.28em",
              textTransform: "uppercase", marginBottom: "0.25rem",
              textShadow: "0 0 8px rgba(0,240,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>// SECURE CHANNELS</span>
              <div aria-hidden="true" style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px" }}>
                {[3, 5, 7, 10].map((h, bi) => (
                  <motion.div
                    key={bi}
                    animate={reduced ? { scaleY: 0.6 } : { scaleY: [0.3, 1, 0.3] }}
                    transition={reduced ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity, delay: bi * 0.2 }}
                    style={{
                      width: "2px", height: `${h}px`,
                      background: "#00f0ff", borderRadius: "1px",
                      transformOrigin: "bottom", opacity: 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
            <a href={`mailto:${t.contactEmail}`}
              className="channel-link channel-link-primary"
              style={{ "--accent": "#00f0ff" } as CSSProperties}
            >
              <span className="channel-glyph" aria-hidden="true">{">"}_</span>
              {t.contactEmail}
            </a>
            <a href="https://github.com/ChihebBENCHEIKH1" target="_blank" rel="noopener noreferrer"
              className="channel-link"
              style={{ "--accent": "#ff007f" } as CSSProperties}
            >
              <span className="channel-glyph" aria-hidden="true">{">"}_</span>
              github.com/ChihebBENCHEIKH1
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <a href="https://www.linkedin.com/in/chiheb-ben-cheikh/" target="_blank" rel="noopener noreferrer"
              className="channel-link"
              style={{ "--accent": "#ffb800" } as CSSProperties}
            >
              <span className="channel-glyph" aria-hidden="true">{">"}_</span>
              linkedin/chiheb-ben-cheikh
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: "10px",
              color: "rgba(0,240,255,0.65)", letterSpacing: "0.14em",
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
            background: "linear-gradient(165deg, #0a0c16 0%, #070810 55%, #0b0d18 100%)",
            boxShadow: "0 8px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,240,255,0.03), inset 0 0 60px rgba(0,240,255,0.04)",
            position: "relative", overflow: "hidden",
          }}
          onSubmit={handleSubmit}
        >
          {/* CRT scanline */}
          <div aria-hidden="true" style={{
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
              <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
                {["#ff007f", "#ffb800", "#00f0ff"].map(c => (
                  <div key={c} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: c, opacity: 0.6,
                  }} />
                ))}
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: "10px",
                letterSpacing: "0.14em", color: "rgba(0,240,255,0.7)",
                textShadow: "0 0 8px rgba(0,240,255,0.2)",
              }}>
                [SECURE_TERMINAL v2.4.1]
              </span>
            </div>
            <div aria-hidden="true" style={{
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              letterSpacing: "0.1em", color: "rgba(0,240,255,0.5)",
              display: "flex", gap: "12px", alignItems: "center",
            }}>
              <span>FILE</span>
              <span>EDIT</span>
              <span style={{ color: "rgba(255,0,127,0.6)" }}>TRANSMIT</span>
              <motion.div
                animate={reduced ? { opacity: 0.8 } : { opacity: [0.2, 1, 0.2] }}
                transition={reduced ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity }}
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
            <div className="contact-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["name", "IDENT", "Your name"], ["email", "FREQ", "your@email.com"]].map(([key, lbl, ph]) => (
                <div key={key} className="term-group">
                  <label className="term-label">
                    <span className="term-caret" aria-hidden="true">{">"}</span> {lbl}
                  </label>
                  <div className="term-wrap">
                    <span className="term-glyph" aria-hidden="true">{">"}_</span>
                    <input type={key === "email" ? "email" : "text"} placeholder={ph}
                      className="term-field"
                      value={form[key as "name" | "email"]}
                      onChange={e => setField(key, e.target.value)}
                      required
                      aria-label={lbl}
                    />
                    {validity[key] && (
                      <motion.span
                        className="term-valid" aria-hidden="true"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >✓</motion.span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="term-group">
              <label className="term-label">
                <span className="term-caret" aria-hidden="true">{">"}</span> SUBJECT
              </label>
              <div className="term-wrap">
                <span className="term-glyph" aria-hidden="true">{">"}_</span>
                <input type="text" placeholder="What's this about?" className="term-field"
                  value={form.subject} onChange={e => setField("subject", e.target.value)}
                  aria-label="Subject" />
                {validity.subject && (
                  <motion.span
                    className="term-valid" aria-hidden="true"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >✓</motion.span>
                )}
              </div>
            </div>

            <div className="term-group">
              <label className="term-label">
                <span className="term-caret" aria-hidden="true">{">"}</span> PAYLOAD
              </label>
              <div className="term-wrap">
                <span className="term-glyph term-glyph-top" aria-hidden="true">{">"}_</span>
                <textarea rows={5} placeholder="Tell me about your project..."
                  className="term-field" style={{ resize: "none" }}
                  value={form.message} onChange={e => setField("message", e.target.value)}
                  required
                  aria-label="Message"
                />
                {validity.message && (
                  <motion.span
                    className="term-valid term-valid-top" aria-hidden="true"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >✓</motion.span>
                )}
              </div>
            </div>

            {/* TRANSMIT — idle → charging → sent */}
            <button
              type="submit"
              className={`transmit-btn${phase === "sent" ? " is-sent" : ""}`}
              disabled={phase !== "idle"}
            >
              {phase === "charging" && (
                <motion.div
                  className="transmit-charge" aria-hidden="true"
                  initial={{ width: 0 }} animate={{ width: "100%" }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              )}
              {phase === "sent" ? (
                <span className="transmit-sent">✓ CHANNEL OPEN</span>
              ) : (
                <>
                  <span style={{ position: "relative", zIndex: 1 }}>{btnLabel}</span>
                  <span aria-hidden="true" style={{ fontSize: "14px", position: "relative", zIndex: 1 }}>→</span>
                </>
              )}
            </button>
            <span role="status" className="sr-only">
              {phase === "sent" ? "Message channel opened — your email client should now be open." : ""}
            </span>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
