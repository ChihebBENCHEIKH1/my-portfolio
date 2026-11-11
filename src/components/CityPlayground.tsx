import { useEffect, useRef, useState } from "react";
import { useSceneStore } from "../store/sceneStore";
import { useLanguage } from "../context/LanguageContext";
import "./CityPlayground.css";

export function CityPlayground() {
  const { lang } = useLanguage();
  const de = lang === "de";
  const interactive = useSceneStore(s => s.interactive);
  const buildingCount = useSceneStore(s => s.buildingCount);
  const lightLevel = useSceneStore(s => s.lightLevel);
  const daylight = useSceneStore(s => s.daylight);
  const setInteractive = useSceneStore(s => s.setInteractive);
  const setBuildingCount = useSceneStore(s => s.setBuildingCount);
  const setLightLevel = useSceneStore(s => s.setLightLevel);
  const setDaylight = useSceneStore(s => s.setDaylight);
  const resetCity = useSceneStore(s => s.resetCity);
  const tokyoPulse = useSceneStore(s => s.tokyoPulse);
  const skytreePulse = useSceneStore(s => s.skytreePulse);
  const shipBoost = useSceneStore(s => s.shipBoost);
  const towerFirework = useSceneStore(s => s.towerFirework);
  const rocketLaunch = useSceneStore(s => s.rocketLaunch);
  const launchRocket = useSceneStore(s => s.launchRocket);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    const latest = Math.max(tokyoPulse, skytreePulse, shipBoost, towerFirework?.at ?? 0, rocketLaunch);
    if (!latest || performance.now() - latest > 3000) return;
    const tower = towerFirework?.tower === "tokyo" ? "Tokyo Tower" : "Skytree";
    setFeedback(latest === rocketLaunch ? (de ? "Startsequenz aktiviert" : "Launch sequence started") : latest === towerFirework?.at ? `${tower} ${de ? "Feuerwerk" : "fireworks"}` : latest === tokyoPulse ? (de ? "Tokyo Tower leuchtet auf" : "Tokyo Tower illuminated") : latest === skytreePulse ? (de ? "Skytree leuchtet auf" : "Skytree illuminated") : (de ? "Schiff beschleunigt ×3" : "Ship boosted ×3"));
    const timeout = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [tokyoPulse, skytreePulse, shipBoost, towerFirework, rocketLaunch, de]);
  const boostTokyo = useSceneStore(s => s.boostTokyo);
  const boostSkytree = useSceneStore(s => s.boostSkytree);
  const boostShip = useSceneStore(s => s.boostShip);
  const panel = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.dataset.cityTime = daylight ? "day" : "night";
    return () => { delete document.documentElement.dataset.cityTime; };
  }, [daylight]);

  useEffect(() => {
    if (!interactive) return;
    const main = document.getElementById("main-content");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("city-mode");
    main?.setAttribute("inert", "");
    main?.setAttribute("aria-hidden", "true");
    close.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setInteractive(false); return; }
      if (event.key !== "Tab") return;
      const targets = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)') ?? []);
      const first = targets[0], last = targets[targets.length-1];
      if (!panel.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("city-mode");
      main?.removeAttribute("inert"); main?.removeAttribute("aria-hidden");
      window.removeEventListener("keydown", keyboard);
      document.querySelector<HTMLButtonElement>(".city-launch")?.focus();
    };
  }, [interactive, setInteractive]);

  if (!interactive) return <div className="city-launcher">
    <button type="button" className="city-day-toggle" aria-label={de ? "Tagmodus" : "Day mode"} aria-pressed={daylight} onClick={() => setDaylight(!daylight)}>
      <span aria-hidden="true">{daylight ? "☀" : "☾"}</span>{daylight ? (de ? "Tag" : "Day") : (de ? "Nacht" : "Night")}
    </button>
    <button ref={launch} type="button" className="city-launch" onClick={() => setInteractive(true)}>
      <span aria-hidden="true">◈</span>{de ? "Tokyo erkunden" : "Explore Tokyo"}<span className="city-launch-dot" />
    </button>
  </div>;

  return <div ref={panel} className="city-playground" role="dialog" aria-modal="true" aria-labelledby="city-playground-title">
    <div className="city-playground-heading">
      <div><span className="city-playground-kicker">YOUR CITY. YOUR RULES.</span><h2 id="city-playground-title">Neo Tokyo<span> / PLAYGROUND</span></h2>
      <p>{de ? "Klicke auf die Türme für Licht oder Feuerwerk. Klicke auf das Schiff für einen Boost." : "Click the towers for lights or fireworks. Click the ship for a speed boost."}</p></div>
      <button ref={close} type="button" className="city-close" onClick={() => setInteractive(false)}>{de ? "Zurück zum Portfolio" : "Back to portfolio"}<span aria-hidden="true">×</span></button>
    </div>
    <div className="city-feedback" role="status" aria-live="polite">{feedback}</div>
    <div className="city-control-dock">
      <div className="city-control-group">
        <span className="city-control-label">{de ? "SKYLINE" : "BUILDINGS"}</span>
        <div className="city-stepper"><button type="button" aria-label={de ? "Ein Gebäude entfernen" : "Remove a building"} disabled={buildingCount <= 6} onClick={() => setBuildingCount(buildingCount-1)}>−</button><output aria-live="polite">{buildingCount}</output><button type="button" aria-label={de ? "Ein Gebäude hinzufügen" : "Add a building"} disabled={buildingCount >= 26} onClick={() => setBuildingCount(buildingCount+1)}>+</button></div>
      </div>
      <div className="city-control-group city-light-control">
        <label className="city-control-label" htmlFor="city-light-level">{de ? "LICHT" : "CITY LIGHTS"}<span>{Math.round(lightLevel*100)}%</span></label>
        <input id="city-light-level" type="range" min=".2" max="2.5" step=".1" value={lightLevel} onChange={event => setLightLevel(Number(event.currentTarget.value))} />
      </div>
      <div className="city-control-group"><span className="city-control-label">{de ? "ATMOSPHÄRE" : "ATMOSPHERE"}</span><div className="city-time-switch">
        <button type="button" aria-pressed={!daylight} onClick={() => setDaylight(false)}>☾ {de ? "Nacht" : "Night"}</button>
        <button type="button" aria-pressed={daylight} onClick={() => setDaylight(true)}>☀ {de ? "Tag" : "Day"}</button>
      </div></div>
      <div className="city-control-group"><span className="city-control-label">{de ? "AUFLEUCHTEN" : "LIGHT IT UP"}</span><div className="city-boost-controls"><button type="button" onClick={boostTokyo}>Tokyo Tower ↟</button><button type="button" onClick={boostSkytree}>Skytree ↟</button></div></div>
      <div className="city-control-group"><span className="city-control-label">{de ? "FLUG" : "FLIGHT"}</span><div className="city-flight-controls"><button type="button" className="city-ship-boost" onClick={boostShip}>{de ? "Schiff beschleunigen" : "Boost ship"} ↗</button><button type="button" className="city-rocket-launch" disabled={rocketLaunch > 0} onClick={launchRocket}>{rocketLaunch ? (de ? "Start läuft…" : "Launching…") : (de ? "Rakete starten" : "Launch rocket")} ↑</button></div></div>
      <button type="button" className="city-reset" onClick={resetCity}>{de ? "Zurücksetzen" : "Reset"} ↺</button>
    </div>
  </div>;
}
