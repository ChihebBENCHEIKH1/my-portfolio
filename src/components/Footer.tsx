import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import "./Footer.css";

// Flatline with a heartbeat spike every ~240 units (viewBox 0 0 1200 28, baseline y=14).
const EKG_SPIKE = "l5 -4 l5 4 l4 -11 l6 20 l4 -9";
const EKG_PATH = `M0 14 H80 ${EKG_SPIKE} H320 ${EKG_SPIKE} H560 ${EKG_SPIKE} H800 ${EKG_SPIKE} H1040 ${EKG_SPIKE} H1200`;
const EKG_PINK = `M776 14 H800 ${EKG_SPIKE} H848`;

export const Footer = () => {
  const reduced = useReducedMotion();
  const { lang } = useLanguage();
  const profilePath = lang === "de" ? "/de/" : "/";

  return (
    <footer style={{
      padding: "3rem 2rem",
      display: "flex", flexWrap: "wrap",
      alignItems: "center", justifyContent: "space-between",
      gap: "1.5rem", position: "relative",
      background: "rgba(5,6,12,0.92)",
      boxShadow: "inset 0 0 60px rgba(0,240,255,0.03)",
    }}>
      {/* EKG heartbeat line — pure CSS animation, auto-killed by reduced motion */}
      <svg
        className="footer-ekg" aria-hidden="true"
        viewBox="0 0 1200 28" preserveAspectRatio="none"
      >
        <path className="ekg-base" d={EKG_PATH} />
        <path className="ekg-dash" d={EKG_PATH} />
        <path className="ekg-pink" d={EKG_PINK} />
      </svg>

      {/* Logo + status */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <a href="#Home" style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "1.1rem", fontWeight: 700,
          color: "#00f0ff", textDecoration: "none",
          letterSpacing: "0.05em",
          textShadow: "0 0 10px rgba(0,240,255,0.3)",
        }}>
          CB<span style={{ color: "#ff007f" }}>_</span>
        </a>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: '"JetBrains Mono", monospace', fontSize: "10px",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(224,224,232,0.6)",
        }}>
          <motion.div
            animate={reduced ? { opacity: 0.8 } : { opacity: [0.4, 1, 0.4] }}
            transition={reduced ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
            style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#00ff88", boxShadow: "0 0 10px #00ff88",
            }}
          />
          SYS.ONLINE — <span style={{
            color: "rgba(0,240,255,0.8)",
            textShadow: "0 0 8px rgba(0,240,255,0.3)",
          }}>OPEN_TO_WORK</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem 2rem" }}>
        {[
          { label: "GitHub", href: "https://github.com/ChihebBENCHEIKH1" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/chiheb-ben-cheikh/" },
          { label: "npm", href: "https://www.npmjs.com/~chiheb_ben_cheikh" },
        ].map(link => (
          <motion.a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            className="footer-link"
            whileHover={{ y: -2 }}
          >
            {link.label}
            <span className="sr-only">(opens in new tab)</span>
          </motion.a>
        ))}
        <a className="footer-link" href={`${profilePath}about.md`}
          aria-label={lang === "de" ? "Öffentliches Profil als Markdown" : "Public profile as Markdown"}>
          Markdown
        </a>
        <a className="footer-link" href={`${profilePath}profile.json`}
          aria-label={lang === "de" ? "Öffentliches Profil als JSON" : "Public profile as JSON"}>
          JSON
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <p style={{
          fontFamily: '"JetBrains Mono"', fontSize: "11px",
          color: "rgba(224,224,232,0.55)", letterSpacing: "0.15em",
        }}>
          © {new Date().getFullYear()} Chiheb Ben Cheikh
        </p>
        <a href="#Home" aria-label="Back to top" className="footer-top">
          ↑
        </a>
      </div>
    </footer>
  );
};
