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
import { CityPlayground } from "./components/CityPlayground";
import { SectionFlow } from "./components/SectionFlow";
const CityBackground = lazy(() => import("./canvas/CityBackground").then(m => ({ default: m.CityBackground })));
import { useSceneStore, type Section } from "./store/sceneStore";

function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
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

function MagneticButtons() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const RADIUS = 100, PULL = 0.12;
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
  const setMouse = useSceneStore(s => s.setMouse);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Mount the decorative city when idle; keep text and navigation first.
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
      { threshold: 0, rootMargin: "-25% 0px -55% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [setActiveSection]);

  useEffect(() => {
    let raf = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setMouse(event.clientX / innerWidth * 2 - 1, -(event.clientY / innerHeight * 2 - 1));
        raf = 0;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [setMouse]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Fixed city and 3D foreground — deferred mount, outside the content layer */}
      {showScene && (
        <Suspense fallback={null}>
          <CityBackground />
        </Suspense>
      )}

      {/* Vignette keeps the content legible over the city. */}
      <div className="vignette-overlay gpu-layer" aria-hidden="true" />
      <SectionFlow />
      <CityPlayground />
      <ScrollProgress />
      <CursorFX />
      <MagneticButtons />

      {/* HTML content — z-10 */}
      <main id="main-content" style={{ position: "relative", zIndex: 10 }}>
        <NavBar titles={textContent} />
        <Header titles={textContent} />
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
