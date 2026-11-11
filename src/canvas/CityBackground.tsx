// Neon Tokyo: atmospheric CSS layers, detailed SVG landmarks and an optional 3D foreground.
import { lazy, Suspense, useEffect, useState, Component, type ReactNode, type CSSProperties } from "react";
import { getCityBuildings, getCityProfile } from "./cityModel";
import { TokyoTower, Skytree } from "./TokyoLandmarks";
import { TowerFireworks } from "./TowerFireworks";
import { useSceneStore } from "../store/sceneStore";

const Airship = lazy(() => import("./Airship").then(m => ({ default: m.Airship })));
const SceneManager = lazy(() => import("./SceneManager").then(m => ({ default: m.SceneManager })));

class SceneFallback extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

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
  const interactive = useSceneStore(s => s.interactive);
  const daylight = useSceneStore(s => s.daylight);
  const buildingCount = useSceneStore(s => s.buildingCount);
  const lightLevel = useSceneStore(s => s.lightLevel);
  const setViewportWidth = useSceneStore(s => s.setViewportWidth);
  const [viewportWidth, setWidth] = useState(window.innerWidth);
  const profile = getCityProfile(viewportWidth);
  const boostTokyo = useSceneStore(s => s.activateTokyo);
  const boostSkytree = useSceneStore(s => s.activateSkytree);
  const inHero = activeSection === "hero" || interactive;
  const day = daylight;
  const [sceneReady, setSceneReady] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const resize = () => { setWidth(window.innerWidth); setViewportWidth(window.innerWidth); };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [setViewportWidth]);
  useEffect(() => {
    if (!inHero || interactive) return;
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || event.target.closest("a, button, input, textarea, [role='button']")) return;
      for (const [selector, activate] of [[".tokyo-hit", boostTokyo], [".skytree-hit", boostSkytree]] as const) {
        const rect = document.querySelector(selector)?.getBoundingClientRect();
        if (rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) { activate(); break; }
      }
    };
    window.addEventListener("click", click);
    return () => window.removeEventListener("click", click);
  }, [inHero, interactive, boostTokyo, boostSkytree]);
  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden);
    setUse3D(true);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (sceneReady) return;
    return useSceneStore.subscribe((state, previous) => {
      for (const [changed, selector] of [
        [state.tokyoPulse !== previous.tokyoPulse, ".tokyo-tower"],
        [state.skytreePulse !== previous.skytreePulse, ".tokyo-skytree"],
      ] as const) {
        if (changed) document.querySelector(selector)?.animate(
          [{ filter: "brightness(1)" }, { filter: "brightness(2.4)", offset: .15 }, { filter: "brightness(1)" }],
          { duration: 1700, easing: "ease-out" },
        );
      }
    });
  }, [sceneReady]);
  const lampColor =
    hoveredJobIndex !== null
      ? (LAMP_COLORS[hoveredJobIndex] ?? LAMP_DEFAULT)
      : LAMP_DEFAULT;

  return (
    <>
    <div className="city-day-sky" data-day={day} aria-hidden="true"><div className="city-sun" /></div>
    {!interactive && inHero && <div className="landmark-hit-zones">
      <button className="landmark-hit tokyo-hit" type="button" aria-label="Tokyo Tower: lights or fireworks" onClick={boostTokyo} />
      <button className="landmark-hit skytree-hit" type="button" aria-label="Skytree: lights or fireworks" onClick={boostSkytree} />
    </div>}
    <SceneFallback onFailure={() => {}}><Suspense fallback={null}><Airship active={inHero && pageVisible} /></Suspense></SceneFallback>
    <TowerFireworks active={inHero && pageVisible} interactive={interactive} />
    <div
      className="city-layer"
      aria-hidden="true"
      data-active={inHero && pageVisible}
      data-day={day}
      data-interactive={interactive}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: interactive ? "80vh" : "65vh",
        pointerEvents: "none",
        zIndex: 1,
        "--city-light": lightLevel,
      } as CSSProperties}
    >
      {/* ═══ SKY — deep violet → indigo → teal atmospheric gradient ═══ */}
      <div className="city-atmosphere-original"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(26,12,52,0.0) 0%, rgba(34,14,66,0.22) 20%, rgba(24,12,54,0.34) 46%, rgba(14,16,52,0.28) 72%, rgba(0,220,255,0.05) 100%)",
        }}
      />

      {/* ═══ MOON — distant glowing orb high in the sky ═══ */}
      <div className="city-moon"
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

      {/* ═══ AURORA — soft colour glow high in the sky ═══ */}
      <div style={{
        position: "fixed", top: "12vh", left: "-15%", right: "-15%", height: "30vh",
        opacity: inHero ? 1 : 0, transition: "opacity 0.8s ease",
        pointerEvents: "none", mixBlendMode: "screen",
        background: "linear-gradient(105deg, rgba(0,240,255,0.09) 0%, rgba(140,95,255,0.12) 40%, rgba(255,0,127,0.08) 70%, rgba(0,220,255,0.07) 100%)",
        filter: "blur(58px)",
        animation: "city-aurora 24s ease-in-out infinite",
      }} />

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

      <div className="city-landmarks-fallback" style={{ visibility: sceneReady ? "hidden" : "visible" }}><TokyoTower />
      <div className="skytree-light" style={{ color: lampColor }}><Skytree /></div></div>

      <div className="city-foreground-fallback" style={{ position: "absolute", inset: 0, visibility: sceneReady ? "hidden" : "visible" }}>
      {/* ═══════════ NEAR LAYER — foreground towers ═══════════ */}
      {getCityBuildings(buildingCount, profile.widthScale).map((b, i) => {
        const nc = {
          1: {
            bg: "rgba(5,8,15,0.93)",
            edge: "rgba(0,240,255,0.4)",
            glow: "#00f0ff",
          },
          2: {
            bg: "rgba(10,5,12,0.93)",
            edge: "rgba(255,0,127,0.32)",
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
              maxHeight: Number.isFinite(profile.maxBuildingRatio) ? `${profile.maxBuildingRatio * 100}vw` : undefined,
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
              repeating-linear-gradient(0deg, ${nc.glow}50 0px, ${nc.glow}50 2px, transparent 2px, transparent 9px),
              repeating-linear-gradient(90deg, ${nc.glow}24 0px, ${nc.glow}24 2.5px, transparent 2.5px, transparent 8px)
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

      </div>
      {use3D && <div className="city-foreground-3d" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: interactive ? "100%" : "130%", pointerEvents: interactive ? "auto" : "none" }}>
        <SceneFallback onFailure={() => setSceneReady(false)}><Suspense fallback={null}>
          <SceneManager active={inHero && pageVisible} onReady={() => setSceneReady(true)} />
        </Suspense></SceneFallback>
      </div>}

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

      {/* ═══ TOWER GLOW HALOS — soft, integrated ═══ */}
      <div style={{
        position: "absolute", left: "76%", bottom: "40%", transform: "translateX(-50%)",
        width: "clamp(180px, 22vw, 320px)", height: "48%",
        background: "radial-gradient(ellipse at 50% 42%, rgba(0,225,255,0.20), rgba(150,90,255,0.10) 44%, transparent 72%)",
        filter: "blur(20px)", mixBlendMode: "screen",
      }} />
      <div style={{
        position: "absolute", left: "12.5%", bottom: "12%", transform: "translateX(-50%)",
        width: "clamp(150px, 18vw, 260px)", height: "42%",
        background: "radial-gradient(ellipse at 50% 46%, rgba(255,160,50,0.18), rgba(255,90,20,0.09) 44%, transparent 72%)",
        filter: "blur(20px)", mixBlendMode: "screen",
      }} />

      {/* ═══ NEON REFLECTIONS on the wet street ═══ */}
      {[
        { x: 76, c: "0,225,255" }, { x: 12.5, c: "255,150,50" },
        { x: 42, c: "255,0,127" }, { x: 60, c: "0,240,255" }, { x: 88, c: "255,184,0" },
      ].map((r, i) => (
        <div key={`refl-${i}`} style={{
          position: "absolute", bottom: 0, left: `${r.x}%`, transform: "translateX(-50%)",
          width: "3%", height: "10%",
          background: `linear-gradient(to bottom, rgba(${r.c},0.28), transparent)`,
          filter: "blur(5px)", opacity: 0.55, mixBlendMode: "screen",
        }} />
      ))}

      {/* ═══ FLOATING LIGHT DUST — gentle drift ═══ */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = (i * 11.7 + ((i * 17) % 9)) % 100;
        const c = ["#00f0ff", "#ff5fae", "#ffcf70"][i % 3];
        return (
          <div key={`dust-${i}`} style={{
            position: "absolute", left: `${x}%`, bottom: `${6 + (i % 4) * 8}%`,
            width: "2px", height: "2px", borderRadius: "50%", background: c,
            boxShadow: `0 0 5px ${c}`,
            opacity: 0.6,
            animation: `ember-rise ${16 + (i % 4) * 4}s linear ${((i * 1.4) % 9).toFixed(2)}s infinite`,
          }} />
        );
      })}
    </div>
    </>
  );
}
