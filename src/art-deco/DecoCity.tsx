import type { CSSProperties } from "react";
import cityIllustration from "../assets/dark-deco-city-v1.png";

type Props = {
  night: boolean;
  buildings: number;
  light: number;
  glowing: boolean;
  exploring: boolean;
  onIlluminate: () => void;
};

export function DecoCity({ night, buildings, light, glowing, exploring, onIlluminate }: Props) {
  const windows = Math.min(1, light * (night ? .8 : .48));
  return (
    <div className="deco-city" data-exploring={exploring} data-glowing={glowing}
      style={{ "--deco-window-opacity": windows } as CSSProperties} aria-hidden="true">
      <img className="deco-city-illustration" src={cityIllustration} width="1903" height="826" alt="" fetchPriority="high" />
      <div className="deco-sky-wash" />
      <svg className="deco-city-art" viewBox="0 0 1440 680" fill="none">
        <defs>
          <linearGradient id="deco-building" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--deco-building-top)" /><stop offset="1" stopColor="var(--deco-building-bottom)" />
          </linearGradient>
          <linearGradient id="deco-scarlet" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#781c30" /><stop offset="1" stopColor="#351624" />
          </linearGradient>
          <pattern id="deco-windows" width="23" height="34" patternUnits="userSpaceOnUse">
            <rect x="6" y="7" width="4" height="19" fill="var(--deco-window)" />
            <path d="M6 16h4" stroke="#15212d" strokeWidth="1.5" />
          </pattern>
          <pattern id="deco-distance-windows" width="28" height="43" patternUnits="userSpaceOnUse">
            <rect x="8" y="12" width="3" height="8" fill="var(--deco-window)" opacity=".65" />
          </pattern>
          <linearGradient id="deco-ground" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#080f1b" /><stop offset="1" stopColor="var(--deco-paper)" />
          </linearGradient>
          <linearGradient id="deco-signal-light" x1="0" y1="1" x2="0" y2="0">
            <stop stopColor="#f4db9c" stopOpacity=".32" /><stop offset="1" stopColor="#e6dfba" stopOpacity=".04" />
          </linearGradient>
          <filter id="deco-paper-texture" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="8" stitchTiles="stitch" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .12 0" result="paper" />
            <feBlend in="SourceGraphic" in2="paper" mode="multiply" result="paint" />
            <feComposite in="paint" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g className="deco-signal">
          <path d="M1110 575 842 107 989 69Z" fill="url(#deco-signal-light)" />
          <ellipse cx="913" cy="90" rx="79" ry="48" transform="rotate(-16 913 90)" fill="#e5dbb0" opacity=".16" />
          <text x="913" y="105" textAnchor="middle" fill="#e6dfb9" fontSize="47" fontFamily="Bebas Neue" letterSpacing="7" transform="rotate(-16 913 90)">CB</text>
        </g>
        <g fill="var(--deco-distance)" opacity=".8">
          {Array.from({ length: 24 }, (_, i) => {
            const height = 100 + (i * 47) % 180;
            return <path key={i} d={`M${i * 64 - 30} 646v-${height}h14v-18h29v18h19v${height}Z`} />;
          })}
        </g>
        <g className="deco-city-buildings" filter="url(#deco-paper-texture)">
          {Array.from({ length: buildings }, (_, i) => {
            const x = i * 1440 / buildings + 6;
            const width = 1440 / buildings * .73;
            const height = 135 + (i * 61) % 185;
            return <g key={i}>
              <path d={`M${x} 646V${646 - height}l${width * .22}-15h${width * .63}l${width * .15}15v${height}Z`} fill="url(#deco-building)" />
              <path d={`M${x + width * .85} ${631 - height}l${width * .15}15v${height}h-${width * .15}Z`} fill={i % 3 === 0 ? "url(#deco-scarlet)" : "#060c15"} />
              <rect x={x + 6} y={656 - height} width={width * .69} height={height - 20} fill="url(#deco-distance-windows)" className="deco-window-grid" />
              <path d={`M${x} ${646 - height}h${width * .85}`} stroke="#4f6076" strokeOpacity=".5" />
            </g>;
          })}
        </g>
        <g className="deco-landmark deco-landmark-left" filter="url(#deco-paper-texture)" onClick={onIlluminate}>
          <path d="M330 646V341h23v-59h22v-54h20v-34h25v34h20v54h22v59h23v305Z" fill="url(#deco-building)" />
          <path d="m420 194 23 17v43l21 18v43l25 26v305h-46V282h-23Z" fill="url(#deco-scarlet)" />
          <path d="M397 194v-64M363 646V355m22 291V302m24 344V253" stroke="#5c657a" strokeOpacity=".6" strokeWidth="3" />
          <path d="M348 377h80v269h-80Z" fill="url(#deco-windows)" className="deco-window-grid" />
          <path d="M329 350h113v14H329Z" fill="#060c15" />
        </g>
        <g className="deco-landmark deco-landmark-center" filter="url(#deco-paper-texture)" onClick={onIlluminate}>
          <path d="M622 646V367h24v-64h23v-52h19v-54h20v-52h26v52h20v54h19v52h23v64h24v279Z" fill="url(#deco-building)" />
          <path d="m734 145 26 19v47l19 18v41l23 18v59l26 20v279h-52V303h-23V251h-19Z" fill="url(#deco-scarlet)" />
          <path d="M720 145V87" stroke="#606d89" strokeWidth="3" />
          {[678, 700, 722, 744].map((x, i) => <g key={x} className="deco-window-grid">
            <path d={`M${x} ${310 - (i === 1 || i === 2 ? 53 : 0)}v287`} stroke="var(--deco-window)" strokeWidth="5" />
            {[340, 390, 440, 490, 540, 580].map(y => <path key={y} d={`M${x - 4} ${y}h8`} stroke="#0d1822" strokeWidth="4" />)}
          </g>)}
          <path d="M640 388h21v258h-21m115-258h21v258h-21" fill="url(#deco-distance-windows)" className="deco-window-grid" />
          <path d="M682 646v-33l37-25 37 25v33" fill="#040910" />
          <path d="M622 377h151v12H622Z" fill="#030a12" />
        </g>
        <g className="deco-landmark deco-landmark-right" filter="url(#deco-paper-texture)" onClick={onIlluminate}>
          <path d="M988 646V358h22v-49h23v-56h20v-47h24v47h20v56h23v49h22v288Z" fill="url(#deco-building)" />
          <path d="m1077 206 21 16v51l23 18v48l24 19v288h-46V309h-22Z" fill="#10172a" />
          <path d="M1064 206v-52" stroke="#617891" strokeWidth="3" />
          <path d="M1005 378h82v268h-82Z" fill="url(#deco-windows)" className="deco-window-grid" />
          <path d="M1034 309v337m45-337v337" stroke="#516172" strokeOpacity=".5" strokeWidth="3" />
          <path d="m1035 306 29-37 29 37Z" fill="#060e1b" />
        </g>
        <path d="M0 644h1440v36H0Z" fill="url(#deco-ground)" />
      </svg>
    </div>
  );
}
