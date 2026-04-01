"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { edges } from "@/data/portfolio";
import { NodePosition } from "@/lib/graph";

interface EdgeLinesProps {
  layout: Map<string, NodePosition>;
  selectedNodeId: string | null;
  connectedToSelected: Set<string>;
  highlightedNodeIds: Set<string> | null;
}

export function EdgeLines({
  layout,
  selectedNodeId,
  connectedToSelected,
  highlightedNodeIds,
}: EdgeLinesProps) {
  const edgeData = useMemo(() => {
    return edges
      .map((edge) => {
        const a = layout.get(edge.source);
        const b = layout.get(edge.target);
        if (!a || !b) return null;
        return { edge, a, b };
      })
      .filter(Boolean) as { edge: typeof edges[0]; a: NodePosition; b: NodePosition }[];
  }, [layout]);

  return (
    <group>
      {edgeData.map(({ edge, a, b }, i) => {
        let opacity = 0.06 + edge.strength * 0.1;

        if (selectedNodeId) {
          if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
            opacity = 0.5 + edge.strength * 0.4;
          } else {
            opacity = 0.02;
          }
        } else if (highlightedNodeIds) {
          if (highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target)) {
            opacity = 0.4 + edge.strength * 0.3;
          } else {
            opacity = 0.015;
          }
        }

        return (
          <Line
            key={`${edge.source}-${edge.target}-${i}`}
            points={[
              [a.x, a.y, a.z],
              [b.x, b.y, b.z],
            ]}
            color="#00f0ff"
            lineWidth={0.5 + edge.strength * 0.8}
            transparent
            opacity={opacity}
          />
        );
      })}
    </group>
  );
}
