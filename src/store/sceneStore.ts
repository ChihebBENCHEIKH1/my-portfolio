import { create } from "zustand";

export type Section =
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "testimonials"
  | "contact";

interface SceneStore {
  activeSection: Section;
  mouseX: number;
  mouseY: number;
  hoveredJobIndex: number | null;
  setActiveSection: (section: Section) => void;
  setMouse: (x: number, y: number) => void;
  setHoveredJobIndex: (index: number | null) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  activeSection: "hero",
  mouseX: 0,
  mouseY: 0,
  hoveredJobIndex: null,
  setActiveSection: (section) => set({ activeSection: section }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setHoveredJobIndex: (index) => set({ hoveredJobIndex: index }),
}));
