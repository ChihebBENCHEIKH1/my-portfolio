import type { CSSProperties } from "react";

type Props = { night: boolean; buildings: number; light: number; glowing: boolean; exploring: boolean; onIlluminate: () => void };

export function DecoCity({ night, buildings, light, glowing, exploring, onIlluminate }: Props) {
  const windows = Math.min(1, light * (night ? .85 : .45));
  return <div className="deco-city" data-exploring={exploring} data-glowing={glowing} style={{ "--deco-window-opacity": windows } as CSSProperties} aria-hidden="true">
    <div className="deco-sky-wash" />
    <svg className="deco-city-art" viewBox="0 0 1440 680" fill="none">
      <defs>
        <linearGradient id="deco-building" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--deco-building-top)" /><stop offset="1" stopColor="var(--deco-building-bottom)" /></linearGradient>
        <pattern id="deco-windows" width="17" height="25" patternUnits="userSpaceOnUse"><rect x="6" y="7" width="4" height="13" rx=".5" fill="var(--deco-window)" /></pattern>
        <linearGradient id="deco-ground" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--deco-ground-top)" /><stop offset="1" stopColor="var(--deco-paper)" /></linearGradient>
      </defs>
      <g className="deco-sun-rays" stroke="var(--deco-gold)" strokeWidth=".65" opacity=".17">
        {Array.from({length:19},(_,i)=>{const a=(-174+i*9.3)*Math.PI/180;return <path key={i} d={`M${720+Math.cos(a)*142} ${280+Math.sin(a)*142}L${720+Math.cos(a)*630} ${280+Math.sin(a)*630}`} />})}
      </g>
      <circle cx="720" cy="265" r="134" fill="var(--deco-sun)" opacity={night ? .68 : .45} />
      <circle cx="720" cy="265" r="146" stroke="var(--deco-gold)" strokeWidth=".8" opacity=".35" />
      {night && <circle cx="770" cy="225" r="115" fill="var(--deco-sky)" />}
      <g fill="var(--deco-distance)" opacity=".55">
        {Array.from({length:24},(_,i)=>{const h=60+(i*47)%150;return <path key={i} d={`M${i*64-30} 605v-${h}h14v-18h29v18h19v${h}Z`} />})}
      </g>
      <g className="deco-city-buildings">
        {Array.from({length:buildings},(_,i)=>{
          const x=i*1440/buildings+6, width=1440/buildings*.73, h=90+(i*61)%165;
          return <g key={i}><path d={`M${x} 608v-${h}h${width*.14}v-15h${width*.72}v15h${width*.14}v${h}Z`} fill="url(#deco-building)" stroke="var(--deco-stone-line)" strokeWidth="1" /><rect x={x+7} y={608-h+15} width={width-14} height={h-15} fill="url(#deco-windows)" className="deco-window-grid" /><path d={`M${x+width*.3} ${608-h}v${h}m${width*.4}-${h}v${h}`} stroke="var(--deco-gold)" strokeOpacity=".3" /></g>;
        })}
      </g>
      <g className="deco-landmark deco-landmark-left" onClick={onIlluminate}>
        <path d="M335 608V360h18v-45h16v-45h19v-46h17v46h19v45h16v45h18v248Z" fill="url(#deco-building)" stroke="var(--deco-gold)" strokeWidth="1.2" />
        <path d="M350 365h93v243h-93Z" fill="url(#deco-windows)" className="deco-window-grid" />
        {[0,1,2,3].map(i=><path key={i} d={`M${358+i*6} ${355-i*22}Q396 ${300-i*23} ${434-i*6} ${355-i*22}`} stroke="var(--deco-gold)" strokeWidth="1.4" />)}
        <path d="M396 224v-60M385 608V362m22 246V362" stroke="var(--deco-gold)" strokeWidth="1.5" />
      </g>
      <g className="deco-landmark deco-landmark-center" onClick={onIlluminate}>
        <path d="M626 608V368h23v-65h20v-43h20v-49h17v-37h29v37h17v49h20v43h20v65h23v240Z" fill="url(#deco-building)" stroke="var(--deco-gold)" strokeWidth="1.3" />
        <path d="M720 174V97" stroke="var(--deco-gold)" strokeWidth="2" />
        <path d="M640 382h160v226H640Z" fill="url(#deco-windows)" className="deco-window-grid" />
        <path d="M665 316h110v292H665Z" fill="url(#deco-windows)" className="deco-window-grid" />
        {[690,705,720,735,750].map(x=><path key={x} d={`M${x} 279v329`} stroke="var(--deco-gold)" strokeWidth={x===720?2:1} strokeOpacity=".6" />)}
        <path d="M682 266h76M663 309h114M642 374h156" stroke="var(--deco-gold)" strokeWidth="2" />
        <path d="M699 608v-47a21 21 0 0 1 42 0v47" stroke="var(--deco-gold)" fill="var(--deco-deep)" />
      </g>
      <g className="deco-landmark deco-landmark-right" onClick={onIlluminate}>
        <path d="M993 608V365h18v-40h18v-38h20v-43h19v43h20v38h18v40h18v243Z" fill="url(#deco-building)" stroke="var(--deco-gold)" strokeWidth="1.2" />
        <rect x="1006" y="380" width="105" height="228" fill="url(#deco-windows)" className="deco-window-grid" />
        <path d="M1058 244v-65M1041 608V343m34 265V343M1024 365h69" stroke="var(--deco-gold)" strokeWidth="1.3" />
        <path d="m1034 325 24-35 24 35Z" stroke="var(--deco-gold)" />
      </g>
      <path d="M0 606h1440v74H0Z" fill="url(#deco-ground)" />
      <path d="M0 607h1440M0 616h1440" stroke="var(--deco-gold)" strokeOpacity=".35" />
      <path d="M0 653q360-55 720 0t720 0" stroke="var(--deco-gold)" strokeOpacity=".12" />
    </svg>
  </div>;
}
