import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="cursor-blink" />}
    </span>
  );
}

export function Header({ titles }: { titles: any }) {
  const { lang } = useLanguage();
  const t = titles[lang];

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 + i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="Home" className="grid-pattern" style={{
      minHeight: "100svh", position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 2rem 4rem", overflow: "hidden",
    }}>
      {/* Japanese kanji */}
      <span className="kanji-bg" style={{ top: "8%", right: "8%", fontSize: "clamp(7rem, 18vw, 16rem)" }}>未来</span>
      <span className="kanji-bg" style={{ bottom: "8%", left: "20%", fontSize: "clamp(5rem, 12vw, 12rem)" }}>電脳</span>
      <span className="kanji-bg" style={{ top: "55%", right: "30%", fontSize: "clamp(3rem, 8vw, 8rem)", color: "rgba(255,0,127,0.02)" }}>東京</span>
      <span className="kanji-bg" style={{ top: "15%", left: "8%", fontSize: "clamp(4rem, 10vw, 9rem)", color: "rgba(255,184,0,0.015)" }}>渋谷</span>

      {/* Drifting aurora glows */}
      <div className="aurora-blob aurora-a" aria-hidden="true" />
      <div className="aurora-blob aurora-b" aria-hidden="true" />
      <div className="aurora-blob aurora-c" aria-hidden="true" />

      {/* Night sky — twinkling stars + occasional comet */}
      {[
        { top: "9%", left: "16%", d: 0 }, { top: "14%", left: "38%", d: 1.4 },
        { top: "7%", left: "55%", d: 2.8 }, { top: "18%", left: "70%", d: 0.7 },
        { top: "11%", left: "84%", d: 2.1 }, { top: "23%", left: "12%", d: 3.4 },
        { top: "26%", left: "60%", d: 1 }, { top: "21%", left: "45%", d: 2.5 },
      ].map((s, i) => (
        <span key={`star-${i}`} className="hero-star" aria-hidden="true"
          style={{ top: s.top, left: s.left, animationDelay: `${s.d}s` }} />
      ))}
      <div className="comet" aria-hidden="true" />

      {/* Synthwave perspective floor */}
      <div className="floor-wrap" aria-hidden="true">
        <div className="floor-tilt">
          <div className="floor-grid" />
        </div>
        <div className="floor-glow" />
      </div>

      {/* HUD frame */}
      <div className="hero-hud hide-mobile" aria-hidden="true">
        <div className="hud-c hud-c-tl" />
        <div className="hud-c hud-c-tr" />
        <div className="hud-c hud-c-bl" />
        <div className="hud-c hud-c-br" />
        <span className="hud-label" style={{ top: "86px", left: "56px" }}>SYS.BOOT // OK</span>
        <span className="hud-label" style={{ top: "86px", right: "56px" }}>GRID.SECTOR_07</span>
        <span className="hud-label" style={{ bottom: "22px", left: "56px" }}>NEO-TOKYO.NET</span>
        <span className="hud-label" style={{ bottom: "22px", right: "56px" }}>BUILD v2077.06</span>
      </div>

      {/* Centered content */}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: "1100px", width: "100%",
        textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* System status bar — angled clip */}
        <motion.div {...stagger(0)} style={{
          display: "inline-flex", alignItems: "center", gap: "1.5rem",
          marginBottom: "2.5rem", flexWrap: "wrap", justifyContent: "center",
          padding: "10px 24px",
          border: "1px solid rgba(0,240,255,0.1)",
          background: "rgba(8,10,18,0.7)",
          backdropFilter: "blur(10px)",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(0,240,255,0.02)",
        }}>
          {[
            { label: "SYS", value: "ONLINE", color: "#00f0ff" },
            { label: "MODE", value: "FULL_STACK", color: "#ffb800" },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontFamily: '"JetBrains Mono"', fontSize: "9px",
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: s.color, boxShadow: `0 0 12px ${s.color}`,
                }}
              />
              <span style={{ color: "rgba(224,224,232,0.25)" }}>{s.label}:</span>
              <span style={{ color: s.color, textShadow: `0 0 8px ${s.color}40` }}>{s.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Eyebrow */}
        <motion.div {...stagger(1)} style={{
          fontFamily: '"JetBrains Mono"', fontSize: "10px",
          letterSpacing: "0.4em", color: "rgba(0,240,255,0.35)",
          textTransform: "uppercase", marginBottom: "1rem",
        }}>
          {"// "}Full Stack Developer
        </motion.div>

        {/* Name */}
        <motion.h1
          {...stagger(2)}
          className="glitch-text"
          data-text="CHIHEB BEN CHEIKH"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: "clamp(2.8rem, 9vw, 8.5rem)",
            fontWeight: 700, lineHeight: 0.9,
            color: "#fff", textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          <span className="text-shine">CHIHEB</span><br />
          <span style={{ display: "inline" }}>
            <span className="glow-cyan" style={{ color: "#00f0ff" }}>BEN </span>
            <span className="glow-pink" style={{ color: "#ff007f" }}>CHEIKH</span>
          </span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div {...stagger(3)} style={{
          width: "80px", height: "2px",
          background: "linear-gradient(90deg, transparent, #00f0ff, #ff007f, transparent)",
          margin: "1.5rem 0",
          boxShadow: "0 0 12px rgba(0,240,255,0.3)",
        }} />

        {/* Typewriter subtitle */}
        <motion.div {...stagger(3)} style={{
          fontSize: "clamp(14px, 1.6vw, 18px)", lineHeight: "1.8", color: "rgba(224,224,232,0.85)",
          maxWidth: "620px", marginBottom: "2.5rem",
          fontFamily: '"JetBrains Mono"',
          textShadow: "0 0 20px rgba(0,240,255,0.15)",
          borderLeft: "2px solid rgba(0,240,255,0.4)",
          paddingLeft: "1rem",
        }}>
          <span style={{ color: "#00f0ff", textShadow: "0 0 8px rgba(0,240,255,0.6)" }}>{">"} </span>
          <TypewriterText text={t.headerTitle} delay={1.5} />
        </motion.div>

        {/* CTAs */}
        <motion.div {...stagger(4)} style={{
          display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem",
          justifyContent: "center",
        }}>
          <a href="#Contact" className="btn-cyber btn-solid">{t.getInTouch}</a>
          <a href="#Projects" className="btn-pink">View Work →</a>
        </motion.div>

        {/* Tech stack */}
        <motion.div {...stagger(5)} style={{
          display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center",
        }}>
          {["React", "Next.js", "Node.js", "TypeScript", "Docker", "Vue.js", "Laravel"].map(tag => (
            <span key={tag} style={{
              fontFamily: '"JetBrains Mono"', fontSize: "11px",
              padding: "6px 16px", letterSpacing: "0.15em",
              border: "1px solid rgba(0,240,255,0.25)",
              color: "rgba(0,240,255,0.85)",
              background: "rgba(0,240,255,0.06)",
              textShadow: "0 0 8px rgba(0,240,255,0.3)",
              textTransform: "uppercase",
              clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)",
            }}>{tag}</span>
          ))}
        </motion.div>
      </div>

      {/* Side label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hide-mobile"
        style={{
          position: "absolute", right: "1.5rem", top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: '"JetBrains Mono"',
          fontSize: "9px", letterSpacing: "0.5em",
          color: "rgba(0,240,255,0.08)", textTransform: "uppercase",
        }}
      >
        Neo-Tokyo — 2026
      </motion.div>

      {/* Scroll indicator — clickable */}
      <motion.a
        href="#About"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          textDecoration: "none", padding: "8px 14px",
        }}
      >
        <span style={{
          fontFamily: '"JetBrains Mono"',
          fontSize: "8px", letterSpacing: "0.4em", color: "rgba(0,240,255,0.25)",
          textTransform: "uppercase",
        }}>Scroll</span>
        <motion.div
          style={{ width: "1px", height: "32px", background: "#00f0ff", transformOrigin: "top" }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
