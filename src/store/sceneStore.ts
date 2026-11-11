import { create } from "zustand";
import { getCityProfile } from "../canvas/cityModel";

const initialBuildingCount = getCityProfile(typeof window === "undefined" ? 1440 : window.innerWidth).defaultCount;

export type Section =
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "opensource"
  | "testimonials"
  | "contact";

interface SceneStore {
  interactive: boolean;
  buildingCount: number;
  baseBuildingCount: number;
  setViewportWidth: (width: number) => void;
  lightLevel: number;
  daylight: boolean;
  tokyoPulse: number;
  skytreePulse: number;
  shipBoost: number;
  towerFirework: { tower: "tokyo" | "skytree"; at: number } | null;
  rocketLaunch: number;
  setInteractive: (value: boolean) => void;
  setBuildingCount: (count: number) => void;
  setLightLevel: (level: number) => void;
  setDaylight: (value: boolean) => void;
  boostTokyo: () => void;
  boostSkytree: () => void;
  boostShip: () => void;
  activateTokyo: () => void;
  activateSkytree: () => void;
  launchRocket: () => void;
  clearRocketLaunch: () => void;
  resetCity: () => void;
  activeSection: Section;
  mouseX: number;
  mouseY: number;
  hoveredJobIndex: number | null;
  setActiveSection: (section: Section) => void;
  setMouse: (x: number, y: number) => void;
  setHoveredJobIndex: (index: number | null) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  interactive: false,
  buildingCount: initialBuildingCount,
  baseBuildingCount: initialBuildingCount,
  setViewportWidth: (width) => set(state => {
    const next = getCityProfile(width).defaultCount;
    return { baseBuildingCount: next, buildingCount: state.buildingCount === state.baseBuildingCount ? next : state.buildingCount };
  }),
  lightLevel: 1,
  daylight: false,
  tokyoPulse: 0,
  skytreePulse: 0,
  shipBoost: 0,
  towerFirework: null,
  rocketLaunch: 0,
  setInteractive: (interactive) => set(interactive ? { interactive } : { interactive, rocketLaunch: 0 }),
  setBuildingCount: (count) => set({ buildingCount: Math.max(6, Math.min(26, count)) }),
  setLightLevel: (level) => set({ lightLevel: Math.max(.2, Math.min(2.5, level)) }),
  setDaylight: (daylight) => set({ daylight }),
  boostTokyo: () => set({ tokyoPulse: performance.now() }),
  boostSkytree: () => set({ skytreePulse: performance.now() }),
  boostShip: () => set({ shipBoost: performance.now() }),
  activateTokyo: () => Math.random() < .65
    ? set({ towerFirework: { tower: "tokyo", at: performance.now() } })
    : set({ tokyoPulse: performance.now() }),
  activateSkytree: () => Math.random() < .65
    ? set({ towerFirework: { tower: "skytree", at: performance.now() } })
    : set({ skytreePulse: performance.now() }),
  launchRocket: () => set({ rocketLaunch: performance.now() }),
  clearRocketLaunch: () => set({ rocketLaunch: 0 }),
  resetCity: () => set(state => ({ buildingCount: state.baseBuildingCount, lightLevel: 1, daylight: false })),
  activeSection: "hero",
  mouseX: 0,
  mouseY: 0,
  hoveredJobIndex: null,
  setActiveSection: (section) => set({ activeSection: section }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setHoveredJobIndex: (index) => set({ hoveredJobIndex: index }),
}));
