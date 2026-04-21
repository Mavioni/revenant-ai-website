import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

function HologramShape({ seed = '' }: { seed?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Deterministically select a geometry based on the string seed length / char properties
  const shapeIndex = seed ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5 : 0;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      {shapeIndex === 0 && <icosahedronGeometry args={[2, 0]} />}
      {shapeIndex === 1 && <octahedronGeometry args={[2, 0]} />}
      {shapeIndex === 2 && <dodecahedronGeometry args={[1.8, 0]} />}
      {shapeIndex === 3 && <tetrahedronGeometry args={[2, 0]} />}
      {shapeIndex === 4 && <torusKnotGeometry args={[1.2, 0.4, 64, 8]} />}
      
      {/* Invisible material so only Edges show */}
      <meshBasicMaterial color="#000000" transparent opacity={0.1} />
      <Edges 
        linewidth={2} 
        color="#E53935" 
      />
    </mesh>
  );
}

export function ProjectHologram({ className = '', seed = '' }: { className?: string, seed?: string }) {
  return (
    <div className={`w-full h-full bg-[#050505] relative overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#ff0000" intensity={2} />
        <HologramShape seed={seed} />
      </Canvas>
      {/* Scanline overlay running across holographic projections */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] [background-size:100%_4px] z-10" />
    </div>
  );
}
