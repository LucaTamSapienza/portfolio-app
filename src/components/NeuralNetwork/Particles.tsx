"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { edges } from "@/data/portfolio";
import { NodePosition } from "@/lib/graph";

const PARTICLES_PER_EDGE = 3;

interface ParticlesProps {
  layout: Map<string, NodePosition>;
}

export function Particles({ layout }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, offsets, edgeData } = useMemo(() => {
    const validEdges = edges
      .map((edge) => {
        const a = layout.get(edge.source);
        const b = layout.get(edge.target);
        if (!a || !b) return null;
        return { a, b, strength: edge.strength };
      })
      .filter(Boolean) as { a: NodePosition; b: NodePosition; strength: number }[];

    const totalParticles = validEdges.length * PARTICLES_PER_EDGE;
    const positions = new Float32Array(totalParticles * 3);
    const offsets = new Float32Array(totalParticles); // t offset [0,1)

    for (let i = 0; i < totalParticles; i++) {
      offsets[i] = i / PARTICLES_PER_EDGE % 1;
    }

    return { positions, offsets, edgeData: validEdges };
  }, [layout]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    const time = Date.now() * 0.0004;
    let pi = 0;

    for (let ei = 0; ei < edgeData.length; ei++) {
      const { a, b } = edgeData[ei];
      for (let p = 0; p < PARTICLES_PER_EDGE; p++) {
        const t = ((time + offsets[pi]) % 1 + 1) % 1;
        positions[pi * 3 + 0] = a.x + (b.x - a.x) * t;
        positions[pi * 3 + 1] = a.y + (b.y - a.y) * t;
        positions[pi * 3 + 2] = a.z + (b.z - a.z) * t;
        pi++;
      }
    }

    if (pointsRef.current) {
      (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.05}
        color="#00f0ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
