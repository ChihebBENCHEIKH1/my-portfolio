import { motion } from "framer-motion";

export const Footer = () => (
  <footer style={{
    padding: "3rem 2rem",
    borderTop: "1px solid rgba(0,240,255,0.12)",
    display: "flex", flexWrap: "wrap",
    alignItems: "center", justifyContent: "space-between",
    gap: "1.5rem", position: "relative",
    background: "rgba(5,5,10,0.5)",
    backdropFilter: "blur(10px)",
  }}>
    {/* Top gradient line */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
      background: "linear-gradient(90deg, transparent, #00f0ff40, #ff007f30, transparent)",
    }} />

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
        fontFamily: '"JetBrains Mono", monospace', fontSize: "9px",
        letterSpacing: "0.2em", textTransform: "uppercase",
        color: "rgba(224,224,232,0.35)",
      }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#00ff88", boxShadow: "0 0 10px #00ff88",
          }}
        />
        SYS.ONLINE — <span style={{ color: "rgba(0,240,255,0.6)" }}>OPEN_TO_WORK</span>
      </div>
    </div>

    <div style={{ display: "flex", gap: "2rem" }}>
      {[
        { label: "GitHub", href: "https://github.com/ChihebBENCHEIKH1" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/chiheb-ben-cheikh/" },
        { label: "npm", href: "https://www.npmjs.com/~chiheb_ben_cheikh" },
      ].map(link => (
        <motion.a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          style={{
            fontFamily: '"JetBrains Mono"', fontSize: "11px",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(224,224,232,0.6)", textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00f0ff"; (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px rgba(0,240,255,0.4)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(224,224,232,0.6)"; (e.currentTarget as HTMLElement).style.textShadow = "none"; }}
        >
          {link.label}
        </motion.a>
      ))}
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <p style={{
        fontFamily: '"JetBrains Mono"', fontSize: "11px",
        color: "rgba(224,224,232,0.55)", letterSpacing: "0.15em",
      }}>
        © {new Date().getFullYear()} Chiheb Ben Cheikh
      </p>
      <a
        href="#Home"
        aria-label="Back to top"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "36px",
          color: "#00f0ff", textDecoration: "none", fontSize: "14px",
          background: "rgba(0,240,255,0.06)",
          border: "1px solid rgba(0,240,255,0.25)",
          clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px))",
          transition: "all 0.3s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(0,240,255,0.15)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,240,255,0.2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(0,240,255,0.06)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        ↑
      </a>
    </div>
  </footer>
);
