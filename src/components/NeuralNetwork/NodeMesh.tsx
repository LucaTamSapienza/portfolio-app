"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { PortfolioNode } from "@/data/portfolio";

type NodeState = "default" | "highlighted" | "dimmed" | "selected" | "connected";

const CYAN = new THREE.Color("#00f0ff");
const CYAN_BRIGHT = new THREE.Color("#80f8ff");
const WHITE = new THREE.Color("#ffffff");

interface NodeMeshProps {
  node: PortfolioNode;
  position: [number, number, number];
  state: NodeState;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}

export function NodeMesh({ node, position, state, onClick, onHover }: NodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const hovered = useRef(false);

  const baseSize = 0.25 + node.weight * 0.12;

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    const time = Date.now() * 0.001;
    const breathe = 1 + Math.sin(time * 0.8 + node.id.length * 0.7) * 0.04;

    let targetScale = baseSize * breathe;
    let targetOpacity = 1;
    let targetEmissive = 0.6;
    let targetColor = CYAN;

    switch (state) {
      case "selected":
        targetScale = baseSize * 1.5 * breathe;
        targetEmissive = 3.0;
        targetColor = CYAN_BRIGHT;
        break;
      case "connected":
        targetScale = baseSize * 1.2 * breathe;
        targetEmissive = 1.5;
        targetColor = CYAN;
        break;
      case "highlighted":
        targetScale = baseSize * 1.3 * breathe;
        targetEmissive = 2.0;
        targetColor = CYAN_BRIGHT;
        break;
      case "dimmed":
        targetOpacity = 0.12;
        targetEmissive = 0.1;
        break;
      case "default":
      default:
        targetEmissive = hovered.current ? 1.8 : 0.6;
        targetColor = hovered.current ? CYAN_BRIGHT : CYAN;
        targetScale = hovered.current ? baseSize * 1.2 : baseSize * breathe;
    }

    // Smooth transitions
    const s = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(s + (targetScale - s) * Math.min(delta * 6, 1));

    matRef.current.opacity += (targetOpacity - matRef.current.opacity) * Math.min(delta * 8, 1);
    matRef.current.emissiveIntensity += (targetEmissive - matRef.current.emissiveIntensity) * Math.min(delta * 6, 1);
    matRef.current.color.lerp(targetColor, Math.min(delta * 6, 1));
    matRef.current.emissive.lerp(targetColor, Math.min(delta * 6, 1));
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); hovered.current = true; onHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { hovered.current = false; onHover(false); document.body.style.cursor = "auto"; }}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}
