/**
 * Chiheb's "Shahab / meteor" mark — a streak curving into a C with three rising
 * ش (shin) fragments. Rebuilt clean: transparent, bold, theme-coloured, tight
 * glow (reads at any size). `animate` self-draws the strokes along their real
 * paths (the load "mimic"). Same geometry as the original logo-meteor.svg.
 */
export function Logo({ size = 38, animate = false }: { size?: number; animate?: boolean }) {
  const STREAK = "M 65 85 Q 180 170, 330 280";
  const HEAD = "M 330 280 C 358 302, 382 332, 378 365 C 374 398, 348 418, 305 425 C 270 430, 240 422, 215 408";
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none"
      role="img" aria-label="Chiheb Ben Cheikh"
      style={{ filter: "drop-shadow(0 0 3px rgba(0,240,255,0.6))", overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="lgTrail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="45%" stopColor="#00f0ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Meteor streak */}
      <path d={STREAK} pathLength={1} className={animate ? "logo-draw-1" : undefined}
        stroke="url(#lgTrail)" strokeWidth="16" strokeLinecap="round" fill="none" />

      {/* Head curving into a C */}
      <path d={HEAD} pathLength={1} className={animate ? "logo-draw-2" : undefined}
        stroke="#ffffff" strokeWidth="15" strokeLinecap="round" fill="none" />

      {/* Three rising fragments (shin) */}
      <g>
        <line x1="160" y1="176" x2="140" y2="126" stroke="#00f0ff" strokeWidth="7" strokeLinecap="round"
          className={animate ? "logo-frag logo-frag-1" : undefined} />
        <circle cx="140" cy="123" r="7" fill="#00f0ff" className={animate ? "logo-frag logo-frag-1" : undefined} />
        <line x1="210" y1="200" x2="200" y2="134" stroke="#ff007f" strokeWidth="7" strokeLinecap="round"
          className={animate ? "logo-frag logo-frag-2" : undefined} />
        <circle cx="200" cy="131" r="8" fill="#ff007f" className={animate ? "logo-frag logo-frag-2" : undefined} />
        <line x1="265" y1="230" x2="260" y2="172" stroke="#ffb800" strokeWidth="7" strokeLinecap="round"
          className={animate ? "logo-frag logo-frag-3" : undefined} />
        <circle cx="260" cy="169" r="7" fill="#ffb800" className={animate ? "logo-frag logo-frag-3" : undefined} />
      </g>

      {/* Meteor head core */}
      <circle cx="330" cy="280" r="15" fill="#ffffff"
        className={animate ? "logo-frag logo-frag-head" : undefined} />
    </svg>
  );
}
