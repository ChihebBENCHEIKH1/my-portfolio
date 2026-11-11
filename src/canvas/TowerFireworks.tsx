import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSceneStore } from "../store/sceneStore";
import "./TowerFireworks.css";

type Burst = { id: string; event: number; tower: "tokyo" | "skytree"; x: number; y: number; color: string; delay: number; rays: number[] };
const COLORS = ["#76eaff", "#ff8ace", "#ffdb92", "#bfa1ff"];

export function TowerFireworks({ active, interactive }: { active: boolean; interactive: boolean }) {
  const firework = useSceneStore(s => s.towerFirework);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const timers = useRef(new Set<number>());
  useEffect(() => {
    if (!firework) return;
    const spread = Math.min(innerWidth * .08, 90);
    const created = Array.from({ length: 3 }, (_, index): Burst => ({
      id: `${firework.at}-${index}`, event: firework.at, tower: firework.tower,
      x: index === 0 ? 0 : (index === 1 ? -1 : 1) * spread * (.4 + Math.random() * .6),
      y: -20 - Math.random() * 55, delay: index * .3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rays: Array.from({ length: 22 }, () => .65 + Math.random() * .35),
    }));
    setBursts(previous => [...previous.slice(-3), ...created]);
    const timeout = window.setTimeout(() => {
      setBursts(previous => previous.filter(burst => burst.event !== firework.at));
      timers.current.delete(timeout);
    }, 2500);
    timers.current.add(timeout);
  }, [firework]);
  useEffect(() => {
    const pending = timers.current;
    return () => { pending.forEach(window.clearTimeout); pending.clear(); };
  }, []);

  return <div className="city-fireworks" data-active={active} aria-hidden="true">
    {bursts.map(burst => <div key={burst.id} className="tower-firework" data-tower={burst.tower} style={{
      left: `calc(var(--${burst.tower}-x, ${burst.tower === "tokyo" ? 15.5 : 84}vw) + ${burst.x}px)`,
      top: `calc(var(--${burst.tower}-top, ${(burst.tower === "tokyo" ? 32 : 19) + (interactive ? 4 : 0)}vh) + ${burst.y}px)`,
      "--firework-color": burst.color, "--burst-delay": `${burst.delay}s`,
    } as CSSProperties}>
      <span className="firework-core" />
      {burst.rays.map((reach, index) => <span key={index} className="firework-ray" style={{
        transform: `rotate(${index * 360 / burst.rays.length}deg)`, "--spark-reach": reach,
      } as CSSProperties}><i /></span>)}
    </div>)}
  </div>;
}
