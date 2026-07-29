import "./App.css";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useSpring, MotionConfig } from "framer-motion";
import { textContent } from "./utils/Text";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { Portfolio } from "./components/Portfolio";
import { Footer } from "./components/Footer";
import { Contact } from "./components/Contact";
import { WorkExperience } from "./components/WorkExperience";
import { Testimonials } from "./components/Testimonials";
import { OpenSource } from "./components/OpenSource";
import NavBar from "./components/NavBar";
import { BootSequence } from "./components/BootSequence";
const SceneManager = lazy(() => import("./canvas/SceneManager").then(m => ({ default: m.SceneManager })));
const CityBackground = lazy(() => import("./canvas/CityBackground").then(m => ({ default: m.CityBackground })));
import { useSceneStore, type Section } from "./store/sceneStore";

function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.documentElement.classList.add("custom-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let visible = false;
    let rafId = 0;
    let lastMove = 0;

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      // Idle-cancel: once the ring has caught up and the mouse has been still
      // for ~1s, stop burning frames; onMove restarts the loop.
      if (performance.now() - lastMove > 1000 && Math.abs(mx - rx) + Math.abs(my - ry) < 0.5) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      lastMove = performance.now();
      if (!rafId) rafId = requestAnimationFrame(loop);
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${mx}px, ${my}px)`;
        if (!visible) {
          visible = true;
          dot.style.opacity = "1";
          if (ringRef.current) ringRef.current.style.opacity = "1";
        }
      }
    };
    const onOver = (e: MouseEvent) => {
      const interactive = !!(e.target as Element).closest?.(
        "a, button, input, textarea, [role='button']"
      );
      ringRef.current?.classList.toggle("cursor-ring-active", interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

const TICKER_ITEMS = [
  "Full_Stack_Engineer", "Go", "TypeScript", "React", "Next.js", "Node.js",
  "Docker", "Kubernetes", "GCP", "Terraform", "CI/CD", "RabbitMQ",
];

function Ticker() {
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="ticker-item">
            <span className={i % 2 ? "ticker-outline" : "ticker-solid"}>{item}</span>
            <span className="ticker-sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MagneticButtons() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const RADIUS = 130, PULL = 0.28;
    let raf = 0;
    // Rect cache — rebuilt lazily after scroll/resize/mutation instead of
    // calling getBoundingClientRect on every button every frame.
    let cache: { btn: HTMLElement; cx: number; cy: number }[] = [];
    let dirty = true;
    const invalidate = () => { dirty = true; };
    const rebuild = () => {
      cache = Array.from(
        document.querySelectorAll<HTMLElement>(".btn-cyber, .btn-pink")
      ).map((btn) => {
        const r = btn.getBoundingClientRect();
        return { btn, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
      dirty = false;
    };
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (dirty) rebuild();
        const vh = window.innerHeight;
        for (const { btn, cx, cy } of cache) {
          if (cy < -RADIUS || cy > vh + RADIUS) continue; // offscreen
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const f = (1 - dist / RADIUS) * PULL;
            btn.style.transform = `translate(${(dx * f).toFixed(1)}px, ${(dy * f).toFixed(1)}px)`;
          } else if (btn.style.transform) {
            btn.style.transform = "";
          }
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "2px",
      transformOrigin: "0% 50%", scaleX,
      background: "linear-gradient(90deg, #00f0ff, #ff007f 55%, #ffb800)",
      boxShadow: "0 0 12px rgba(0,240,255,0.5), 0 0 24px rgba(255,0,127,0.25)",
      zIndex: 130, pointerEvents: "none",
    }} />
  );
}

const SECTIONS: { id: string; key: Section }[] = [
  { id: "Home", key: "hero" },
  { id: "About", key: "about" },
  { id: "WorkExperience", key: "experience" },
  { id: "Projects", key: "projects" },
  { id: "OpenSource", key: "opensource" },
  { id: "Testimonials", key: "testimonials" },
  { id: "Contact", key: "contact" },
];

function App() {
  const setActiveSection = useSceneStore((s) => s.setActiveSection);
  const setMouse = useSceneStore((s) => s.setMouse);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Defer mounting the 3D scene until the browser is idle — keeps Three.js
  // (~242 KiB) out of the LCP critical path. Falls back to setTimeout on
  // browsers without requestIdleCallback.
  const [showScene, setShowScene] = useState(false);
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: Function; cancelIdleCallback?: Function };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setShowScene(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setShowScene(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  // Track active section via IntersectionObserver → drives 3D scene state
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = SECTIONS.find((s) => s.id === entry.target.id);
            if (match) setActiveSection(match.key);
          }
        });
      },
      { threshold: 0.35 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [setActiveSection]);

  // Normalised mouse position for 3D parallax (throttled to rAF)
  useEffect(() => {
    let rafId = 0;
    const onMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setMouse(
          (e.clientX / window.innerWidth) * 2 - 1,
          -((e.clientY / window.innerHeight) * 2 - 1)
        );
        rafId = 0;
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [setMouse]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Fixed city skyline + 3D background — deferred mount, not in LCP path */}
      {showScene && (
        <Suspense fallback={null}>
          <CityBackground />
          <SceneManager />
        </Suspense>
      )}

      {/* Cinematic layers — vignette under nav, grain above everything */}
      <div className="vignette-overlay gpu-layer" aria-hidden="true" />
      <div className="grain-overlay gpu-layer" aria-hidden="true" />
      <ScrollProgress />
      <CursorFX />
      <MagneticButtons />
      <BootSequence />

      {/* HTML content — z-10 */}
      <main id="main-content" style={{ position: "relative", zIndex: 10 }}>
        <NavBar titles={textContent} />
        <Header titles={textContent} />
        <Ticker />
        <About titles={textContent} />
        <WorkExperience titles={textContent} />
        <Portfolio titles={textContent} />
        <OpenSource titles={textContent} />
        <Testimonials titles={textContent} />
        <Contact titles={textContent} />
        <Footer />
      </main>
    </MotionConfig>
  );
}

export default App;
