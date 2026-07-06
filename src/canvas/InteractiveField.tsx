import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/sceneStore";

/**
 * GPU-driven neon point field. A plane of ~10k points undulates and ripples
 * toward the cursor (bulging + brightening + shifting cyan→pink), fed into the
 * scene's Bloom. All motion happens on the GPU via uniforms — no per-frame CPU
 * loops. Fades out when the hero isn't the active section.
 */
export function InteractiveField() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const small = typeof window !== "undefined" && window.innerWidth < 768;
  const GX = small ? 70 : 130;
  const GY = small ? 42 : 76;

  const geo = useMemo(() => {
    const W = 17, H = 10.5;
    const n = GX * GY;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    let k = 0;
    for (let j = 0; j < GY; j++) {
      for (let i = 0; i < GX; i++) {
        pos[k * 3] = (i / (GX - 1) - 0.5) * W;
        pos[k * 3 + 1] = (j / (GY - 1) - 0.5) * H;
        pos[k * 3 + 2] = 0;
        rnd[k] = Math.random();
        k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, [GX, GY]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uOpacity: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const { mouseX, mouseY, activeSection } = useSceneStore.getState();
    // map normalised cursor (-1..1) into the field plane, smoothed
    mouse.current.x += (mouseX * 6.8 - mouse.current.x) * 0.09;
    mouse.current.y += (mouseY * 3.9 - mouse.current.y) * 0.09;
    const m = matRef.current;
    if (m) {
      m.uniforms.uTime.value = clock.getElapsedTime();
      m.uniforms.uMouse.value.copy(mouse.current);
      const target = activeSection === "hero" ? 1 : 0;
      m.uniforms.uOpacity.value += (target - m.uniforms.uOpacity.value) * 0.05;
    }
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.03;
  });

  return (
    <points ref={ref} geometry={geo} position={[0, 0.3, -0.5]}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
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
        `}
        fragmentShader={`
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
        `}
      />
    </points>
  );
}
