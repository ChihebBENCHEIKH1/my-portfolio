import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 400;
const GRID_COUNT = 100;

export function ParticleField() {
  const rainRef = useRef<THREE.Points>(null!);
  const gridRef = useRef<THREE.Points>(null!);

  // Data rain particles
  const rainGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      vel[i] = 0.008 + Math.random() * 0.025;

      const r = Math.random();
      if (r < 0.6) {
        col[i * 3] = 0.0; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1.0;
      } else if (r < 0.88) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.0; col[i * 3 + 2] = 0.5;
      } else {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.72; col[i * 3 + 2] = 0.0;
      }
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    (g as any)._vel = vel;
    return g;
  }, []);

  // Floating grid dots — static ambient layer
  const gridGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(GRID_COUNT * 3);
    const col = new Float32Array(GRID_COUNT * 3);
    for (let i = 0; i < GRID_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -10 - Math.random() * 20;
      col[i * 3] = 0.0; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1.0;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const vel = (rainRef.current.geometry as any)._vel as Float32Array;
      const arr = positions.array as Float32Array;

      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] -= vel[i];
        if (arr[i * 3 + 1] < -12.5) {
          arr[i * 3 + 1] = 12.5;
          arr[i * 3] = (Math.random() - 0.5) * 25;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 25;
        }
      }
      positions.needsUpdate = true;
      rainRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }

    if (gridRef.current) {
      gridRef.current.rotation.y = clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <>
      {/* Data rain */}
      <points ref={rainRef} geometry={rainGeo}>
        <pointsMaterial size={0.02} vertexColors transparent opacity={0.4} sizeAttenuation depthWrite={false} />
      </points>
      {/* Ambient grid dots */}
      <points ref={gridRef} geometry={gridGeo}>
        <pointsMaterial size={0.015} vertexColors transparent opacity={0.12} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}
