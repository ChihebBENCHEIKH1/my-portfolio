import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSceneStore } from "../store/sceneStore";
import * as THREE from "three";

export function Icosphere() {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  const { mouseX, mouseY } = useSceneStore();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.3, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.2, 0.03);
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.rotation.z = t * 0.15;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.08;
      outerRef.current.rotation.x = t * 0.05;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.12;
      ring1Ref.current.rotation.x = Math.PI / 3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.09;
      ring2Ref.current.rotation.x = Math.PI / 2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.07;
      ring3Ref.current.rotation.x = Math.PI / 4;
    }
  });

  return (
    <group ref={groupRef} position={[3.2, 0.3, -4]}>
      {/* Inner core — octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
      </mesh>

      {/* Outer cage — icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.006, 3, 64]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.18} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.2, 0.004, 3, 48]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.2, 0.003, 3, 48]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
