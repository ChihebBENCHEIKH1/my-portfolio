import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const GLYPHS = "アカサタナハマヤ0123456789ABCDEF#%&*<>/=+".split("");

/**
 * Decrypts `text` from random cyber-glyphs, left to right. Can run when the boot
 * overlay lifts (the `cb:boot-done` event), and on hover. autoStart=false keeps
 * first-paint text stable. Reduced-motion renders it plainly. The visible
 * layers are aria-hidden; give the parent element the accessible label.
 */
export function ScrambleText({ text, className, style, active, autoStart = true }: {
  text: string; className?: string; style?: CSSProperties;
  /** Optional external trigger — re-runs the decrypt whenever this turns true
   *  (e.g. wire it to whileInView). Boot/hover behavior is unchanged. */
  active?: boolean;
  /** Keep important prerendered text stable on load; hover still decrypts it. */
  autoStart?: boolean;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setOut(text); return; }
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const per = 1.7, hold = 6;
    const done = text.length * per + hold + 6;
    const tick = () => {
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " ") { s += " "; continue; }
        s += frame >= i * per + hold ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (frame++ < done) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    if (active) run();
  }, [active, run]);

  useEffect(() => {
    setOut(text);
    if (!autoStart) return () => cancelAnimationFrame(raf.current);
    let fired = false;
    const onDone = () => { fired = true; run(); };
    window.addEventListener("cb:boot-done", onDone, { once: true });
    const fb = window.setTimeout(() => { if (!fired) run(); }, 3000); // safety if no boot
    return () => {
      window.removeEventListener("cb:boot-done", onDone);
      clearTimeout(fb);
      cancelAnimationFrame(raf.current);
    };
  }, [text, run, autoStart]);

  return (
    <span style={{ position: "relative", display: "inline-block" }} onPointerEnter={run}>
      <span aria-hidden style={{ visibility: "hidden" }}>{text}</span>
      <span aria-hidden className={className}
        style={{ position: "absolute", inset: 0, whiteSpace: "nowrap", ...style }}>{out}</span>
    </span>
  );
}
