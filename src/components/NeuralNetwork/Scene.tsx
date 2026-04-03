"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { NetworkGraph } from "./NetworkGraph";
import { CameraController } from "./CameraController";
import { PortfolioNode } from "@/data/portfolio";

/** Subtle animated star field for depth */
function StarField({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
      sz[i] = Math.random() * 1.5 + 0.5;
    }
    return [pos, sz];
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00008;
      ref.current.rotation.x += 0.00004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#94a3b8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Soft radial gradient background — dark navy with subtle warm center */
function GradientBackground() {
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        colorCenter: { value: new THREE.Color("#111827") },   // gray-900
        colorEdge: { value: new THREE.Color("#030712") },     // gray-950
        colorAccent: { value: new THREE.Color("#0f172a") },   // slate-900 (subtle blue)
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorCenter;
        uniform vec3 colorEdge;
        uniform vec3 colorAccent;
        varying vec3 vWorldPosition;
        void main() {
          float d = length(vWorldPosition.xy) / 60.0;
          d = clamp(d, 0.0, 1.0);
          vec3 col = mix(colorCenter, colorEdge, d * d);
          // subtle blue tint in upper region
          float up = clamp(vWorldPosition.y / 40.0 + 0.5, 0.0, 1.0);
          col = mix(col, colorAccent, up * 0.3);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh material={mat}>
      <sphereGeometry args={[90, 32, 32]} />
    </mesh>
  );
}

interface SceneProps {
  activeSection: number;
  highlightedNodeIds: Set<string> | null;
  selectedNodeId: string | null;
  onNodeClick: (node: PortfolioNode) => void;
  onNodeHover: (nodeId: string | null) => void;
}

export function Scene({
  activeSection,
  highlightedNodeIds,
  selectedNodeId,
  onNodeClick,
  onNodeHover,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 22], fov: 60, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#030712",
      }}
    >
      <Suspense fallback={null}>
        <GradientBackground />
        <StarField />
        <CameraController activeSection={activeSection} />
        <NetworkGraph
          highlightedNodeIds={highlightedNodeIds}
          selectedNodeId={selectedNodeId}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            intensity={0.8}
            mipmapBlur
            levels={4}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
