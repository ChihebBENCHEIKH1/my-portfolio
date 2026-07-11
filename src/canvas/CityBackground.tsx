// Premium cyberpunk megacity — 10/10 — layered depth, atmospheric, pure CSS
import { useSceneStore } from "../store/sceneStore";

// Lamp colors mapped to work experience items
const LAMP_COLORS = [
  "#00f0ff", // Job 0 — Sky Blue / Cyan
  "#c850ff", // Job 1 — Purple / Miyabi
  "#ffb800", // Job 2 — Amber / Gold
  "#ff007f", // Job 3 — Neon Pink
];
const LAMP_DEFAULT = "#00f0ff";

export function CityBackground() {
  const hoveredJobIndex = useSceneStore((s) => s.hoveredJobIndex);
  const activeSection = useSceneStore((s) => s.activeSection);
  const inHero = activeSection === "hero";
  const lampColor =
    hoveredJobIndex !== null
      ? (LAMP_COLORS[hoveredJobIndex] ?? LAMP_DEFAULT)
      : LAMP_DEFAULT;

  return (
    <div
      className="city-layer"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "65vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* ═══ SKY — deep violet → indigo → teal atmospheric gradient ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(26,12,52,0.0) 0%, rgba(34,14,66,0.22) 20%, rgba(24,12,54,0.34) 46%, rgba(14,16,52,0.28) 72%, rgba(0,220,255,0.05) 100%)",
        }}
      />

      {/* ═══ MOON — distant glowing orb high in the sky ═══ */}
      <div
        style={{
          position: "fixed",
          top: "4vh",
          left: "9vw",
          width: "clamp(110px, 12vw, 188px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 42% 38%, #f2f6ff 0%, #d3ddff 26%, #9fb0ee 52%, rgba(110,110,210,0.18) 78%, transparent 100%)",
          boxShadow:
            "0 0 120px 26px rgba(150,170,255,0.16), 0 0 46px rgba(205,222,255,0.22)",
          opacity: inHero ? 0.5 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 70% 64%, rgba(38,28,86,0.4), transparent 52%)",
          }}
        />
      </div>

      {/* ═══ AURORA — soft colour wash drifting over the skyline ═══ */}
      <div
        style={{
          position: "fixed",
          top: "24vh",
          left: "-12%",
          right: "-12%",
          height: "30vh",
          background:
            "linear-gradient(100deg, rgba(0,240,255,0.06) 0%, rgba(130,90,255,0.07) 34%, rgba(255,0,127,0.055) 64%, rgba(0,220,255,0.05) 100%)",
          filter: "blur(48px)",
          mixBlendMode: "screen",
          animation: "city-aurora 20s ease-in-out infinite",
        }}
      />

      {/* ═══ WIDE VOLUMETRIC LIGHT BEAMS ═══ */}
      {[
        { x: 10, w: 1.5, c: "#00f0ff", dur: 8, d: 0 },
        { x: 35, w: 1, c: "#ff007f", dur: 10, d: 3 },
        { x: 58, w: 1.8, c: "#00f0ff", dur: 9, d: 1.5 },
        { x: 80, w: 0.8, c: "#ffb800", dur: 11, d: 5 },
        { x: 48, w: 0.6, c: "#ff007f", dur: 12, d: 7 },
      ].map((b, i) => (
        <div
          key={`bm-${i}`}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            bottom: 0,
            width: `${b.w}%`,
            height: "95%",
            background: `linear-gradient(to top, ${b.c}0a, ${b.c}03, transparent 50%)`,
            filter: "blur(2px)",
            animation: `city-beam-pulse ${b.dur}s ease-in-out ${b.d}s infinite`,
          }}
        />
      ))}

      {/* ═══════════ FAR LAYER — blue-tinted distant silhouettes ═══════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100%",
          opacity: 0.45,
        }}
      >
        {[
          { x: 0, w: 2.8, h: 20 },
          { x: 3.5, w: 1.5, h: 30 },
          { x: 6, w: 3, h: 17 },
          { x: 10, w: 1.2, h: 38 },
          { x: 12, w: 2.5, h: 22 },
          { x: 16, w: 1.5, h: 32 },
          { x: 19, w: 3, h: 24 },
          { x: 23, w: 1, h: 42 },
          { x: 25, w: 2.5, h: 18 },
          { x: 29, w: 1.5, h: 35 },
          { x: 32, w: 3, h: 21 },
          { x: 36, w: 1, h: 40 },
          { x: 38, w: 2.5, h: 26 },
          { x: 42, w: 1.5, h: 44 },
          { x: 45, w: 3, h: 19 },
          { x: 49, w: 1, h: 37 },
          { x: 51, w: 2.5, h: 23 },
          { x: 55, w: 1.5, h: 33 },
          { x: 58, w: 3, h: 28 },
          { x: 62, w: 1, h: 41 },
          { x: 64, w: 2.5, h: 20 },
          { x: 68, w: 1.5, h: 36 },
          { x: 71, w: 3, h: 22 },
          { x: 75, w: 1, h: 39 },
          { x: 77, w: 2.5, h: 27 },
          { x: 81, w: 1.5, h: 31 },
          { x: 84, w: 3, h: 18 },
          { x: 88, w: 1, h: 42 },
          { x: 90, w: 2.5, h: 24 },
          { x: 94, w: 1.5, h: 34 },
          { x: 97, w: 2.5, h: 21 },
        ].map((b, i) => (
          <div
            key={`f-${i}`}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              bottom: 0,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background:
                "linear-gradient(to top, rgba(13,12,26,0.92), rgba(24,24,46,0.78))",
              borderTop: "1px solid rgba(90,130,210,0.08)",
            }}
          >
            {b.h > 30 && (
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  width: "1px",
                  height: "6px",
                  background: "rgba(0,240,255,0.05)",
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-1px",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#ff007f",
                    animation: `city-blink 1.5s ease-in-out ${i * 0.35}s infinite`,
                  }}
                />
              </div>
            )}
            <div
              style={{
                position: "absolute",
                inset: "3px 1px",
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(90,150,230,0.035) 5px, rgba(90,150,230,0.035) 6px)," +
                  "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(90,150,230,0.035) 4px, rgba(90,150,230,0.035) 5px)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Haze band between far and mid ── */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: 0,
          right: 0,
          height: "18%",
          background:
            "linear-gradient(to top, transparent, rgba(10,8,25,0.15), transparent)",
          filter: "blur(6px)",
        }}
      />

      {/* ═══════════ MID LAYER — colored structures ═══════════ */}
      {[
        { x: 0, w: 3.8, h: 28, c: 1 },
        { x: 4.5, w: 2.5, h: 42, c: 2 },
        { x: 8, w: 4, h: 30, c: 1 },
        { x: 13, w: 2, h: 50, c: 3 },
        { x: 16, w: 3.5, h: 24, c: 2 },
        { x: 21, w: 2.5, h: 55, c: 1 },
        { x: 25, w: 4, h: 32, c: 3 },
        { x: 30, w: 2, h: 46, c: 2 },
        { x: 33, w: 3.5, h: 28, c: 1 },
        { x: 38, w: 2.5, h: 52, c: 3 },
        { x: 42, w: 4, h: 35, c: 2 },
        { x: 47, w: 2, h: 48, c: 1 },
        { x: 50, w: 3.5, h: 30, c: 3 },
        { x: 55, w: 2.5, h: 54, c: 2 },
        { x: 59, w: 4, h: 26, c: 1 },
        { x: 64, w: 2, h: 50, c: 3 },
        { x: 67, w: 3.5, h: 34, c: 2 },
        { x: 72, w: 2.5, h: 56, c: 1 },
        { x: 76, w: 4, h: 28, c: 3 },
        { x: 81, w: 2, h: 44, c: 2 },
        { x: 84, w: 3.5, h: 38, c: 1 },
        { x: 89, w: 2.5, h: 52, c: 3 },
        { x: 93, w: 4, h: 30, c: 2 },
        { x: 98, w: 2.5, h: 40, c: 1 },
      ].map((b, i) => {
        const nc = {
          1: {
            bg: "rgba(8,12,20,0.88)",
            edge: "rgba(0,240,255,0.09)",
            glow: "#00f0ff",
          },
          2: {
            bg: "rgba(12,8,14,0.88)",
            edge: "rgba(255,0,127,0.07)",
            glow: "#ff007f",
          },
          3: {
            bg: "rgba(14,12,8,0.88)",
            edge: "rgba(255,184,0,0.06)",
            glow: "#ffb800",
          },
        }[b.c]!;
        return (
          <div
            key={`m-${i}`}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              bottom: 0,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: `linear-gradient(to top, ${nc.bg}, rgba(12,14,26,0.8))`,
              borderTop: `1px solid ${nc.edge}`,
              borderLeft: `1px solid ${nc.edge}`,
              borderRight: `1px solid ${nc.edge}`,
            }}
          >
            {/* Window cell texture */}
            <div
              style={{
                position: "absolute",
                inset: "4px 2px 0",
                backgroundImage: `
              repeating-linear-gradient(0deg, ${nc.glow}0E 0px, ${nc.glow}0E 2px, transparent 2px, transparent 8px),
              repeating-linear-gradient(90deg, ${nc.glow}0A 0px, ${nc.glow}0A 2px, transparent 2px, transparent 7px)
            `,
              }}
            />
            {/* Rooftop ledge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-3px",
                right: "-3px",
                height: "3px",
                background: nc.edge,
              }}
            />
            {/* Mid ledge */}
            {i % 2 === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "-2px",
                  right: "-2px",
                  height: "2px",
                  background: nc.edge,
                }}
              />
            )}
            {/* Antenna cluster */}
            {b.h > 42 && (
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  style={{ width: "1px", height: "14px", background: nc.edge }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "-4px",
                    width: "1px",
                    height: "8px",
                    background: nc.edge,
                    transform: "rotate(-14deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "4px",
                    width: "1px",
                    height: "8px",
                    background: nc.edge,
                    transform: "rotate(14deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "-1.5px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: nc.glow,
                    boxShadow: `0 0 6px ${nc.glow}`,
                    animation: `city-blink 2s ease-in-out ${i * 0.5}s infinite`,
                  }}
                />
              </div>
            )}
            {/* Floor bands */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 12px, ${nc.edge} 12px, ${nc.edge} 13px)`,
                opacity: 0.25,
              }}
            />
            {/* Window columns */}
            {b.h > 30 &&
              Array.from({ length: Math.min(3, Math.floor(b.h / 18)) }).map(
                (_, wi) => (
                  <div
                    key={wi}
                    style={{
                      position: "absolute",
                      left: `${15 + wi * 28}%`,
                      top: "5%",
                      bottom: "10%",
                      width: "14%",
                      background: nc.glow,
                      animation: `city-blink-slow ${3 + wi}s ease-in-out ${wi * 1.5 + i * 0.3}s infinite`,
                    }}
                  />
                ),
              )}
            {/* Scattered lit windows — extra detail */}
            {b.h > 35 && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: "60%",
                    top: "15%",
                    width: "8%",
                    height: "3%",
                    background: nc.glow,
                    opacity: 0.08,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "25%",
                    top: "65%",
                    width: "10%",
                    height: "2%",
                    background: nc.glow,
                    opacity: 0.06,
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* ── Horizontal sky-bridges between tall buildings ── */}
      {[
        { x1: 14, x2: 20, y: 42, c: "#00f0ff" },
        { x1: 39, x2: 46, y: 38, c: "#ff007f" },
        { x1: 64, x2: 71, y: 44, c: "#00f0ff" },
        { x1: 84, x2: 92, y: 36, c: "#ffb800" },
      ].map((br, i) => (
        <div
          key={`br-${i}`}
          style={{
            position: "absolute",
            left: `${br.x1}%`,
            bottom: `${br.y}%`,
            width: `${br.x2 - br.x1}%`,
            height: "1px",
            background: `linear-gradient(90deg, ${br.c}20, ${br.c}08, ${br.c}20)`,
            boxShadow: `0 0 4px ${br.c}10`,
          }}
        />
      ))}

      {/* ── Haze between mid and near ── */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          height: "15%",
          background:
            "linear-gradient(to top, transparent, rgba(5,5,15,0.12), transparent)",
          filter: "blur(4px)",
        }}
      />

      {/* ═══ NEON KANJI SIGNS — placed before Skytree so lamp glow paints on top ═══ */}
      {[
        { x: 22, y: 38, t: "ネオン", c: "#00f0ff", s: "7px", d: 0 },
        { x: 46, y: 46, t: "電脳", c: "#ff007f", s: "8px", d: 1 },
        { x: 70, y: 42, t: "未来", c: "#ffb800", s: "7px", d: 2 },
        { x: 34, y: 54, t: "渋谷", c: "#00f0ff", s: "6px", d: 1.5 },
        { x: 84, y: 48, t: "東京", c: "#ff007f", s: "7px", d: 2.5 },
        { x: 56, y: 35, t: "夜", c: "#ffb800", s: "9px", d: 3 },
        { x: 12, y: 44, t: "光", c: "#00f0ff", s: "8px", d: 0.5 },
      ].map((s, i) => (
        <div
          key={`sg-${i}`}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            bottom: `${s.y}%`,
            fontFamily: "serif",
            fontSize: s.s,
            color: s.c,
            textShadow: `0 0 6px ${s.c}, 0 0 14px ${s.c}50`,
            letterSpacing: "0.1em",
            userSelect: "none",
            animation: `city-billboard-glow 3s ease-in-out ${s.d}s infinite`,
          }}
        >
          {s.t}
        </div>
      ))}

      {/* ═══ TOKYO SKYTREE — placed BEFORE near layer so buildings paint on top ═══
           Full height tower from bottom=0 so body is hidden behind near-layer buildings.
           Only the antenna needle + lamp peek above the tallest rooftops (~68%).
           Top lamp reacts to Work Experience hover via zustand store. */}
      <div
        style={{
          position: "absolute",
          left: "75%",
          bottom: 0,
          width: "5%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* ── Tapered shaft — one clean silhouette, cylindrical shading ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "74%",
            clipPath: "polygon(42% 0%, 58% 0%, 72% 100%, 28% 100%)",
            background: `
              linear-gradient(90deg, rgba(110,200,255,0.04) 0%, rgba(175,235,255,0.24) 50%, rgba(110,200,255,0.04) 100%),
              linear-gradient(to top, rgba(0,180,230,0.18), rgba(0,220,255,0.1) 55%, rgba(150,235,255,0.16))
            `,
            filter:
              "drop-shadow(0 0 10px rgba(0,0,5,0.75)) drop-shadow(0 0 18px rgba(0,240,255,0.14))",
          }}
        >
          {/* Fine horizontal lattice */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(160,230,255,0.1) 6px, rgba(160,230,255,0.1) 7px)",
            }}
          />
          {/* Diagonal cross-bracing */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
              repeating-linear-gradient(55deg, transparent, transparent 7px, rgba(150,225,255,0.06) 7px, rgba(150,225,255,0.06) 8px),
              repeating-linear-gradient(-55deg, transparent, transparent 7px, rgba(150,225,255,0.06) 7px, rgba(150,225,255,0.06) 8px)
            `,
            }}
          />
          {/* Structural spine columns */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "46.5%", width: "1px", background: "rgba(200,245,255,0.22)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "53%", width: "1px", background: "rgba(200,245,255,0.22)" }} />
        </div>

        {/* ── Bloom behind Tembo Deck ── */}
        <div
          style={{
            position: "absolute",
            bottom: "55.5%",
            left: "-35%",
            right: "-35%",
            height: "9%",
            background: "radial-gradient(ellipse, rgba(0,240,255,0.18), transparent 65%)",
            filter: "blur(6px)",
          }}
        />
        {/* ── TEMBO DECK — luminous observation band ── */}
        <div
          style={{
            position: "absolute",
            bottom: "58%",
            left: "4%",
            right: "4%",
            height: "3.6%",
            borderRadius: "3px",
            background:
              "linear-gradient(to top, rgba(0,200,255,0.3), rgba(215,250,255,0.55) 55%, rgba(0,200,255,0.28))",
            boxShadow:
              "0 0 12px rgba(0,240,255,0.45), 0 0 32px rgba(0,240,255,0.2), 0 2px 10px rgba(0,0,5,0.55)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "30% 6%",
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0px, rgba(255,255,255,0.75) 1.2px, transparent 1.2px, transparent 3.4px)",
            }}
          />
        </div>

        {/* ── Bloom behind Tembo Gallery ── */}
        <div
          style={{
            position: "absolute",
            bottom: "68.5%",
            left: "-20%",
            right: "-20%",
            height: "7%",
            background: "radial-gradient(ellipse, rgba(0,240,255,0.14), transparent 65%)",
            filter: "blur(5px)",
          }}
        />
        {/* ── TEMBO GALLERY — upper luminous band ── */}
        <div
          style={{
            position: "absolute",
            bottom: "70.5%",
            left: "16%",
            right: "16%",
            height: "3%",
            borderRadius: "3px",
            background:
              "linear-gradient(to top, rgba(0,200,255,0.26), rgba(205,248,255,0.48) 55%, rgba(0,200,255,0.24))",
            boxShadow:
              "0 0 10px rgba(0,240,255,0.4), 0 0 26px rgba(0,240,255,0.16), 0 2px 8px rgba(0,0,5,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "30% 10%",
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 1px, transparent 1px, transparent 3px)",
            }}
          />
        </div>

        {/* ── BROADCAST ANTENNA — tall needle above rooftops ── */}
        <div
          style={{
            position: "absolute",
            bottom: "74%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "16%",
            background:
              "linear-gradient(to top, rgba(170,235,255,0.55), rgba(0,240,255,0.2), rgba(0,240,255,0.03))",
            boxShadow: "0 0 6px rgba(0,240,255,0.25)",
          }}
        >
          {/* Crossbars */}
          {[20, 42, 65, 85].map((p, i) => (
            <div
              key={`st-ax-${i}`}
              style={{
                position: "absolute",
                top: `${p}%`,
                left: "50%",
                transform: "translateX(-50%)",
                width: `${8 - i * 1.5}px`,
                height: "1px",
                background: "rgba(160,230,255,0.32)",
              }}
            />
          ))}

          {/* ★ TOP LAMP — reactive to Work Experience hover ★ */}
          <div
            style={{
              position: "absolute",
              top: "-7px",
              left: "-7px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: lampColor,
              boxShadow: `0 0 18px ${lampColor}, 0 0 45px ${lampColor}aa, 0 0 90px ${lampColor}55, 0 0 140px ${lampColor}25`,
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              animation:
                hoveredJobIndex !== null
                  ? "none"
                  : "city-blink 1.5s ease-in-out 0.4s infinite",
            }}
          />
          {/* Glow ring on hover */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "-12px",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: `1px solid ${lampColor}30`,
              boxShadow: `inset 0 0 8px ${lampColor}15`,
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: hoveredJobIndex !== null ? 1 : 0,
            }}
          />

          {/* Mid beacon */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "-2px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "rgba(0,240,255,0.6)",
              boxShadow:
                "0 0 8px rgba(0,240,255,0.4), 0 0 18px rgba(0,240,255,0.15)",
              animation: "city-blink 2s ease-in-out 1s infinite",
            }}
          />
        </div>

        {/* ── Neon ring accents — widths follow the taper ── */}
        {[
          { b: 35, lr: 33 },
          { b: 48, lr: 35 },
          { b: 64, lr: 37 },
        ].map((r, i) => (
          <div
            key={`st-ng-${i}`}
            style={{
              position: "absolute",
              bottom: `${r.b}%`,
              left: `${r.lr}%`,
              right: `${r.lr}%`,
              height: "1px",
              background: "#00f0ff",
              boxShadow: "0 0 5px #00f0ff, 0 0 12px #00f0ff40",
              opacity: 0.5,
              animation: `city-neon-flicker ${3.5 + i * 0.6}s ease-in-out ${i * 0.7}s infinite`,
            }}
          />
        ))}

        {/* ── "Miyabi" violet lighting mode — slow alternation like the real tower ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "74%",
            clipPath: "polygon(42% 0%, 58% 0%, 72% 100%, 28% 100%)",
            background:
              "linear-gradient(90deg, rgba(200,80,255,0.04) 0%, rgba(215,140,255,0.26) 50%, rgba(200,80,255,0.04) 100%)",
            animation: "city-skytree-miyabi 18s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* ── Red aviation beacons on deck edges ── */}
        {[
          { b: "61.8%", side: { left: "1.5%" }, d: 0 },
          { b: "61.8%", side: { right: "1.5%" }, d: 0.6 },
          { b: "73.7%", side: { left: "13%" }, d: 0.3 },
          { b: "73.7%", side: { right: "13%" }, d: 0.9 },
        ].map((av, i) => (
          <div
            key={`st-av-${i}`}
            style={{
              position: "absolute",
              bottom: av.b,
              ...av.side,
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: "#ff3355",
              boxShadow: "0 0 6px #ff3355, 0 0 12px #ff335580",
              animation: `city-blink 1.4s ease-in-out ${av.d}s infinite`,
            }}
          />
        ))}

        {/* ── Rising data pulse along the shaft ── */}
        <div
          style={{
            position: "absolute",
            bottom: "45%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: "45%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "28px",
              background:
                "linear-gradient(to top, transparent, rgba(0,240,255,0.9), transparent)",
              boxShadow: "0 0 10px rgba(0,240,255,0.6)",
              animation: "city-skytree-rise 5s ease-in-out 1.2s infinite",
            }}
          />
        </div>

        {/* ── Volumetric haze — color follows lamp ── */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "-50%",
            right: "-50%",
            bottom: "20%",
            background: `radial-gradient(ellipse, ${lampColor}08 0%, ${lampColor}02 35%, transparent 60%)`,
            pointerEvents: "none",
            filter: "blur(8px)",
            transition: "all 0.6s",
          }}
        />
      </div>

      {/* ═══ TOKYO TOWER — warm orange "Landmark Light", left skyline ═══
           Same trick as Skytree: full-height container placed before the
           near layer, so foreground buildings hide the street-level base. */}
      <div
        style={{
          position: "absolute",
          left: "7%",
          bottom: 0,
          width: "12%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Hand-drawn SVG — real Bézier curves for the Eiffel-style concave
            sweep, lattice pattern, lit edge ribs, glowing decks. */}
        <svg
          viewBox="0 0 200 400"
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "visible",
            filter: "drop-shadow(0 2px 10px rgba(0,0,5,0.7))",
          }}
        >
          <defs>
            <linearGradient id="tt-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb056" stopOpacity="0.5" />
              <stop offset="55%" stopColor="#ff7a1e" stopOpacity="0.44" />
              <stop offset="100%" stopColor="#ff5505" stopOpacity="0.52" />
            </linearGradient>
            <linearGradient id="tt-deck" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff7a1e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffe9c4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ff8c2e" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="tt-mast" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffae5e" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="tt-halo">
              <stop offset="0%" stopColor="#ff7a1e" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#ff7a1e" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ff7a1e" stopOpacity="0" />
            </radialGradient>
            <pattern id="tt-lat" width="9" height="9" patternUnits="userSpaceOnUse">
              <path d="M0 9 L9 0 M0 0 L9 9" stroke="#ffb066" strokeWidth="0.7" opacity="0.4" />
            </pattern>
            <pattern id="tt-strut" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 11.5 H12" stroke="#ffb066" strokeWidth="0.8" opacity="0.5" />
            </pattern>
            <pattern id="tt-win" width="3.6" height="6" patternUnits="userSpaceOnUse">
              <rect x="0.9" y="0" width="1.6" height="6" fill="#fff5dd" opacity="0.85" />
            </pattern>
            <filter id="tt-blur" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.5" />
            </filter>
            <clipPath id="tt-clip">
              <path d="M 96 108 L 104 108 C 106 160 109 215 113 250 L 87 250 C 91 215 94 160 96 108 Z" />
              <path
                clipRule="evenodd"
                d="M 85 254 L 115 254 C 119 300 133 350 152 388 L 48 388 C 67 350 81 300 85 254 Z M 100 318 C 112 348 120 368 126 388 L 74 388 C 80 368 88 348 100 318 Z"
              />
            </clipPath>
          </defs>

          {/* Atmosphere */}
          <ellipse cx="100" cy="255" rx="115" ry="155" fill="url(#tt-halo)" />
          <ellipse cx="100" cy="386" rx="78" ry="9" fill="#ff7a1e" opacity="0.16" filter="url(#tt-blur)" />

          {/* Body fills — upper shaft + flared legs with arch opening */}
          <path
            d="M 96 108 L 104 108 C 106 160 109 215 113 250 L 87 250 C 91 215 94 160 96 108 Z"
            fill="url(#tt-body)"
          />
          <path
            fillRule="evenodd"
            d="M 85 254 L 115 254 C 119 300 133 350 152 388 L 48 388 C 67 350 81 300 85 254 Z M 100 318 C 112 348 120 368 126 388 L 74 388 C 80 368 88 348 100 318 Z"
            fill="url(#tt-body)"
          />

          {/* Lattice + horizontal struts, clipped to the silhouette */}
          <g clipPath="url(#tt-clip)">
            <rect x="40" y="100" width="120" height="295" fill="url(#tt-lat)" />
            <rect x="40" y="100" width="120" height="295" fill="url(#tt-strut)" />
            {/* Floodlight tiers */}
            {[150, 180, 210, 272, 300, 330, 360].map((y, i) => (
              <line
                key={`tt-tier-${i}`}
                x1="40" x2="160" y1={y} y2={y}
                stroke="#ffe2b0" strokeWidth="1.4" opacity="0.55"
              />
            ))}
            {/* Center rib */}
            <line x1="100" x2="100" y1="110" y2="316" stroke="#ffd9a0" strokeWidth="1" opacity="0.3" />
          </g>

          {/* Lit edge ribs — these define the famous curve */}
          <path
            d="M 104 108 C 106 160 109 215 113 250 M 96 108 C 94 160 91 215 87 250"
            fill="none" stroke="#ffc585" strokeWidth="1.2" strokeOpacity="0.55"
          />
          <path
            d="M 115 254 C 119 300 133 350 152 388 M 85 254 C 81 300 67 350 48 388"
            fill="none" stroke="#ffc585" strokeWidth="1.3" strokeOpacity="0.6"
          />
          {/* Arch rib */}
          <path
            d="M 74 388 C 80 368 88 348 100 318 C 112 348 120 368 126 388"
            fill="none" stroke="#ffae5e" strokeWidth="1" strokeOpacity="0.5"
          />

          {/* Main observatory — glow + deck + windows */}
          <rect x="71" y="241" width="58" height="11" rx="2" fill="#ff8c2e" opacity="0.55" filter="url(#tt-blur)" />
          <rect x="71" y="241" width="58" height="11" rx="2" fill="url(#tt-deck)" />
          <rect x="74" y="244" width="52" height="5" fill="url(#tt-win)" />
          {/* Top observatory */}
          <rect x="88.5" y="128" width="23" height="7.5" rx="1.5" fill="#ff8c2e" opacity="0.5" filter="url(#tt-blur)" />
          <rect x="88.5" y="128" width="23" height="7.5" rx="1.5" fill="url(#tt-deck)" />
          <rect x="91" y="130" width="18" height="3.8" fill="url(#tt-win)" />

          {/* White aviation strobes at main deck edges */}
          {[71, 129].map((x, i) => (
            <circle
              key={`tt-strobe-${i}`}
              cx={x} cy="246.5" r="1.8" fill="#ffffff"
              style={{ animation: `city-strobe ${3.4 + i * 0.5}s linear ${i * 1.7}s infinite` }}
            />
          ))}

          {/* Antenna mast + crossbars + red beacon */}
          <rect x="98.8" y="20" width="2.4" height="88" fill="url(#tt-mast)" />
          <line x1="96" x2="104" y1="44" y2="44" stroke="#ffc585" strokeWidth="1" opacity="0.4" />
          <line x1="97" x2="103" y1="68" y2="68" stroke="#ffc585" strokeWidth="1" opacity="0.35" />
          <circle cx="100" cy="16" r="9" fill="#ff3355" opacity="0.3" filter="url(#tt-blur)" />
          <circle
            cx="100" cy="16" r="4" fill="#ff3355"
            style={{ animation: "city-blink 1.6s ease-in-out 0.3s infinite" }}
          />
        </svg>

        {/* Warm volumetric haze */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-50%",
            right: "-50%",
            bottom: "14%",
            background:
              "radial-gradient(ellipse, rgba(255,110,20,0.09) 0%, rgba(255,110,20,0.03) 40%, transparent 65%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* ═══════════ NEAR LAYER — foreground towers ═══════════ */}
      {[
        { x: -1, w: 5, h: 32, c: 1 },
        { x: 5, w: 3, h: 52, c: 2 },
        { x: 10, w: 4.5, h: 16, c: 3 },
        { x: 18, w: 3, h: 60, c: 1 },
        { x: 23, w: 5, h: 40, c: 2 },
        { x: 30, w: 4, h: 64, c: 3 },
        { x: 36, w: 6, h: 34, c: 1 },
        { x: 44, w: 3, h: 56, c: 2 },
        { x: 49, w: 5, h: 42, c: 3 },
        { x: 56, w: 4, h: 68, c: 1 },
        { x: 62, w: 6, h: 38, c: 2 },
        { x: 70, w: 3, h: 54, c: 3 },
        { x: 75, w: 5, h: 46, c: 1 },
        { x: 82, w: 4, h: 62, c: 2 },
        { x: 88, w: 6, h: 36, c: 3 },
        { x: 95, w: 5, h: 50, c: 1 },
      ].map((b, i) => {
        const nc = {
          1: {
            bg: "rgba(5,8,15,0.93)",
            edge: "rgba(0,240,255,0.1)",
            glow: "#00f0ff",
          },
          2: {
            bg: "rgba(10,5,12,0.93)",
            edge: "rgba(255,0,127,0.08)",
            glow: "#ff007f",
          },
          3: {
            bg: "rgba(10,9,5,0.93)",
            edge: "rgba(255,184,0,0.065)",
            glow: "#ffb800",
          },
        }[b.c]!;
        return (
          <div
            key={`n-${i}`}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              bottom: 0,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: `
                linear-gradient(90deg, rgba(0,0,8,0.5), transparent 18%, transparent 82%, rgba(0,0,8,0.5)),
                linear-gradient(to top, ${nc.bg}, rgba(5,5,10,0.96))
              `,
              borderTop: `1px solid ${nc.edge}`,
              borderLeft: `1px solid ${nc.edge}`,
              borderRight: `1px solid ${nc.edge}`,
            }}
          >
            {/* Rooftop with glow */}
            <div
              style={{
                position: "absolute",
                top: "-2px",
                left: "-4px",
                right: "-4px",
                height: "4px",
                background: nc.edge,
                boxShadow: `0 0 8px ${nc.glow}20`,
              }}
            />
            {/* Window cell texture */}
            <div
              style={{
                position: "absolute",
                inset: "8px 3px 0",
                backgroundImage: `
              repeating-linear-gradient(0deg, ${nc.glow}12 0px, ${nc.glow}12 2px, transparent 2px, transparent 9px),
              repeating-linear-gradient(90deg, ${nc.glow}0C 0px, ${nc.glow}0C 2.5px, transparent 2.5px, transparent 8px)
            `,
              }}
            />
            {/* Stepped crown — every 4th tower */}
            {i % 4 === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "20%",
                  right: "20%",
                  height: "10px",
                  background: nc.bg,
                  borderTop: `1px solid ${nc.edge}`,
                  borderLeft: `1px solid ${nc.edge}`,
                  borderRight: `1px solid ${nc.edge}`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-7px",
                    left: "30%",
                    right: "30%",
                    height: "7px",
                    background: nc.bg,
                    borderTop: `1px solid ${nc.edge}`,
                  }}
                />
              </div>
            )}
            {/* Rooftop spire — every 4th+1, where no helipad light */}
            {i % 4 === 1 && b.h <= 55 && (
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  width: "1.5px",
                  height: "14px",
                  background: `linear-gradient(to top, ${nc.edge}, transparent)`,
                }}
              />
            )}
            {/* Rooftop helipad light — on tallest buildings */}
            {b.h > 55 && (
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i % 2 === 0 ? "#ff007f" : "#00f0ff",
                  boxShadow: `0 0 8px ${i % 2 === 0 ? "#ff007f" : "#00f0ff"}`,
                  animation: `city-blink 1.2s ease-in-out ${i * 0.4}s infinite`,
                }}
              />
            )}
            {/* Neon accent strip */}
            {b.h > 45 && (
              <div
                style={{
                  position: "absolute",
                  top: `${20 + (i % 3) * 12}%`,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${nc.glow}50, transparent)`,
                  boxShadow: `0 0 6px ${nc.glow}25`,
                  animation: `city-neon-flicker 4s ease-in-out ${i * 0.7}s infinite`,
                }}
              />
            )}
            {/* Second neon strip on very tall ones */}
            {b.h > 58 && (
              <div
                style={{
                  position: "absolute",
                  top: `${55 + (i % 2) * 10}%`,
                  left: "5%",
                  right: "5%",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${nc.glow}35, transparent)`,
                  animation: `city-neon-flicker 5s ease-in-out ${i * 0.3 + 2}s infinite`,
                }}
              />
            )}
            {/* Window blocks */}
            <div style={{ position: "absolute", inset: "4px" }}>
              {Array.from({ length: Math.min(4, Math.floor(b.h / 14)) }).map(
                (_, wi) => (
                  <div
                    key={wi}
                    style={{
                      position: "absolute",
                      left: `${10 + (wi % 3) * 26}%`,
                      top: `${4 + wi * (78 / Math.max(1, Math.floor(b.h / 14)))}%`,
                      width: "18%",
                      height: "5%",
                      background: nc.glow,
                      animation: `city-blink-slow ${2.5 + wi * 0.8}s ease-in-out ${wi + i * 0.4}s infinite`,
                    }}
                  />
                ),
              )}
            </div>
            {/* Extra scattered windows */}
            {b.h > 40 && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: "55%",
                    top: "12%",
                    width: "12%",
                    height: "3%",
                    background: nc.glow,
                    opacity: 0.07,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "20%",
                    top: "72%",
                    width: "15%",
                    height: "2.5%",
                    background: nc.glow,
                    opacity: 0.05,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "68%",
                    top: "45%",
                    width: "8%",
                    height: "2%",
                    background: nc.glow,
                    opacity: 0.06,
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* (Skytree is placed before near-layer so buildings cover it) */}

      {/* ═══ ROOFTOP SEARCHLIGHT SWEEPS ═══ */}
      {[
        { x: 19.5, b: 60, c: "#00f0ff", dur: 14, d: 0 },
        { x: 84, b: 62, c: "#ff007f", dur: 18, d: 5 },
      ].map((s, i) => (
        <div
          key={`sl-${i}`}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            bottom: `${s.b}%`,
            width: "70px",
            height: "34vh",
            marginLeft: "-35px",
            transformOrigin: "50% 100%",
            clipPath: "polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)",
            background: `linear-gradient(to top, ${s.c}28, ${s.c}0a, transparent 85%)`,
            animation: `city-searchlight ${s.dur}s ease-in-out ${s.d}s infinite`,
          }}
        />
      ))}

      {/* ═══ VERTICAL NEON SIGNS (Tokyo street style) ═══ */}
      {[
        { x: 31.2, b: 36, t: "電脳都市", c: "#ff007f", dur: 4.5, d: 0.8 },
        { x: 57.2, b: 42, t: "新宿区", c: "#00f0ff", dur: 5.5, d: 2 },
        { x: 89.2, b: 20, t: "歓楽街", c: "#ffb800", dur: 5, d: 3.2 },
      ].map((vs, i) => (
        <div
          key={`vs-${i}`}
          style={{
            position: "absolute",
            left: `${vs.x}%`,
            bottom: `${vs.b}%`,
            writingMode: "vertical-rl",
            fontFamily: "serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.35em",
            color: vs.c,
            textShadow: `0 0 8px ${vs.c}, 0 0 18px ${vs.c}60`,
            padding: "7px 3px",
            border: `1px solid ${vs.c}45`,
            background: "rgba(5,5,10,0.65)",
            boxShadow: `0 0 12px ${vs.c}30, inset 0 0 6px ${vs.c}15`,
            userSelect: "none",
            animation: `city-neon-flicker ${vs.dur}s ease-in-out ${vs.d}s infinite`,
          }}
        >
          {vs.t}
        </div>
      ))}

      {/* ═══ MEGA AD SCREENS — Shibuya-style crossfading billboards ═══ */}
      {[
        { x: 36.5, b: 22, w: 5, h: 9, c1: "#00f0ff", c2: "#ff007f", t1: "サイバー", t2: "電脳空間", s1: "CYBR//CORP", s2: "NET.DIVE", d: 0 },
        { x: 62.5, b: 26, w: 4.5, h: 8, c1: "#ff007f", c2: "#ffb800", t1: "未来都市", t2: "夢の星", s1: "NEO-TOKYO", s2: "DREAMSTAR", d: 4 },
      ].map((ad, i) => (
        <div
          key={`ad-${i}`}
          style={{
            position: "absolute",
            left: `${ad.x}%`,
            bottom: `${ad.b}%`,
            width: `${ad.w}%`,
            height: `${ad.h}%`,
            border: `1px solid ${ad.c1}50`,
            background: "rgba(5,6,12,0.92)",
            boxShadow: `0 0 18px ${ad.c1}25, 0 0 45px ${ad.c1}10, inset 0 0 14px rgba(0,0,0,0.6)`,
            overflow: "hidden",
            animation: `city-neon-flicker ${6 + i}s ease-in-out ${ad.d}s infinite`,
          }}
        >
          {/* Ad A */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "3px",
              background: `linear-gradient(135deg, ${ad.c1}1c, transparent 65%)`,
              animation: `city-ad-cycle 12s ease-in-out ${ad.d}s infinite`,
            }}
          >
            <span style={{
              fontFamily: "serif", fontWeight: 700,
              fontSize: "clamp(10px, 1.1vw, 17px)",
              color: ad.c1,
              textShadow: `0 0 10px ${ad.c1}, 0 0 24px ${ad.c1}60`,
              letterSpacing: "0.18em", whiteSpace: "nowrap", userSelect: "none",
            }}>{ad.t1}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: "6px",
              letterSpacing: "0.32em", color: `${ad.c1}90`, userSelect: "none",
            }}>{ad.s1}</span>
          </div>
          {/* Ad B — opposite phase */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "3px",
              background: `linear-gradient(225deg, ${ad.c2}1c, transparent 65%)`,
              animation: `city-ad-cycle 12s ease-in-out ${ad.d + 6}s infinite`,
              opacity: 0,
            }}
          >
            <span style={{
              fontFamily: "serif", fontWeight: 700,
              fontSize: "clamp(10px, 1.1vw, 17px)",
              color: ad.c2,
              textShadow: `0 0 10px ${ad.c2}, 0 0 24px ${ad.c2}60`,
              letterSpacing: "0.18em", whiteSpace: "nowrap", userSelect: "none",
            }}>{ad.t2}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: "6px",
              letterSpacing: "0.32em", color: `${ad.c2}90`, userSelect: "none",
            }}>{ad.s2}</span>
          </div>
          {/* Scanlines */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)",
          }} />
          {/* Scan sweep */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: "2px",
            background: `linear-gradient(90deg, transparent, ${ad.c1}35, transparent)`,
            animation: `city-billboard-scan 3s linear ${ad.d + 1}s infinite`,
          }} />
        </div>
      ))}

      {/* ═══ HOLOGRAPHIC BILLBOARDS ═══ */}
      {[
        { x: 15, y: 58, w: 2.5, h: 3.5, c: "#00f0ff", t: "ARASAKA", d: 0 },
        { x: 40, y: 62, w: 3, h: 2.5, c: "#ff007f", t: "CYBER//SYS", d: 1.5 },
        { x: 62, y: 56, w: 2.5, h: 3, c: "#ffb800", t: "MILITECH", d: 0.8 },
        { x: 86, y: 60, w: 2, h: 2.5, c: "#00f0ff", t: "DATA.NET", d: 2 },
        { x: 28, y: 48, w: 2, h: 2, c: "#ff007f", t: "NETWATCH", d: 3.5 },
      ].map((bb, i) => (
        <div
          key={`bb-${i}`}
          style={{
            position: "absolute",
            left: `${bb.x}%`,
            bottom: `${bb.y}%`,
            width: `${bb.w}%`,
            height: `${bb.h}%`,
            background: `${bb.c}06`,
            border: `1px solid ${bb.c}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            animation: `city-billboard-glow 3.5s ease-in-out ${bb.d}s infinite`,
          }}
        >
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "clamp(4px, 0.5vw, 7px)",
              fontWeight: 700,
              color: bb.c,
              opacity: 0.6,
              textShadow: `0 0 4px ${bb.c}80`,
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {bb.t}
          </span>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${bb.c}25, transparent)`,
              animation: `city-billboard-scan 2.5s linear ${bb.d + 0.5}s infinite`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              height: "4px",
              borderTop: `1px solid ${bb.c}40`,
              borderLeft: `1px solid ${bb.c}40`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "4px",
              height: "4px",
              borderBottom: `1px solid ${bb.c}40`,
              borderRight: `1px solid ${bb.c}40`,
            }}
          />
        </div>
      ))}

      {/* ═══ RAIN ═══ */}
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={`r-${i}`}
          style={{
            position: "absolute",
            left: `${(i * 3.4 + ((i * 7) % 11)) % 100}%`,
            top: 0,
            width: "1px",
            height: `${14 + (i % 4) * 5}px`,
            background:
              "linear-gradient(to bottom, transparent, rgba(0,240,255,0.09))",
            animation: `city-rain ${0.5 + (i % 4) * 0.1}s linear ${(i * 0.09) % 2.5}s infinite`,
          }}
        />
      ))}

      {/* ═══ ELEVATED EXPRESSWAY — moving traffic streams ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "7%",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 88px, rgba(15,20,35,0.85) 88px, rgba(15,20,35,0.85) 92px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(10,12,22,0.95)",
          borderTop: "1px solid rgba(0,240,255,0.12)",
        }}
      >
        {/* Headlights — cyan, moving right */}
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 34px, rgba(0,240,255,0.55) 34px, rgba(0,240,255,0.55) 42px)",
            animation: "city-traffic 1.4s linear infinite",
            opacity: 0.7,
          }}
        />
        {/* Tail lights — red, moving left */}
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(255,60,90,0.5) 38px, rgba(255,60,90,0.5) 45px)",
            animation: "city-traffic 1.9s linear infinite reverse",
            opacity: 0.6,
          }}
        />
      </div>

      {/* ═══ DEPTH FOG — violet band separating mid and near ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          height: "20%",
          background:
            "linear-gradient(to top, transparent, rgba(60,25,110,0.11), transparent)",
          filter: "blur(5px)",
        }}
      />

      {/* ═══ ATMOSPHERIC FOG LAYERS ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100%",
          background:
            "linear-gradient(to top, rgba(0,240,255,0.02) 0%, rgba(5,5,10,0.25) 18%, transparent 45%)",
        }}
      />

      {/* ═══ CITY BASE GLOW ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: "-12%",
          left: "20%",
          right: "20%",
          height: "38%",
          background:
            "radial-gradient(ellipse, rgba(0,240,255,0.05) 0%, transparent 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "50%",
          right: "5%",
          height: "32%",
          background:
            "radial-gradient(ellipse, rgba(255,0,127,0.035) 0%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "0%",
          right: "65%",
          height: "28%",
          background:
            "radial-gradient(ellipse, rgba(255,184,0,0.02) 0%, transparent 60%)",
        }}
      />

      {/* ═══ GROUND GLOW LINE ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,240,255,0.14) 20%, rgba(255,0,127,0.1) 45%, rgba(255,184,0,0.06) 65%, rgba(0,240,255,0.14) 80%, transparent 95%)",
          boxShadow:
            "0 0 18px rgba(0,240,255,0.07), 0 0 35px rgba(0,240,255,0.03)",
        }}
      />

      {/* ═══ WET STREET REFLECTION ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10%",
          background:
            "linear-gradient(to bottom, rgba(0,240,255,0.012) 0%, rgba(5,5,10,0.95) 100%)",
          filter: "blur(3px)",
        }}
      />

      {/* ═══ FLYING VEHICLES ═══ */}
      {[
        { top: 12, dur: 7, delay: 0, c: "#00f0ff", h: 2, dir: "ltr" },
        { top: 28, dur: 9, delay: 3, c: "#ff007f", h: 1.5, dir: "rtl" },
        { top: 40, dur: 8, delay: 5, c: "#00f0ff", h: 1, dir: "ltr" },
        { top: 20, dur: 10, delay: 1.5, c: "#ffb800", h: 1, dir: "rtl" },
        { top: 48, dur: 12, delay: 7, c: "#ff007f", h: 1, dir: "ltr" },
      ].map((v, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: "absolute",
            top: `${v.top}%`,
            left: 0,
            width: "7%",
            height: `${v.h}px`,
            background: `linear-gradient(${v.dir === "rtl" ? "270deg" : "90deg"}, transparent, ${v.c}30, ${v.c}60, ${v.c}30, transparent)`,
            borderRadius: "1px",
            boxShadow: `0 0 6px ${v.c}25, 0 0 12px ${v.c}10`,
            animation: `city-vehicle-${v.dir} ${v.dur}s linear ${v.delay}s infinite`,
          }}
        >
          <div
            style={{
              position: "absolute",
              ...(v.dir === "rtl" ? { left: 0 } : { right: 0 }),
              top: "-1px",
              bottom: "-1px",
              width: "4px",
              background: v.c,
              borderRadius: "2px",
              boxShadow: `0 0 5px ${v.c}, 0 0 10px ${v.c}70`,
            }}
          />
        </div>
      ))}

      {/* ═══ TOWER-TOP GLOW ENHANCERS (screen-blend halos) ═══ */}
      <div style={{
        position: "absolute", left: "76%", bottom: "40%", transform: "translateX(-50%)",
        width: "clamp(160px, 20vw, 300px)", height: "46%",
        background: "radial-gradient(ellipse at 50% 40%, rgba(0,225,255,0.15), rgba(140,90,255,0.07) 45%, transparent 72%)",
        filter: "blur(10px)", mixBlendMode: "screen",
      }} />
      <div style={{
        position: "absolute", left: "12.5%", bottom: "12%", transform: "translateX(-50%)",
        width: "clamp(130px, 16vw, 240px)", height: "40%",
        background: "radial-gradient(ellipse at 50% 45%, rgba(255,160,50,0.14), rgba(255,90,20,0.06) 45%, transparent 72%)",
        filter: "blur(10px)", mixBlendMode: "screen",
      }} />

      {/* ═══ NEON REFLECTIONS on the wet street ═══ */}
      {[
        { x: 76, c: "0,225,255" }, { x: 12.5, c: "255,150,50" },
        { x: 42, c: "255,0,127" }, { x: 60, c: "0,240,255" }, { x: 88, c: "255,184,0" },
      ].map((r, i) => (
        <div key={`refl-${i}`} style={{
          position: "absolute", bottom: 0, left: `${r.x}%`, transform: "translateX(-50%)",
          width: "3%", height: "9%",
          background: `linear-gradient(to bottom, rgba(${r.c},0.22), transparent)`,
          filter: "blur(4px)", opacity: 0.55, mixBlendMode: "screen",
        }} />
      ))}
    </div>
  );
}
