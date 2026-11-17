import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { getCityBuildings, getCityProfile } from "./cityModel";
import { TokyoTower3D, Skytree3D } from "./TokyoLandmarks3D";
import { useSceneStore } from "../store/sceneStore";

const ACCENTS = ["#72e3ff", "#e58dbd", "#ffd596"];

/** One reusable, deterministic facade per district, including warm occupied windows. */
function facadeTexture(index: number, day = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = day ? ["#4c657e", "#665a78", "#697079"][index] : ["#101c32", "#21162b", "#1c202a"][index];
  ctx.fillRect(0,0,128,256);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 8; x++) {
      const occupied = (x * 31 + y * 17 + index * 13) % 11 > 3;
      const color = day ? "#8db0c9" : (x + y * 3) % 5 < 2 ? "#d1b28a" : ["#6babc1", "#b382a9", "#bda27d"][index];
      ctx.fillStyle = occupied ? color : "#263347";
      ctx.shadowColor = occupied ? color : "transparent";
      ctx.shadowBlur = occupied ? 5 : 0;
      ctx.globalAlpha = occupied ? .4 + ((x + y) % 3) * .15 : .5;
      ctx.fillRect(4 + x * 16, 4 + y * 16, 7, 9);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#090e1a";
      ctx.fillRect(4 + x * 16, 9 + y * 16, 7, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}

function Buildings({ active }: { active: boolean }) {
  const { size, camera, invalidate } = useThree();
  const interactive = useSceneStore(s => s.interactive);
  const daylight = useSceneStore(s => s.daylight);
  const count = useSceneStore(s => s.buildingCount);
  const lightLevel = useSceneStore(s => s.lightLevel);
  const day = daylight;
  const profile = getCityProfile(size.width);
  const buildings = useMemo(() => getCityBuildings(count, profile.widthScale), [count, profile.widthScale]);
  const textures = useMemo(() => [0,1,2].map(index => facadeTexture(index, day)), [day]);
  const decks = useMemo(() => ["#ff83bb", "#69dbff"].map(color => {
    const canvas = document.createElement("canvas"); canvas.width = 128; canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#071522"; ctx.fillRect(0,0,128,32);
    for(let x=0;x<128;x+=8){ ctx.fillStyle = color; ctx.fillRect(x+2,6,3,20); }
    ctx.fillStyle = "#172a3a"; ctx.fillRect(0,15,128,2);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }), []);
  const mouse = useRef({ x: 0, y: 0 });
  const hoveredJobIndex = useSceneStore(s => s.hoveredJobIndex);
  const towerColor = ["#55dfff", "#cb8bff", "#ffbc76", "#ff62b3"][hoveredJobIndex ?? 0];
  const worldWidth = 40;
  const worldHeight = worldWidth * size.height / size.width;
  const tokyoHeight = Math.min(worldHeight * .82, !interactive && profile.compact ? worldWidth * 1.08 : Infinity);
  const skytreeHeight = Math.min(worldHeight * .98, !interactive && profile.compact ? worldWidth * 1.32 : Infinity);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const reduced = useReducedMotion();

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = size.width / worldWidth;
    ortho.updateProjectionMatrix();
    camera.lookAt(cameraTarget);
    invalidate();
  }, [camera, cameraTarget, size.width, invalidate]);

  useEffect(() => {
    if (!active || reduced) return;
    return useSceneStore.subscribe(state => {
      if (mouse.current.x === state.mouseX && mouse.current.y === state.mouseY) return;
      mouse.current = { x: state.mouseX, y: state.mouseY };
      invalidate();
    });
  }, [active, reduced, invalidate]);

  useEffect(() => () => textures.forEach(texture => texture.dispose()), [textures]);
  useEffect(() => () => decks.forEach(texture => texture.dispose()), [decks]);
  // Render on pointer input, then stop once the camera settles. No idle WebGL loop.
  useFrame((_, delta) => {
    const x = reduced ? 1.4 : 1.4 + mouse.current.x * 1.4;
    const y = reduced ? 3 : 3 + mouse.current.y * .3;
    const blend = 1 - Math.exp(-4 * Math.min(delta, .1));
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, blend);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, blend);
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld();
    // Keep touch targets and fireworks aligned with the actual responsive 3D landmarks.
    for (const [name, x, height, z] of [["tokyo", -14, tokyoHeight, -2], ["skytree", 13.4, skytreeHeight, -3]] as const) {
      const target = document.querySelector<HTMLElement>(`.${name}-hit`);
      if (!target) continue;
      projected.set(x, -worldHeight / 2 - .6 + height, z).project(camera);
      const left = (projected.x + 1) / 2 * size.width;
      const top = (1 - projected.y) / 2 * size.height + innerHeight - size.height;
      projected.set(x, -worldHeight / 2 - .6, z).project(camera);
      const bottom = (1 - projected.y) / 2 * size.height + innerHeight - size.height;
      // These variables are consumed by one hit target, not the whole page.
      // Avoid invalidating inherited styles across every section on each frame.
      for (const [property, value] of [["x", left], ["top", top], ["height", bottom - top]] as const) {
        const key = `--${name}-${property}`;
        const next = `${value.toFixed(1)}px`;
        if (target.style.getPropertyValue(key) !== next) target.style.setProperty(key, next);
      }
    }
    if (Math.abs(camera.position.x - x) + Math.abs(camera.position.y - y) > .003) invalidate();
  });

  return <>
    <ambientLight intensity={day ? 2.5 : .8} color="#a4b8ec" />
    <directionalLight position={[-8,12,8]} intensity={day ? 3 : 1.2} color={day ? "#fff0d6" : "#89c9ed"} />
    <directionalLight position={[12,5,-5]} intensity={.8} color="#f294cd" />
    <group position={[0, -worldHeight / 2 - .6, 0]}>
      <group position={[-14,0,-2]} scale={[profile.towerWidthScale,1,profile.towerWidthScale]}><TokyoTower3D height={tokyoHeight} windows={decks[0]} /></group>
      <group position={[13.4,0,-3]} scale={[profile.towerWidthScale,1,profile.towerWidthScale]}><Skytree3D height={skytreeHeight} windows={decks[1]} color={towerColor} /></group>
      {buildings.map(({x,w,h,c}, i) => {
        const tone = c-1;
        const width = w * worldWidth / 100;
        const height = Math.min(h * worldHeight / 130, worldWidth * profile.maxBuildingRatio);
        const depth = .7 + (i % 3) * .35;
        return <group key={i} position={[(x + w/2) * worldWidth / 100 - worldWidth/2, 0, (i % 3) * .25]}>
          <mesh position={[0,height/2,0]}>
            <boxGeometry args={[width,height,depth]} />
            <meshStandardMaterial map={textures[tone]} emissiveMap={textures[tone]} emissive="#ffffff" emissiveIntensity={day ? .025 : .3 * lightLevel} metalness={.3} roughness={.55} />
          </mesh>
          <mesh position={[0,height + .03,0]}>
            <boxGeometry args={[width + .05,.07,depth + .04]} />
            <meshBasicMaterial color={ACCENTS[tone]} transparent opacity={.38} />
          </mesh>
          {i % 3 === 0 && <mesh position={[0,height + .16,0]}>
            <boxGeometry args={[width * .65,.25,depth * .8]} />
            <meshStandardMaterial color="#213047" metalness={.5} roughness={.4} />
          </mesh>}
          <mesh position={[-width/2 + .025,height/2,depth/2 + .006]}>
            <boxGeometry args={[.025,height,.016]} />
            <meshBasicMaterial color={ACCENTS[tone]} transparent opacity={.2} />
          </mesh>
        </group>;
      })}
    </group>
    <EffectComposer multisampling={0}>
      <Bloom intensity={.65} luminanceThreshold={1.1} luminanceSmoothing={.65} mipmapBlur />
    </EffectComposer>
  </>;
}

export function SceneManager({ active, onReady }: { active: boolean; onReady: () => void }) {
  const interactive = useSceneStore(s => s.interactive);
  return <Canvas
    orthographic
    frameloop="demand"
    camera={{ position: [1.4,3,28], near: .1, far: 80 }}
    dpr={1}
    gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
    style={{ position: "absolute", inset: 0, pointerEvents: interactive ? "auto" : "none" }}
    onCreated={onReady}
    fallback={null}
  ><Buildings active={active} /></Canvas>;
}
