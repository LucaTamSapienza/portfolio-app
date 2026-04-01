"use client";

import { useMemo } from "react";
import { nodes, edges, PortfolioNode } from "@/data/portfolio";
import { getGraphLayout, getConnectedNodeIds } from "@/lib/graph";
import { NodeMesh } from "./NodeMesh";
import { EdgeLines } from "./EdgeLines";
import { Particles } from "./Particles";

interface NetworkGraphProps {
  highlightedNodeIds: Set<string> | null;
  selectedNodeId: string | null;
  onNodeClick: (node: PortfolioNode) => void;
  onNodeHover: (nodeId: string | null) => void;
}

export function NetworkGraph({
  highlightedNodeIds,
  selectedNodeId,
  onNodeClick,
  onNodeHover,
}: NetworkGraphProps) {
  const layout = useMemo(() => getGraphLayout(), []);

  const connectedToSelected = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    return getConnectedNodeIds(selectedNodeId);
  }, [selectedNodeId]);

  return (
    <group>
      <EdgeLines
        layout={layout}
        selectedNodeId={selectedNodeId}
        connectedToSelected={connectedToSelected}
        highlightedNodeIds={highlightedNodeIds}
      />
      <Particles layout={layout} />
      {nodes.map((node) => {
        const pos = layout.get(node.id);
        if (!pos) return null;

        const isSelected = selectedNodeId === node.id;
        const isConnected = connectedToSelected.has(node.id);

        let state: "default" | "highlighted" | "dimmed" | "selected" | "connected" = "default";
        if (highlightedNodeIds) {
          state = highlightedNodeIds.has(node.id) ? "highlighted" : "dimmed";
        }
        if (selectedNodeId) {
          if (isSelected) state = "selected";
          else if (isConnected) state = "connected";
          else state = "dimmed";
        }

        return (
          <NodeMesh
            key={node.id}
            node={node}
            position={[pos.x, pos.y, pos.z]}
            state={state}
            onClick={() => onNodeClick(node)}
            onHover={(hovering) => onNodeHover(hovering ? node.id : null)}
          />
        );
      })}
    </group>
  );
}
