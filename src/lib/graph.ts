import { nodes, edges, PortfolioNode } from "@/data/portfolio";

export interface NodePosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

// Cluster centroids in 3D space — spread around a sphere
const CLUSTER_CENTROIDS: Record<string, [number, number, number]> = {
  about:      [0,    0,    0],
  experience: [-8,   3,   -2],
  projects:   [8,    2,   -2],
  opensource: [-5,  -5,    3],
  skills:     [2,   -2,    6],
  contact:    [0,    0,    0],
};

const CLUSTER_RADIUS = 4;

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function computeGraphLayout(): Map<string, NodePosition> {
  const rand = seedRandom(42);

  // Initialize positions near cluster centroids with some spread
  const positions = new Map<string, NodePosition>();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  nodes.forEach((node) => {
    const centroid = CLUSTER_CENTROIDS[node.cluster] || [0, 0, 0];
    positions.set(node.id, {
      id: node.id,
      x: centroid[0] + (rand() - 0.5) * CLUSTER_RADIUS * 2,
      y: centroid[1] + (rand() - 0.5) * CLUSTER_RADIUS * 2,
      z: centroid[2] + (rand() - 0.5) * CLUSTER_RADIUS * 2,
    });
  });

  // Simple force-directed simulation (no d3-force-3d needed on client — run at build/init)
  const ITERATIONS = 200;
  const REPULSION = 12;
  const ATTRACTION = 0.15;
  const CLUSTER_PULL = 0.05;
  const DAMPING = 0.85;

  const velocities = new Map<string, [number, number, number]>();
  nodes.forEach((n) => velocities.set(n.id, [0, 0, 0]));

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = new Map<string, [number, number, number]>();
    nodes.forEach((n) => forces.set(n.id, [0, 0, 0]));

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = positions.get(nodes[i].id)!;
        const b = positions.get(nodes[j].id)!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        const fa = forces.get(nodes[i].id)!;
        fa[0] += fx; fa[1] += fy; fa[2] += fz;
        const fb = forces.get(nodes[j].id)!;
        fb[0] -= fx; fb[1] -= fy; fb[2] -= fz;
      }
    }

    // Spring attraction along edges
    edges.forEach((edge) => {
      const a = positions.get(edge.source);
      const b = positions.get(edge.target);
      if (!a || !b) return;

      const targetDist = 3 - edge.strength * 1.5;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
      const forceMag = (dist - targetDist) * ATTRACTION * edge.strength;
      const fx = (dx / dist) * forceMag;
      const fy = (dy / dist) * forceMag;
      const fz = (dz / dist) * forceMag;

      const fa = forces.get(edge.source)!;
      fa[0] += fx; fa[1] += fy; fa[2] += fz;
      const fb = forces.get(edge.target)!;
      fb[0] -= fx; fb[1] -= fy; fb[2] -= fz;
    });

    // Cluster pull toward centroid
    nodes.forEach((node) => {
      const pos = positions.get(node.id)!;
      const centroid = CLUSTER_CENTROIDS[node.cluster] || [0, 0, 0];
      const f = forces.get(node.id)!;
      f[0] += (centroid[0] - pos.x) * CLUSTER_PULL;
      f[1] += (centroid[1] - pos.y) * CLUSTER_PULL;
      f[2] += (centroid[2] - pos.z) * CLUSTER_PULL;
    });

    // Integrate
    nodes.forEach((node) => {
      const pos = positions.get(node.id)!;
      const vel = velocities.get(node.id)!;
      const f = forces.get(node.id)!;

      vel[0] = (vel[0] + f[0]) * DAMPING;
      vel[1] = (vel[1] + f[1]) * DAMPING;
      vel[2] = (vel[2] + f[2]) * DAMPING;

      pos.x += vel[0];
      pos.y += vel[1];
      pos.z += vel[2];
    });
  }

  return positions;
}

// Compute once and cache
let _cachedLayout: Map<string, NodePosition> | null = null;

export function getGraphLayout(): Map<string, NodePosition> {
  if (!_cachedLayout) {
    _cachedLayout = computeGraphLayout();
  }
  return _cachedLayout;
}

export function getNodePosition(id: string): [number, number, number] {
  const layout = getGraphLayout();
  const pos = layout.get(id);
  if (!pos) return [0, 0, 0];
  return [pos.x, pos.y, pos.z];
}

export function getConnectedNodeIds(nodeId: string): Set<string> {
  const connected = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  });
  return connected;
}

export const SECTION_CAMERA_TARGETS: Record<
  string,
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  about:      { position: [0, 2, 22],   lookAt: [0, 0, 0] },
  experience: { position: [-10, 5, 15], lookAt: [-8, 3, -2] },
  projects:   { position: [10, 4, 15],  lookAt: [8, 2, -2] },
  opensource: { position: [-7, -7, 15], lookAt: [-5, -5, 3] },
  skills:     { position: [2, -2, 14],  lookAt: [2, -2, 6] },
  contact:    { position: [0, -2, 22],  lookAt: [0, -2, 0] },
};
