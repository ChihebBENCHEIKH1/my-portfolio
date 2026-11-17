// Shared by React.lazy and the launcher's intent preload. Keep the renderer out
// of the reading path, including after the browser becomes idle.
export function loadSceneManager() {
  return import("./SceneManager").then(module => ({ default: module.SceneManager }));
}

export function preloadSceneManager() {
  // An optional preload can fail offline; React's scene boundary handles the
  // actual launch and leaves the CSS/SVG skyline available in either case.
  void loadSceneManager().catch(() => {});
}
