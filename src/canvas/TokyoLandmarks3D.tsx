import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useSceneStore } from "../store/sceneStore";

type Point = [number, number, number];
type Beam = [Point, Point, number];

function useLightPulse(pulse: number) {
  const group = useRef<THREE.Group>(null);
  const energy = useRef(0);
  const materials = useRef<{ material: THREE.MeshStandardMaterial; base: number }[]>([]);
  const beams = useRef<THREE.MeshBasicMaterial[]>([]);
  const { invalidate } = useThree();
  useEffect(() => {
    if (!pulse || !group.current) return;
    energy.current = 1;
    materials.current = [];
    beams.current = [];
    group.current.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach(material => {
        if (material.userData.pulseBeam) beams.current.push(material as THREE.MeshBasicMaterial);
        else if (material instanceof THREE.MeshStandardMaterial) {
          material.userData.baseGlow ??= material.emissiveIntensity;
          materials.current.push({ material, base: material.userData.baseGlow });
        }
      });
    });
    invalidate();
  }, [pulse, invalidate]);
  useFrame((_, delta) => {
    if (energy.current <= 0) return;
    energy.current *= Math.exp(-2.2 * Math.min(delta, .1));
    if (energy.current < .006) energy.current = 0;
    materials.current.forEach(({material,base}) => { material.emissiveIntensity = base * (1 + energy.current * 2.2); });
    beams.current.forEach(material => { material.opacity = energy.current * .13; });
    if (energy.current > 0) invalidate();
  });
  return group;
}

function Lattice({ beams, color, glow = .45, emission = color }: { beams: Beam[]; color: string; glow?: number; emission?: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0,1,0), scale = new THREE.Vector3();
    beams.forEach(([start, end, radius], i) => {
      const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
      const direction = b.clone().sub(a);
      quaternion.setFromUnitVectors(up, direction.clone().normalize());
      scale.set(radius, direction.length(), radius);
      matrix.compose(a.add(b).multiplyScalar(.5), quaternion, scale);
      mesh.current!.setMatrixAt(i, matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [beams]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, beams.length]}>
    <cylinderGeometry args={[1,1,1,6]} />
    <meshStandardMaterial color={color} emissive={emission} emissiveIntensity={glow} metalness={.65} roughness={.32} />
  </instancedMesh>;
}

function Deck({ y, width, height, color, windows }: { y: number; width: number; height: number; color: string; windows: THREE.Texture }) {
  return <group position={[0,y,0]}>
    <mesh><boxGeometry args={[width,height,width]} /><meshStandardMaterial map={windows} emissiveMap={windows} emissive={color} emissiveIntensity={1.1} metalness={.5} roughness={.2} /></mesh>
    {[-1,1].map(side => <mesh key={side} position={[0,side * height/2,0]}><boxGeometry args={[width * 1.08,.055,width * 1.08]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={.6} roughness={.2} /></mesh>)}
  </group>;
}

export function TokyoTower3D({ height, windows }: { height: number; windows: THREE.Texture }) {
  const pulse = useSceneStore(s => s.tokyoPulse);
  const boost = useSceneStore(s => s.activateTokyo);
  const group = useLightPulse(pulse);
  const beams = useMemo(() => {
    const list: Beam[] = [];
    const levels = [[0,1.25],[.8,.91],[1.6,.68],[2.4,.51],[3.2,.40],[4,.32],[4.8,.25],[5.6,.19],[6.4,.15],[7.2,.11],[7.8,.085]];
    const corners = (y: number, r: number): Point[] => [[-r,y,-r],[r,y,-r],[r,y,r],[-r,y,r]];
    for(let tier=0;tier<levels.length-1;tier++) {
      const bottom=corners(...levels[tier] as [number,number]), top=corners(...levels[tier+1] as [number,number]);
      for(let side=0;side<4;side++) {
        const next=(side+1)%4;
        list.push([bottom[side],top[side],.023], [bottom[side],bottom[next],.012]);
        list.push([bottom[side],top[next],.009],[bottom[next],top[side],.009]);
      }
    }
    // Four curved arches between the feet, forming the real open base.
    for(let side=0;side<4;side++) {
      const rotate=(x:number,y:number):Point=>[x*Math.cos(side*Math.PI/2)-1.04*Math.sin(side*Math.PI/2),y,x*Math.sin(side*Math.PI/2)+1.04*Math.cos(side*Math.PI/2)];
      for(let step=0;step<16;step++) {
        const point=(t:number)=>rotate((t-.5)*2.2, .12+Math.sin(t*Math.PI)*1.15);
        list.push([point(step/16),point((step+1)/16),.025]);
      }
    }
    return list;
  },[]);
  return <group ref={group} scale={height/10} rotation={[0,.30,0]} onClick={event => { event.stopPropagation(); boost(); }}>
    <mesh position={[0,5.5,0]}><boxGeometry args={[1.7,8.8,1.7]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    <mesh position={[0,8,0]}><cylinderGeometry args={[1.5,.12,5,24,1,true]} /><meshBasicMaterial color="#ff69b5" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} userData={{pulseBeam:true}} /></mesh>
    <Lattice beams={beams} color="#ae5264" emission="#ff6f8f" glow={.65} />
    <mesh rotation={[Math.PI/2,0,0]} position={[0,4.45,0]}><torusGeometry args={[.84,.014,6,48]} /><meshBasicMaterial color={[1.9,.12,.65]} transparent opacity={.7} toneMapped={false} /></mesh>
    <Deck y={4.1} width={1.03} height={.33} color="#ff6e9d" windows={windows} />
    <Deck y={7.2} width={.36} height={.23} color="#ffe8bb" windows={windows} />
    <mesh position={[0,7.65,0]}><cylinderGeometry args={[.07,.11,.6,8]} /><meshStandardMaterial color="#ffddbb" emissive="#ff7e42" emissiveIntensity={.7} /></mesh>
    {Array.from({length:9},(_,i)=><mesh key={i} position={[0,7.9+i*.225,0]}>
      <cylinderGeometry args={[.055-i*.005,.06-i*.005,.225,8]} />
      <meshStandardMaterial color={i%2 ? "#ffbd7c" : "#ffeddb"} emissive={i%2 ? "#ff903f" : "#ffd4b5"} emissiveIntensity={1} />
    </mesh>)}
    <mesh position={[0,9.97,0]}><sphereGeometry args={[.03,8,8]} /><meshBasicMaterial color={[3,1.2,.5]} toneMapped={false} /></mesh>
    <pointLight position={[0,3,2]} color="#ff943b" intensity={8} distance={7} decay={2} />
  </group>;
}

function SkyDeck({ y, radius, color, windows }: { y:number; radius:number; color:string; windows:THREE.Texture }) {
  return <group position={[0,y,0]}>
    <mesh><cylinderGeometry args={[radius,radius*.72,.32,32]} /><meshStandardMaterial map={windows} emissiveMap={windows} emissive={color} emissiveIntensity={1.2} color="#507d9c" metalness={.65} roughness={.18} /></mesh>
    <mesh position={[0,-.23,0]}><cylinderGeometry args={[radius*.72,radius*.35,.15,16]} /><meshStandardMaterial color="#81a7c2" emissive={color} emissiveIntensity={.45} metalness={.75} roughness={.3} /></mesh>
    {[-.15,.02,.16].map(y=><mesh key={y} rotation={[Math.PI/2,0,0]} position={[0,y,0]}><torusGeometry args={[radius*(y<0?.73:y>.1?1:.92),.015,6,32]} /><meshStandardMaterial color="#54d5f0" emissive={color} emissiveIntensity={1.8} /></mesh>)}
    <mesh position={[0,.2,0]}><cylinderGeometry args={[radius*.8,radius,.07,32]} /><meshStandardMaterial color="#3a627d" metalness={.8} roughness={.2} /></mesh>
  </group>;
}

export function Skytree3D({ height, windows, color }: { height:number; windows:THREE.Texture; color:string }) {
  const pulse = useSceneStore(s => s.skytreePulse);
  const boost = useSceneStore(s => s.activateSkytree);
  const group = useLightPulse(pulse);
  const beams=useMemo(()=>{
    const list:Beam[]=[];
    const ring=(tier:number):Point[]=>{
      const y=tier*.30, r=.14+Math.pow(1-tier/30,1.7)*.45;
      return Array.from({length:6},(_,i)=>{
        const a=i*Math.PI/3 + .13*tier/30;
        const radius=r*(i%2===0?1:.72+.28*tier/30);
        return [Math.cos(a)*radius,y,Math.sin(a)*radius];
      });
    };
    for(let tier=0;tier<30;tier++){
      const bottom=ring(tier),top=ring(tier+1);
      for(let i=0;i<6;i++)list.push([bottom[i],top[i],.013],[bottom[i],top[(i+1)%6],.006],[bottom[i],bottom[(i+1)%6],.007]);
    }
    return list;
  },[]);
  return <group ref={group} scale={height/12} rotation={[0,.3,0]} onClick={event => { event.stopPropagation(); boost(); }}>
    <mesh position={[0,7,0]}><boxGeometry args={[1.4,10,1.4]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    <mesh position={[0,10.5,0]}><cylinderGeometry args={[1.7,.12,5,24,1,true]} /><meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} userData={{pulseBeam:true}} /></mesh>
    <Lattice beams={beams} color="#537c92" emission="#39c6ef" glow={.42} />
    <mesh position={[0,4.5,0]}><cylinderGeometry args={[.065,.13,9,12]} /><meshStandardMaterial color="#45728d" emissive={color} emissiveIntensity={.5} metalness={.7} roughness={.35} /></mesh>
    <SkyDeck y={6.5} radius={.67} color={color} windows={windows} />
    <mesh rotation={[Math.PI/2,0,0]} position={[0,6.94,0]}><torusGeometry args={[.83,.012,6,48]} /><meshBasicMaterial color={[.9,.15,2]} transparent opacity={.65} toneMapped={false} /></mesh>
    <SkyDeck y={8.4} radius={.43} color={color} windows={windows} />
    <mesh position={[0,10.15,0]}><cylinderGeometry args={[.04,.105,2.3,12]} /><meshStandardMaterial color="#5c7c9c" emissive={color} emissiveIntensity={.22} metalness={.8} roughness={.2} /></mesh>
    {Array.from({length:14},(_,i)=><mesh key={i} position={[0,9+i*.16,0]}><cylinderGeometry args={[.11-i*.004,.11-i*.004,.03,12]} /><meshStandardMaterial color="#dfedfa" emissive={color} emissiveIntensity={1} /></mesh>)}
    <mesh position={[0,11.6,0]}><cylinderGeometry args={[.008,.035,.8,8]} /><meshStandardMaterial color="#e3edf9" emissive={color} emissiveIntensity={1} /></mesh>
    <mesh position={[0,12,0]}><sphereGeometry args={[.026,8,8]} /><meshBasicMaterial color={[2,.25,.4]} toneMapped={false} /></mesh>
    <pointLight position={[.5,6.8,1]} color={color} intensity={4} distance={4} />
  </group>;
}
