import { useEffect, useRef, useState } from "react";

const LINES = [
  { t: "CB.OS  v2.4.1  —  cold boot", ok: "" },
  { t: "loading neo-tokyo grid", ok: "OK" },
  { t: "mounting particle field", ok: "OK" },
  { t: "establishing secure uplink", ok: "OK" },
  { t: "decrypting profile", ok: "OK" },
  { t: "render engine online", ok: "OK" },
];

/**
 * Cinematic terminal boot overlay. Plays once per tab session, is skippable
 * (click / any key), respects prefers-reduced-motion, and hard-exits after a
 * safety timeout so it can never trap the page.
 */
export function BootSequence() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const already =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("cb_booted");

  const willPlay = !reduced && !already;
  const [visible, setVisible] = useState(willPlay);
  const [shown, setShown] = useState(0);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  // If the boot won't play (reduced-motion / already seen this session), still
  // signal the hero to run its decrypt reveal immediately.
  useEffect(() => {
    if (!willPlay) window.dispatchEvent(new Event("cb:boot-done"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem("cb_booted", "1"); } catch { /* ignore */ }

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPct(100);
      setExiting(true);
      window.dispatchEvent(new Event("cb:boot-done"));
      window.setTimeout(() => setVisible(false), 520);
    };

    const lineTimers = LINES.map((_, i) =>
      window.setTimeout(() => setShown((s) => Math.max(s, i + 1)), 160 + i * 190)
    );
    const bar = window.setInterval(
      () => setPct((p) => (p >= 100 ? 100 : p + 3)),
      42
    );
    const end = window.setTimeout(finish, 1850);
    const safety = window.setTimeout(finish, 4200);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(bar);
      clearTimeout(end);
      clearTimeout(safety);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`boot crt-scanline ${exiting ? "boot-exit" : ""}`} role="presentation" aria-hidden="true">
      <div className="boot-inner">
        <div className="boot-brand">CB<span className="amp">//</span>OS</div>
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className="boot-line">
            <span>{"> "}{l.t}</span>
            {l.ok && <><span className="boot-dots" /><span className="boot-ok">{l.ok}</span></>}
          </div>
        ))}
        {shown >= LINES.length && (
          <div className="boot-online">{"> "}SYSTEM ONLINE<span className="cursor-blink" /></div>
        )}
        <div className="boot-bar"><div className="boot-bar-fill" style={{ right: `${100 - pct}%` }} /></div>
        <div className="boot-pct"><span>DECRYPT</span><span>{pct}%</span></div>
      </div>
      <div className="boot-skip">click or press any key to skip</div>
    </div>
  );
}
