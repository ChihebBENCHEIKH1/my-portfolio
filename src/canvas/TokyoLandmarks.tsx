import { memo } from "react";
import "./TokyoLandmarks.css";

export const TokyoTower = memo(function TokyoTower() {
  const tiers = [198, 220, 248, 278, 311, 348, 390, 436, 488, 546];
  const edge = (y: number) => 8 + Math.pow((y - 155) / 425, 1.55) * 76;
  return (
    <svg className="tokyo-landmark tokyo-tower" viewBox="0 0 200 600" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tower-steel" x2="0" y2="1">
          <stop stopColor="#ffe2b8" /><stop offset=".3" stopColor="#ffb780" /><stop offset=".8" stopColor="#e77d5d" /><stop offset="1" stopColor="#b75950" />
        </linearGradient>
        <linearGradient id="tower-deck" x2="0" y2="1"><stop stopColor="#ffe2bb" /><stop offset=".25" stopColor="#c66d56" /><stop offset=".65" stopColor="#382d35" /><stop offset="1" stopColor="#ed9f76" /></linearGradient>
        <radialGradient id="tower-halo"><stop stopColor="#ff9c6e" stopOpacity=".15" /><stop offset="1" stopColor="#ff9c6e" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="340" rx="98" ry="245" fill="url(#tower-halo)" />
      <g stroke="url(#tower-steel)" strokeLinecap="round" strokeLinejoin="round">
        {/* Antenna, alternating white and red-orange bands. */}
        <path d="M100 18v34m-2 0-2 37h8l-2-37m-6 37-3 51h14l-3-51m-10 51-3 40h20l-3-40" strokeWidth="2" />
        <path d="M97 67h6m-8 35h10m-11 17h12m-13 33h14m-15 15h16" stroke="#ffe9cf" strokeWidth="3" />
        <path d="M100 177v372" strokeOpacity=".55" strokeWidth="1" />
        <path d="M91 177C87 310 62 464 12 580M109 177c4 133 29 287 79 403" strokeWidth="3" />
        <path d="M95 183C92 315 73 454 28 580M105 183c3 132 22 271 67 397" strokeWidth="1.2" />
        {tiers.map((y, i) => {
          const next = tiers[i + 1] ?? 580, a = edge(y), b = edge(next);
          return <path key={y} d={`M${100 - a} ${y}h${a * 2}M${100 - a} ${y}l${a + b} ${next - y}m${-2 * b} 0 ${a + b} ${y - next}`} strokeWidth={i > 5 ? 1.5 : 1} opacity=".85" />;
        })}
        <path d="M35 576Q100 451 165 576" strokeWidth="3" />
        <path d="M12 580h32m112 0h32" strokeWidth="5" />
      </g>
      {/* Top Deck and two-storey Main Deck with luminous observation windows. */}
      <path d="m87 170 4-7h18l4 7v14H87z" fill="url(#tower-deck)" stroke="#ffd9b0" strokeWidth=".7" />
      <path d="M88 173h24m-24 6h24" stroke="#ffdbad" strokeWidth="2" />
      <path d="m64 355 7-9h58l7 9-3 24H67z" fill="url(#tower-deck)" stroke="#e5a07b" />
      <path d="M66 358h68m-67 13h66" stroke="#ffdfb5" strokeWidth="3" />
      <path d="M74 356v19m8-19v19m9-19v19m9-19v19m9-19v19m9-19v19m8-19v19" stroke="#6f4b47" strokeWidth="1" />
      <path d="M62 380h76" stroke="#eda37a" strokeWidth="2" />
      <circle className="tokyo-beacon" cx="100" cy="16" r="2" fill="#ffe4c7" />
    </svg>
  );
});

export const Skytree = memo(function Skytree() {
  return (
    <svg className="tokyo-landmark tokyo-skytree" viewBox="0 0 140 760" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="skytree-body" x2="1" y2="0"><stop stopColor="#284659" /><stop offset=".4" stopColor="#93bfc9" /><stop offset=".55" stopColor="#416b83" /><stop offset="1" stopColor="#1e364b" /></linearGradient>
        <linearGradient id="skytree-deck" x2="0" y2="1"><stop stopColor="#d5eeee" /><stop offset=".2" stopColor="#547b91" /><stop offset=".5" stopColor="#17283f" /><stop offset="1" stopColor="#a0dbe2" /></linearGradient>
        <radialGradient id="skytree-halo"><stop stopColor="currentColor" stopOpacity=".13" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="70" cy="315" rx="70" ry="255" fill="url(#skytree-halo)" />
      {/* A tapering truss, rather than a solid neon bar. */}
      <path d="M59 194C58 366 43 563 24 733h92C97 563 82 366 81 194z" fill="url(#skytree-body)" fillOpacity=".4" />
      <g stroke="currentColor">
        <path d="M59 194C58 366 43 563 24 733M81 194c1 172 16 369 35 539M70 194v539" strokeWidth="1.4" opacity=".75" />
        {Array.from({ length: 22 }, (_, i) => {
          const y = 211 + i * 23, half = 11 + Math.pow(i / 22, 1.5) * 34;
          const next = 11 + Math.pow((i + 1) / 22, 1.5) * 34;
          return <path key={i} d={`M${70 - half} ${y}h${half * 2}m${-half * 2} 0 ${half + next} 23m${-next * 2} 0 ${half + next} -23`} strokeWidth=".65" opacity={i % 3 === 0 ? .65 : .32} />;
        })}
        <path d="M64 185V112h12v73M67 112V54h6v58M70 54V10" strokeWidth="1.4" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M65 ${80 + i * 10}h10`} strokeWidth="1" opacity=".7" />)}
      </g>
      {/* Tembo Galleria and the wider, softly flared Tembo Deck. */}
      <path d="m53 194 4-15h26l4 15-5 20H58z" fill="url(#skytree-deck)" stroke="#abd7df" strokeWidth=".8" />
      <path d="M55 192h30m-29 6h28m-27 7h26" stroke="currentColor" strokeWidth="1.6" />
      <path d="m43 291 5-10h44l5 10-9 31H52z" fill="url(#skytree-deck)" stroke="#a5d4df" strokeWidth=".8" />
      <path d="M44 291h52m-50 7h48m-46 7h44m-42 8h40" stroke="currentColor" strokeWidth="1.8" />
      <path d="M50 287v23m7-27v33m8-33v36m10-36v36m8-36v33m7-29v23" stroke="#213c51" strokeWidth="1" />
      <path d="M55 325h30" stroke="#d2eaf0" />
      <circle className="tokyo-beacon" cx="70" cy="10" r="1.8" fill="#ebcada" />
    </svg>
  );
});
