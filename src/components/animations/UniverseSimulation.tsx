import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generate a universe simulation
function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 50,000 points
  const pointsCount = 50000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    const colorInside = new THREE.Color('#ea0000'); // Red
    const colorOutside = new THREE.Color('#1a1a1a'); // Dark grey

    for (let i = 0; i < pointsCount; i++) {
      const i3 = i * 3;
      
      // Geometry - Spiral galaxy distribution
      const radius = Math.random() * 20;
      const spinAngle = radius * 0.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2; // 3 galaxy arms
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Colors - Gradient based on radius
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 20);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return [positions, colors];
  }, [pointsCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05;
      // Slight parallax based on mouse
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      
      pointsRef.current.rotation.x += (mouseY - pointsRef.current.rotation.x) * 0.02;
      pointsRef.current.rotation.z += (mouseX - pointsRef.current.rotation.z) * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function UniverseSimulation() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
        <color attach="scene.background" args={['#000']} />
        <fog attach="fog" args={['#000', 10, 25]} />
        <ambientLight intensity={0.5} />
        <Galaxy />
      </Canvas>
    </div>
  );
}
