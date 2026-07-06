import{r as i,j as o}from"./vendor-framer-CJbIYUz4.js";import{B as j,b as m,u as b,V as R,A as T,C as z,E,d as G,P as S}from"./vendor-three-CV0hEVtH.js";import{u as F}from"./index-D2yujjzR.js";const v=400,M=100;function C(){const s=i.useRef(null),d=i.useRef(null),u=i.useMemo(()=>{const a=new j,r=new Float32Array(v*3),t=new Float32Array(v*3),n=new Float32Array(v);for(let e=0;e<v;e++){r[e*3]=(Math.random()-.5)*25,r[e*3+1]=(Math.random()-.5)*25,r[e*3+2]=(Math.random()-.5)*25,n[e]=.008+Math.random()*.025;const p=Math.random();p<.6?(t[e*3]=0,t[e*3+1]=.94,t[e*3+2]=1):p<.88?(t[e*3]=1,t[e*3+1]=0,t[e*3+2]=.5):(t[e*3]=1,t[e*3+1]=.72,t[e*3+2]=0)}return a.setAttribute("position",new m(r,3)),a.setAttribute("color",new m(t,3)),a._vel=n,a},[]),h=i.useMemo(()=>{const a=new j,r=new Float32Array(M*3),t=new Float32Array(M*3);for(let n=0;n<M;n++)r[n*3]=(Math.random()-.5)*40,r[n*3+1]=(Math.random()-.5)*40,r[n*3+2]=-10-Math.random()*20,t[n*3]=0,t[n*3+1]=.94,t[n*3+2]=1;return a.setAttribute("position",new m(r,3)),a.setAttribute("color",new m(t,3)),a},[]);return b(({clock:a})=>{if(s.current){const r=s.current.geometry.attributes.position,t=s.current.geometry._vel,n=r.array;for(let e=0;e<v;e++)n[e*3+1]-=t[e],n[e*3+1]<-12.5&&(n[e*3+1]=12.5,n[e*3]=(Math.random()-.5)*25,n[e*3+2]=(Math.random()-.5)*25);r.needsUpdate=!0,s.current.rotation.y=a.getElapsedTime()*.005}d.current&&(d.current.rotation.y=a.getElapsedTime()*.002)}),o.jsxs(o.Fragment,{children:[o.jsx("points",{ref:s,geometry:u,children:o.jsx("pointsMaterial",{size:.02,vertexColors:!0,transparent:!0,opacity:.4,sizeAttenuation:!0,depthWrite:!1})}),o.jsx("points",{ref:d,geometry:h,children:o.jsx("pointsMaterial",{size:.015,vertexColors:!0,transparent:!0,opacity:.12,sizeAttenuation:!0,depthWrite:!1})})]})}function O(){const s=i.useRef(null),d=i.useRef(null),u=i.useRef(new R(0,0)),h=typeof window<"u"&&window.innerWidth<768,a=h?70:130,r=h?42:76,t=i.useMemo(()=>{const g=a*r,f=new Float32Array(g*3),l=new Float32Array(g);let c=0;for(let w=0;w<r;w++)for(let x=0;x<a;x++)f[c*3]=(x/(a-1)-.5)*17,f[c*3+1]=(w/(r-1)-.5)*10.5,f[c*3+2]=0,l[c]=Math.random(),c++;const y=new j;return y.setAttribute("position",new m(f,3)),y.setAttribute("aRnd",new m(l,1)),y},[a,r]),n=i.useMemo(()=>({uTime:{value:0},uMouse:{value:new R(0,0)},uOpacity:{value:0}}),[]);return b(({clock:e})=>{const{mouseX:p,mouseY:g,activeSection:f}=F.getState();u.current.x+=(p*6.8-u.current.x)*.09,u.current.y+=(g*3.9-u.current.y)*.09;const l=d.current;if(l){l.uniforms.uTime.value=e.getElapsedTime(),l.uniforms.uMouse.value.copy(u.current);const c=f==="hero"?1:0;l.uniforms.uOpacity.value+=(c-l.uniforms.uOpacity.value)*.05}s.current&&(s.current.rotation.z=Math.sin(e.getElapsedTime()*.05)*.03)}),o.jsx("points",{ref:s,geometry:t,position:[0,.3,-.5],children:o.jsx("shaderMaterial",{ref:d,uniforms:n,transparent:!0,depthWrite:!1,blending:T,vertexShader:`
          uniform float uTime;
          uniform vec2 uMouse;
          attribute float aRnd;
          varying float vGlow;
          varying float vRnd;
          void main() {
            vec3 p = position;
            // ambient undulation
            float w = sin(p.x * 0.33 + uTime * 0.55) * cos(p.y * 0.42 + uTime * 0.5);
            p.z += w * 0.45;
            p.z += sin((p.x + p.y) * 0.6 + uTime) * 0.1;
            // cursor ripple — tight gaussian bulge toward camera + slight outward push
            vec2 d = p.xy - uMouse;
            float dist2 = dot(d, d);
            float infl = exp(-dist2 * 0.13);
            p.z += infl * 2.0;
            p.xy += normalize(d + 1e-4) * infl * 0.35;
            vGlow = infl;
            vRnd = aRnd;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float atten = 300.0 / -mv.z;
            gl_PointSize = (0.045 + infl * 0.20 + aRnd * 0.03) * atten;
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          precision highp float;
          uniform float uOpacity;
          varying float vGlow;
          varying float vRnd;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.0, d);
            vec3 cyan  = vec3(0.0, 0.94, 1.0);
            vec3 pink  = vec3(1.0, 0.0, 0.5);
            vec3 amber = vec3(1.0, 0.72, 0.0);
            vec3 col = mix(cyan, pink, clamp(vGlow * 1.6 - 0.25, 0.0, 1.0));
            col = mix(col, amber, step(0.95, vRnd) * 0.7);
            float a = soft * uOpacity * (0.16 + vGlow * 0.95 + vRnd * 0.10);
            gl_FragColor = vec4(col, a);
          }
        `})})}var A;const P=typeof window<"u"&&((A=window.matchMedia)==null?void 0:A.call(window,"(prefers-reduced-motion: reduce)").matches);function _(){return F(),o.jsxs(o.Fragment,{children:[!P&&o.jsx(O,{}),o.jsx(C,{}),o.jsx(E,{multisampling:0,children:o.jsx(G,{intensity:1.2,luminanceThreshold:.2,luminanceSmoothing:.9})}),o.jsx(S,{all:!0})]})}function D(){return o.jsx(z,{camera:{position:[0,0,6],fov:60},dpr:[1,1],style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},children:o.jsx(i.Suspense,{fallback:null,children:o.jsx(_,{})})})}export{D as SceneManager};
