import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * CinematicIntro — "The Trit Unfolds"
 *
 * A ~7-second React Three Fiber sequence that establishes Yunis AI's ternary
 * brand through geometry before handing off to the home page.
 *
 * Phase timings (seconds from mount):
 *   0.0 – 1.0  Black. Single red trit pulses at origin.
 *   1.0 – 2.5  Trit splits into 3 (thesis/antithesis/synthesis). Triangle forms.
 *   2.5 – 4.0  Triangle extrudes into a 5-petal Fibonacci lotus lattice
 *              (golden angle ≈ 137.5°) rotating slowly.
 *   4.0 – 5.5  Camera pulls back; "YUNIS" text fades in over the lattice.
 *   5.5 – 7.0  Lattice dissolves; overlay fades to transparent revealing site.
 *
 * Skip: click-anywhere, Skip button bottom-right, or Escape key.
 * Reduced motion: never mounted (App.tsx checks the media query).
 */

const TOTAL_DURATION = 7.0;
const PHASE_1_END = 1.0;
const PHASE_2_END = 2.5;
const PHASE_3_END = 4.0;
const PHASE_4_END = 5.5;

const HIGHLIGHT_HEX = "#ea0000";
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad (≈ 137.508°)

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [dismissed, setDismissed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Handle scene completion (either timer expiry or skip)
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setDismissed(true);
    // Fade overlay, then unmount via parent
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  // Skip via Escape / click-anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleComplete();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleComplete]);

  // Auto-complete after total duration
  useEffect(() => {
    const t = setTimeout(handleComplete, (TOTAL_DURATION + 0.3) * 1000);
    return () => clearTimeout(t);
  }, [handleComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-black cursor-pointer transition-opacity duration-[600ms] ease-out"
      onClick={handleComplete}
      role="presentation"
      aria-hidden={dismissed}
      style={{ opacity: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%", background: "#000" }}
      >
        <color attach="background" args={["#000000"]} />
        {/* Soft fill so the material edges feel dimensional even with basic mats */}
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 3]} intensity={0.6} color={HIGHLIGHT_HEX} />

        <Scene onTick={setElapsed} />
      </Canvas>

      {/* Skip button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleComplete();
        }}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10 text-white/50 hover:text-white text-body-sm uppercase tracking-[0.3em] px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-highlight rounded"
        aria-label="Skip intro"
      >
        Skip →
      </button>

      {/* Bottom progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full bg-highlight"
          style={{
            width: `${Math.min(100, (elapsed / TOTAL_DURATION) * 100)}%`,
            transition: "width 0.1s linear",
            boxShadow: `0 0 8px ${HIGHLIGHT_HEX}`,
          }}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Scene — the actual 3D content, driven by elapsed time
// ----------------------------------------------------------------------------

interface SceneProps {
  onTick: (t: number) => void;
}

function Scene({ onTick }: SceneProps) {
  const { camera } = useThree();
  const clockStartRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  // Central trit
  const trit0Ref = useRef<THREE.Mesh>(null);
  // Thesis / antithesis / synthesis
  const tritARef = useRef<THREE.Mesh>(null);
  const tritBRef = useRef<THREE.Mesh>(null);
  const tritCRef = useRef<THREE.Mesh>(null);

  // Lotus lattice root (rotates)
  const lotusGroupRef = useRef<THREE.Group>(null);

  // Text opacity is tracked as state because drei's Text takes a fillOpacity prop.
  // Throttled to ~10 Hz updates to avoid per-frame re-renders during the most
  // visually busy phase of the intro.
  const [textOpacity, setTextOpacity] = useState(0);
  const lastTextUpdateRef = useRef(0);

  // Triangle line vertices — updated at ~20 Hz while the trits are spreading,
  // then held static once the triangle has formed. Reviewer flagged that
  // updating this state every frame was a perf regression.
  const [triLine, setTriLine] = useState<Array<[number, number, number]>>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const lastTriUpdateRef = useRef(0);

  useFrame((_, dt) => {
    if (clockStartRef.current === null) {
      clockStartRef.current = 0;
    }
    elapsedRef.current += dt;
    const t = elapsedRef.current;
    onTick(t);

    // ----- Central trit pulse (always exists until phase 3) -----
    if (trit0Ref.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.12;
      if (t < PHASE_2_END) {
        trit0Ref.current.scale.setScalar(0.28 * pulse);
        trit0Ref.current.visible = true;
        // Central trit dims as triangle forms (phase 2)
        const mat = trit0Ref.current.material as THREE.MeshBasicMaterial;
        const phase2t = Math.max(0, (t - PHASE_1_END) / (PHASE_2_END - PHASE_1_END));
        mat.opacity = 1 - phase2t * 0.6;
      } else {
        trit0Ref.current.visible = false;
      }
    }

    // ----- Outer trits — appear in phase 1, spread into triangle -----
    const phase1t = clamp01((t - 0) / PHASE_1_END);
    const phase2t = clamp01((t - PHASE_1_END) / (PHASE_2_END - PHASE_1_END));
    const outerRadius = 0.9; // final triangle circumradius
    const outerScale = phase1t * 0.22;
    // Triangle vertex angles (top, bottom-left, bottom-right)
    const angles = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
    const refs = [tritARef, tritBRef, tritCRef];
    const positions: Array<[number, number, number]> = [];
    for (let i = 0; i < 3; i++) {
      const r = outerRadius * phase2t; // 0 at phase start, outerRadius at phase end
      const x = Math.cos(angles[i]) * r;
      const y = Math.sin(angles[i]) * r;
      positions.push([x, y, 0]);
      const ref = refs[i].current;
      if (ref) {
        ref.position.set(x, y, 0);
        const s = outerScale * (0.85 + 0.15 * Math.sin(t * 5 + i));
        ref.scale.setScalar(s);
        ref.visible = t > 0.15;
        // Fade outer trits after lotus takes over
        const mat = ref.material as THREE.MeshBasicMaterial;
        const fadeStart = PHASE_3_END;
        const fadeEnd = PHASE_4_END;
        const fadeT = clamp01((t - fadeStart) / (fadeEnd - fadeStart));
        mat.opacity = 1 - fadeT;
      }
    }

    // Update triangle line — throttled. Only fires while vertices are moving
    // (spread phase) or on a few final settle frames. ~20 Hz max.
    if (t > PHASE_1_END && t < PHASE_2_END + 0.3) {
      if (t - lastTriUpdateRef.current > 0.05) {
        lastTriUpdateRef.current = t;
        setTriLine([
          positions[0],
          positions[1],
          positions[2],
          positions[0], // close the triangle
        ]);
      }
    }

    // ----- Lotus lattice — emerges in phase 3, rotates -----
    if (lotusGroupRef.current) {
      const phase3Start = PHASE_2_END;
      const phase3t = clamp01((t - phase3Start) / (PHASE_3_END - phase3Start));
      lotusGroupRef.current.scale.setScalar(phase3t);
      lotusGroupRef.current.rotation.y = t * 0.4;
      lotusGroupRef.current.rotation.z = t * 0.15;

      // Dissolve in phase 5
      if (t > PHASE_4_END) {
        const dissolve = clamp01((t - PHASE_4_END) / (TOTAL_DURATION - PHASE_4_END));
        lotusGroupRef.current.scale.setScalar(1 + dissolve * 0.6);
        lotusGroupRef.current.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = 1 - dissolve;
            mat.transparent = true;
          }
        });
      }
    }

    // ----- Text fade in during phase 4 (throttled ~15 Hz) -----
    if (t > PHASE_3_END && t - lastTextUpdateRef.current > 0.066) {
      lastTextUpdateRef.current = t;
      if (t > PHASE_4_END + 0.8) {
        const endFade = clamp01(
          (t - (PHASE_4_END + 0.8)) / (TOTAL_DURATION - (PHASE_4_END + 0.8)),
        );
        setTextOpacity(1 - endFade);
      } else {
        const textFadeT = clamp01(
          (t - PHASE_3_END) / (PHASE_4_END - PHASE_3_END),
        );
        setTextOpacity(textFadeT);
      }
    }

    // ----- Camera dolly -----
    // Starts at z=3, drifts to z=4.2 by end of phase 3, then pulls back to z=5.5 by end
    let camZ = 3;
    if (t < PHASE_3_END) {
      camZ = 3 + (t / PHASE_3_END) * 1.2;
    } else {
      const pullT = clamp01((t - PHASE_3_END) / (TOTAL_DURATION - PHASE_3_END));
      camZ = 4.2 + pullT * 1.3;
    }
    camera.position.z = camZ;
  });

  return (
    <>
      {/* Central trit */}
      <mesh ref={trit0Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={HIGHLIGHT_HEX} transparent />
      </mesh>

      {/* Three outer trits */}
      <mesh ref={tritARef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={HIGHLIGHT_HEX} transparent />
      </mesh>
      <mesh ref={tritBRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={HIGHLIGHT_HEX} transparent />
      </mesh>
      <mesh ref={tritCRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={HIGHLIGHT_HEX} transparent />
      </mesh>

      {/* Triangle edges */}
      <Line
        points={triLine}
        color={HIGHLIGHT_HEX}
        lineWidth={1.5}
        transparent
        opacity={0.8}
      />

      {/* Fibonacci lotus lattice — 5 petals rotated by golden angle */}
      <group ref={lotusGroupRef} scale={0}>
        {Array.from({ length: 5 }, (_, i) => {
          const angle = i * GOLDEN_ANGLE;
          const radius = 0.6 + i * 0.18;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <group key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
              <mesh>
                <ringGeometry args={[0.35, 0.42, 32]} />
                <meshBasicMaterial
                  color={HIGHLIGHT_HEX}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={HIGHLIGHT_HEX} transparent />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* YUNIS title */}
      <Text
        position={[0, -1.6, 0]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        fillOpacity={textOpacity}
        outlineWidth={0.005}
        outlineColor={HIGHLIGHT_HEX}
        outlineOpacity={textOpacity * 0.6}
      >
        YUNIS
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, -2.1, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.35}
        fillOpacity={textOpacity * 0.6}
      >
        THE TERNARY ARCHITECTURE
      </Text>
    </>
  );
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
