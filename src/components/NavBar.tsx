import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useSceneStore } from "../store/sceneStore";

const SECTION_FOR_HREF: Record<string, string> = {
  "#Home": "hero",
  "#About": "about",
  "#WorkExperience": "experience",
  "#Projects": "projects",
  "#OpenSource": "opensource",
  "#Testimonials": "testimonials",
  "#Contact": "contact",
};

export default function NavBar({ titles }: { titles: any }) {
  const { lang, setLang } = useLanguage();
  const t = titles[lang];
  const activeSection = useSceneStore((s) => s.activeSection);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langOpen]);

  const items = [
    { label: t.navBar[0], href: "#Home" },
    { label: t.navBar[1], href: "#About" },
    { label: t.navBar[2], href: "#WorkExperience" },
    { label: t.navBar[3], href: "#Projects" },
    { label: t.navBar[4], href: "#OpenSource" },
    { label: t.navBar[5], href: "#Testimonials" },
    { label: t.navBar[6], href: "#Contact" },
  ];

  const langs = [
    { code: "eng" as const, label: "EN", full: "ENGLISH", flag: "🇺🇸" },
    { code: "de" as const, label: "DE", full: "DEUTSCH", flag: "🇩🇪" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: "64px", padding: "0 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(5,5,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(12px) saturate(1.3)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,240,255,0.12)" : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        }}
      >
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute", bottom: -1, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
              transformOrigin: "left",
            }}
          />
        )}

        {/* Logo */}
        <a href="#Home" style={{
          textDecoration: "none",
          display: "flex", alignItems: "center",
        }}>
          <img src="/logo-meteor.svg" alt="Chiheb" style={{ height: "36px", width: "36px" }} />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem" }}>
          {items.map((item, i) => {
            const active = SECTION_FOR_HREF[item.href] === activeSection;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "11px", letterSpacing: "0.2em",
                  color: active ? "#00f0ff" : "rgba(224,224,232,0.75)",
                  textDecoration: "none",
                  textShadow: active ? "0 0 10px rgba(0,240,255,0.5)" : "0 0 6px rgba(0,240,255,0.08)",
                  textTransform: "uppercase",
                  transition: "color 0.3s, text-shadow 0.3s",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#00f0ff";
                  (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px rgba(0,240,255,0.4)";
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(224,224,232,0.75)";
                    (e.currentTarget as HTMLElement).style.textShadow = "0 0 6px rgba(0,240,255,0.08)";
                  }
                }}
              >
                <span style={{ color: active ? "#ff007f" : "rgba(0,240,255,0.65)", marginRight: "4px", textShadow: "0 0 6px rgba(0,240,255,0.3)", transition: "color 0.3s" }}>0{i + 1}.</span>
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{
                      position: "absolute", left: 0, right: 0, bottom: "-8px",
                      height: "2px",
                      background: "linear-gradient(90deg, #00f0ff, #ff007f)",
                      boxShadow: "0 0 10px rgba(0,240,255,0.5)",
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Language switcher — sleek toggle */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o); }}
              aria-label={lang === "eng" ? "Change language, currently English" : "Sprache wechseln, derzeit Deutsch"}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                background: "rgba(0,240,255,0.05)",
                border: "1px solid rgba(0,240,255,0.15)",
                color: "#00f0ff", fontSize: "11px", letterSpacing: "0.12em",
                padding: "6px 14px", cursor: "pointer",
                transition: "all 0.3s",
                borderRadius: "4px",
                display: "flex", alignItems: "center", gap: "8px",
                boxShadow: langOpen
                  ? "0 0 15px rgba(0,240,255,0.12), inset 0 0 8px rgba(0,240,255,0.05)"
                  : "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,240,255,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,240,255,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0,240,255,0.1)";
              }}
              onMouseLeave={e => {
                if (!langOpen) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,240,255,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,240,255,0.15)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }
              }}
            >
              <span style={{ fontSize: "12px", lineHeight: 1 }}>
                {lang === "eng" ? "🇺🇸" : "🇩🇪"}
              </span>
              {lang === "eng" ? "EN" : "DE"}
              <motion.span
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: "8px", lineHeight: 1, opacity: 0.7 }}
              >▼</motion.span>
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    minWidth: "180px",
                    transformOrigin: "top right",
                    borderRadius: "8px",
                    background: "rgba(8,10,18,0.96)",
                    backdropFilter: "blur(12px) saturate(1.5)",
                    border: "1px solid rgba(0,240,255,0.25)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.5), 0 0 1px rgba(0,240,255,0.4), 0 0 40px rgba(0,240,255,0.08)",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  {/* Top accent */}
                  <div style={{
                    position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                    background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
                    opacity: 0.7,
                  }} />

                  {/* Options */}
                  <div style={{ padding: "6px" }}>
                    {langs.map((l) => {
                      const active = lang === l.code;
                      return (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setLangOpen(false); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            width: "100%", padding: "10px 14px",
                            background: active ? "rgba(0,240,255,0.1)" : "transparent",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(0,240,255,0.07)";
                          }}
                          onMouseLeave={e => {
                            if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          <span style={{ fontSize: "16px", lineHeight: 1 }}>{l.flag}</span>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px" }}>
                            <span style={{
                              fontFamily: '"JetBrains Mono"', fontSize: "11px",
                              fontWeight: 600, letterSpacing: "0.1em",
                              color: active ? "#00f0ff" : "rgba(224,224,232,0.85)",
                              textShadow: active ? "0 0 8px rgba(0,240,255,0.3)" : "none",
                              transition: "all 0.2s",
                            }}>{l.full}</span>
                            <span style={{
                              fontFamily: '"JetBrains Mono"', fontSize: "8px",
                              letterSpacing: "0.15em",
                              color: active ? "rgba(0,240,255,0.6)" : "rgba(224,224,232,0.45)",
                            }}>{l.label}</span>
                          </div>
                          {/* Active check */}
                          {active && (
                            <span style={{
                              marginLeft: "auto", color: "#00f0ff", fontSize: "12px",
                              textShadow: "0 0 6px rgba(0,240,255,0.4)",
                            }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "5px", padding: "4px",
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                animate={
                  menuOpen
                    ? (i === 0 ? { rotate: 45, y: 7 } : i === 1 ? { opacity: 0 } : { rotate: -45, y: -7 })
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                style={{ display: "block", width: "20px", height: "1.5px", background: "#00f0ff" }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
              overflow: "hidden",
            }}
          >
            <div style={{
              background: "rgba(5,5,10,0.96)",
              backdropFilter: "blur(12px) saturate(1.4)",
              borderBottom: "1px solid rgba(0,240,255,0.15)",
              position: "relative",
            }}>
              {/* Top neon line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, #00f0ff, #ff007f, #ffb800, #00f0ff)",
                opacity: 0.5,
              }} />

              {/* Nav items */}
              <div style={{ padding: "0.75rem 2rem 1.25rem" }}>
                {items.map((item, i) => (
                  <motion.a
                    key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "0.85rem 0",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "12px", letterSpacing: "0.15em",
                      color: "rgba(224,224,232,0.8)", textDecoration: "none",
                      textShadow: "0 0 6px rgba(0,240,255,0.08)",
                      textTransform: "uppercase",
                      borderBottom: i < items.length - 1 ? "1px solid rgba(0,240,255,0.05)" : "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "#00f0ff";
                      (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px rgba(0,240,255,0.4)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(224,224,232,0.8)";
                      (e.currentTarget as HTMLElement).style.textShadow = "0 0 6px rgba(0,240,255,0.08)";
                    }}
                  >
                    <span style={{
                      fontFamily: '"JetBrains Mono"', fontSize: "10px",
                      color: "rgba(0,240,255,0.65)", minWidth: "20px",
                      textShadow: "0 0 6px rgba(0,240,255,0.3)",
                    }}>
                      0{i + 1}
                    </span>
                    {item.label}
                    <span style={{
                      marginLeft: "auto", fontSize: "10px",
                      color: "rgba(0,240,255,0.45)",
                      textShadow: "0 0 4px rgba(0,240,255,0.2)",
                    }}>→</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
