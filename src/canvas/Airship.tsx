import { useEffect, useRef, useState } from "react";
import { useSceneStore } from "../store/sceneStore";
import { useLanguage } from "../context/LanguageContext";
import "./Airship.css";
import orbitalLauncher from "../assets/orbital-launcher-v1.png";

export function Airship({ active }: { active: boolean }) {
  const flight = useRef<HTMLButtonElement>(null);
  const rocket = useRef<HTMLDivElement>(null);
  const interactive = useSceneStore(s => s.interactive);
  const rocketLaunch = useSceneStore(s => s.rocketLaunch);
  const clearRocketLaunch = useSceneStore(s => s.clearRocketLaunch);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { lang } = useLanguage();
  const de = lang === "de";
  const [countdown, setCountdown] = useState<number | null>(null);
  const boost = useSceneStore(s => s.shipBoost);
  const boostShip = useSceneStore(s => s.boostShip);
  const [boosted, setBoosted] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!active || !interactive || !rocketLaunch) { setCountdown(null); return; }
    if (reduced) {
      setCountdown(null);
      const timeout = window.setTimeout(clearRocketLaunch, 800);
      return () => window.clearTimeout(timeout);
    }
    const update = () => {
      const animation = rocket.current?.getAnimations().find(item => "animationName" in item && item.animationName === "rocket-launch");
      if (!animation || animation.currentTime === null) { setCountdown(null); return; }
      const phase = Number(animation.currentTime);
      setCountdown(phase < 5000 ? Math.ceil((5000 - phase) / 1000) : null);
    };
    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [active, reduced, interactive, rocketLaunch, clearRocketLaunch]);
  useEffect(() => {
    const element = flight.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: .1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!boost) return;
    const animation = flight.current?.getAnimations().find(item => "animationName" in item && item.animationName === "airship-pass");
    if (!animation) return;
    // Preserve the current position when accelerating; don't restart the CSS animation.
    const bounds = flight.current?.getBoundingClientRect();
    if (bounds && (bounds.right < 0 || bounds.left > innerWidth)) animation.currentTime = 3500;
    animation.updatePlaybackRate(3);
    setBoosted(true);
    const timeout = window.setTimeout(() => { animation.updatePlaybackRate(1); setBoosted(false); }, 2300);
    return () => { window.clearTimeout(timeout); animation.updatePlaybackRate(1); };
  }, [boost]);

  return <>
    {interactive && rocketLaunch > 0 && <div className="orbital-launch-sky" data-active={active} aria-hidden="true">
    <div key={rocketLaunch} ref={rocket} className="sky-rocket" onAnimationEnd={event => {
      if (event.target === event.currentTarget && event.animationName === "rocket-launch") clearRocketLaunch();
    }}>
      <img className="orbital-launcher" src={orbitalLauncher} alt="" width="887" height="1774" decoding="async" />
    </div>
    </div>}
    <div className="airship-sky" data-active={active}>
    <div className="rocket-notice" role="status" aria-live="polite">
      {countdown !== null && <div className="rocket-notice-panel">
        <span className="rocket-notice-light" aria-hidden="true" />
        <span aria-hidden="true"><small>{de ? "ORBITALSTART" : "ORBITAL LAUNCH"}</small><strong>T−00:0{countdown}</strong></span>
        <span className="sr-only">{de ? "Eine Rakete startet in fünf Sekunden." : "A rocket will launch in five seconds."}</span>
      </div>}
    </div>
    <button ref={flight} type="button" className="airship-flight" data-boosted={boosted} onClick={boostShip} tabIndex={active && onScreen ? 0 : -1} aria-label={de ? "Das fliegende Schiff beschleunigen" : "Give the flying ship a speed boost"}>
      <span className="airship-banner" aria-hidden="true">
        <span>{de ? "WILLKOMMEN" : "WELCOME ABOARD"}</span><strong>CHIHEB BEN CHEIKH</strong><small>SOFTWARE ENGINEER</small><b>↗</b>
      </span>
      <svg className="airship-tow" viewBox="0 0 66 30" fill="none" aria-hidden="true"><path d="M0 15Q33 24 66 8" stroke="#8ac4ce" strokeWidth="1" strokeOpacity=".65" /><path d="M0 15Q33 24 66 8" stroke="#78edfa" strokeWidth="3" strokeOpacity=".07" /></svg>
      <svg className="airship-craft" viewBox="0 0 240 105" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="courier-hull" x1="128" y1="36" x2="128" y2="78" gradientUnits="userSpaceOnUse"><stop stopColor="#44667c" /><stop offset=".38" stopColor="#243d54" /><stop offset="1" stopColor="#0a172c" /></linearGradient>
          <linearGradient id="courier-deck" x1="80" y1="37" x2="171" y2="65" gradientUnits="userSpaceOnUse"><stop stopColor="#3d5e72" /><stop offset="1" stopColor="#172c45" /></linearGradient>
          <linearGradient id="courier-glass" x1="130" y1="18" x2="145" y2="45" gradientUnits="userSpaceOnUse"><stop stopColor="#83d3e4" stopOpacity=".38" /><stop offset="1" stopColor="#18445b" stopOpacity=".9" /></linearGradient>
          <linearGradient id="courier-thrust"><stop stopColor="#4ae6ff" stopOpacity="0" /><stop offset=".75" stopColor="#64eaff" stopOpacity=".65" /><stop offset="1" stopColor="#dbffff" /></linearGradient>
        </defs>
        <g className="shuttle-exhaust"><path d="M36 49Q17 48 2 54q16 6 34 4Z" fill="url(#courier-thrust)" /><path d="M36 61Q18 60 5 65q16 5 31 3Z" fill="url(#courier-thrust)" /></g>
        <path d="M53 46 28 25l24 4 35 18Z" fill="url(#courier-deck)" stroke="#588a9d" strokeWidth=".8" />
        <path d="m62 65 44 8-30 19-34-3Z" fill="#172b43" stroke="#86658f" strokeWidth=".8" />
        <path d="m48 87 27 2 19-12" stroke="#cf79b7" strokeWidth="1" />
        <ellipse cx="138" cy="34" rx="35" ry="23" fill="#7beefa" opacity=".06" />
        <path d="M103 43q10-25 33-24c18 1 30 10 42 26" fill="url(#courier-glass)" stroke="#a8e9ee" strokeWidth="1.3" />
        <path d="M111 35q12-17 31-11" stroke="#c4eff3" strokeWidth="1.1" strokeOpacity=".7" />
        <path d="m146 23 14 19" stroke="#7cbdce" strokeWidth="1.2" />
        <g className="shuttle-captain">
          <path d="M122 43v-4q8-6 15 0v6" fill="#7fa5bb" />
          <circle cx="130" cy="31" r="5" fill="#b1cedb" />
          <path d="M129 29h5v4h-5" fill="#183e57" />
          <path d="M130 29h3" stroke="#8deaff" strokeWidth=".7" />
          <g className="captain-wave"><path d="m124 40-8-7-1-8" stroke="#a3c7d6" strokeWidth="3" strokeLinecap="round" /><path d="m113 24 2-2 2 2" stroke="#bedce7" strokeWidth="2" strokeLinecap="round" /></g>
        </g>
        <path d="M57 42q44-9 91-4l34 6q22 6 41 17l-26 12q-19 8-51 6l-76-5Q46 72 39 59Z" fill="url(#courier-hull)" stroke="#4b7e97" strokeWidth=".8" />
        <path d="M57 42q43-8 91-4l34 6 35 17H81L44 54Z" fill="url(#courier-deck)" />
        <path d="M67 44q44-6 81-3l31 5 22 9" stroke="#90cbd5" strokeWidth="1" strokeOpacity=".8" />
        <path d="M82 62h128" stroke="#89f2ed" strokeWidth="1.4" />
        <path d="M75 72h88" stroke="#e68bca" strokeWidth="1.7" />
        <path d="M166 72h14" stroke="#d9a5d2" strokeWidth="1.3" />
        <path d="m88 49 14 10m69-11 13 11" stroke="#10253b" strokeWidth="1.2" />
        <path d="M112 53h27" stroke="#7696a9" strokeWidth=".8" strokeOpacity=".5" />
        <rect x="32" y="46" width="12" height="14" rx="4" fill="#0b1b30" stroke="#577d92" />
        <path d="M34 49v8" stroke="#95f3fa" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="34" y="60" width="11" height="10" rx="3" fill="#0b1b30" stroke="#577d92" strokeWidth=".8" />
        <path d="M36 63v4" stroke="#96d8f5" strokeWidth="2" strokeLinecap="round" />
        <path d="M209 61h6" stroke="#c3f7f2" strokeWidth="2" strokeLinecap="round" />
        <circle cx="149" cy="43" r="1.7" fill="#e4b4f4" /><circle cx="76" cy="46" r="1.4" fill="#a0faff" />
      </svg>
      <span className="airship-boost-label" aria-hidden="true">BOOST ↗</span>
    </button>
  </div>
  </>;
}
