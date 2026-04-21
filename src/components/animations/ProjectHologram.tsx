import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function HologramShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <MeshDistortMaterial
        color="#aa0000"
        wireframe={true}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export function ProjectHologram({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full bg-[#050505] relative overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#ff0000" intensity={2} />
        <HologramShape />
      </Canvas>
      {/* Scanline overlay running across holographic projections */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] [background-size:100%_4px] z-10" />
    </div>
  );
}
