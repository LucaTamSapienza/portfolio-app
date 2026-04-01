"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { NetworkGraph } from "./NetworkGraph";
import { CameraController } from "./CameraController";
import { PortfolioNode } from "@/data/portfolio";

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
        background: "#0a0a0f",
      }}
    >
      <Suspense fallback={null}>
        <CameraController activeSection={activeSection} />
        <NetworkGraph
          highlightedNodeIds={highlightedNodeIds}
          selectedNodeId={selectedNodeId}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            intensity={1.4}
            mipmapBlur
            levels={5}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
