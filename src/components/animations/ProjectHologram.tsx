import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

// 1. RONIN OS — The Gyroscope (Concentric rings spinning fast)
function RoninGyroscope() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1.current && ring2.current && ring3.current) {
      ring1.current.rotation.x = state.clock.elapsedTime * 1.2;
      ring2.current.rotation.y = state.clock.elapsedTime * 1.5;
      ring3.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={ring1}><torusGeometry args={[1.8, 0.05, 16, 64]} /><meshBasicMaterial color="#000" transparent opacity={0} /><Edges linewidth={2} color="#ffffff" /></mesh>
      <mesh ref={ring2}><torusGeometry args={[1.4, 0.05, 16, 64]} /><meshBasicMaterial color="#000" transparent opacity={0} /><Edges linewidth={2} color="#ffffff" /></mesh>
      <mesh ref={ring3}><torusGeometry args={[1.0, 0.05, 16, 64]} /><meshBasicMaterial color="#000" transparent opacity={0} /><Edges linewidth={2} color="#ffffff" /></mesh>
    </group>
  );
}

// 2. Parakeet Code — The Glitch Box (Jittering, agentic API scale)
function ParakeetGlitchBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Glitchy erratic scaling based on high-frequency sine
      const scale = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
      
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />
      <meshBasicMaterial color="#000" transparent opacity={0.3} />
      <Edges linewidth={3} color="#32CD32" />
    </mesh>
  );
}

// 3. Breeze OS — The Shield (Rigid 90-degree snap rotations)
function BreezeShield() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (meshRef.current) {
      // Snap rotation every 1.5 seconds
      const snapInterval = 1.5;
      const step = Math.floor(state.clock.elapsedTime / snapInterval);
      
      // Calculate strict 90-degree orthogonal target rotations
      targetRotation.current.x = (step % 4) * (Math.PI / 2);
      targetRotation.current.y = Math.floor(step / 2) * (Math.PI / 2);

      // Lerp quickly to target for a "snap" feel
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.15);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.15);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 0]} />
      <meshBasicMaterial color="#000" transparent opacity={0.6} />
      <Edges linewidth={2} color="#00E5FF" />
    </mesh>
  );
}

// 4. Kilter — The Stack (Breathing ledgers oscillating)
function KilterStack() {
  const stackGroup = useRef<THREE.Group>(null);
  const p1 = useRef<THREE.Mesh>(null);
  const p2 = useRef<THREE.Mesh>(null);
  const p3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (stackGroup.current) {
      stackGroup.current.rotation.y = state.clock.elapsedTime * 0.2;
      stackGroup.current.rotation.x = Math.PI / 6; // slightly tilted down
    }
    const t = state.clock.elapsedTime * 2;
    if (p1.current) p1.current.position.y = 1.2 + Math.sin(t) * 0.2;
    if (p2.current) p2.current.position.y = 0 + Math.sin(t + 2) * 0.2;
    if (p3.current) p3.current.position.y = -1.2 + Math.sin(t + 4) * 0.2;
  });

  return (
    <group ref={stackGroup}>
      <mesh ref={p1}><boxGeometry args={[2.5, 0.1, 2.5]} /><meshBasicMaterial color="#000" transparent opacity={0.4} /><Edges linewidth={2} color="#FFB300" /></mesh>
      <mesh ref={p2}><boxGeometry args={[2.5, 0.1, 2.5]} /><meshBasicMaterial color="#000" transparent opacity={0.4} /><Edges linewidth={2} color="#FFB300" /></mesh>
      <mesh ref={p3}><boxGeometry args={[2.5, 0.1, 2.5]} /><meshBasicMaterial color="#000" transparent opacity={0.4} /><Edges linewidth={2} color="#FFB300" /></mesh>
    </group>
  );
}

// 5. Engram — The Helix (Complex, slow-breathing topological map)
function EngramHelix() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      const breath = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.set(breath, breath, breath);
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.4, 0.3, 100, 16]} />
      <meshBasicMaterial color="#000" transparent opacity={0.5} />
      <Edges linewidth={1} color="#D500F9" />
    </mesh>
  );
}

// Fallback generic shape
function GenericShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[2, 0]} />
      <meshBasicMaterial color="#000" transparent opacity={0.1} />
      <Edges linewidth={2} color="#E53935" />
    </mesh>
  );
}


// Router Component
export function ProjectHologram({ className = '', seed = '' }: { className?: string, seed?: string }) {
  return (
    <div className={`w-full h-full bg-[#050505] relative overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {seed === 'ronin-os' && <RoninGyroscope />}
        {seed === 'parakeet-code' && <ParakeetGlitchBox />}
        {seed === 'breeze-os' && <BreezeShield />}
        {seed === 'kilter' && <KilterStack />}
        {seed === 'engram' && <EngramHelix />}
        {![ 'ronin-os', 'parakeet-code', 'breeze-os', 'kilter', 'engram'].includes(seed) && <GenericShape />}
      </Canvas>
      {/* Scanline overlay running across holographic projections */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] [background-size:100%_4px] z-10" />
    </div>
  );
}
