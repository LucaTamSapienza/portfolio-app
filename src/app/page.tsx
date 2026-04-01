"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioNode } from "@/data/portfolio";
import { useScrollSection } from "@/hooks/useScrollSection";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { SectionNav } from "@/components/UI/SectionNav";
import { DetailPanel } from "@/components/UI/DetailPanel";
import { ContactSection } from "@/components/UI/ContactSection";
import { Header } from "@/components/UI/Header";
import { SearchBar } from "@/components/Search/SearchBar";
import { Terminal } from "@/components/UI/Terminal";
import { TerminalTrigger } from "@/components/UI/TerminalTrigger";

// Dynamically import the 3D scene (no SSR)
const Scene = dynamic(
  () => import("@/components/NeuralNetwork/Scene").then((m) => ({ default: m.Scene })),
  { ssr: false, loading: () => null }
);

const SECTION_NAMES = ["About", "Experience", "Projects", "Open Source", "Skills", "Contact"];
const SECTION_DESCRIPTIONS: Record<number, string> = {
  0: "Computer Engineer & AI Researcher",
  1: "Where I've worked & contributed",
  2: "Things I've built",
  3: "Open source footprint",
  4: "Technologies & tools",
  5: "Get in touch",
};

export default function Home() {
  const { section, scrollToSection, sectionCount } = useScrollSection();
  const [selectedNode, setSelectedNode] = useState<PortfolioNode | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string> | null>(null);
  const [konamiActive, setKonamiActive] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleNodeClick = useCallback((node: PortfolioNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleNodeHover = useCallback((_nodeId: string | null) => {
    // hover state handled inside NodeMesh
  }, []);

  const handleHighlightChange = useCallback((nodeIds: Set<string> | null) => {
    setHighlightedNodeIds(nodeIds);
  }, []);

  const handleSearchNodeSelect = useCallback((node: PortfolioNode) => {
    setSelectedNode(node);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedNode(null);
  }, []);

  useKonamiCode(
    useCallback(() => {
      setKonamiActive(true);
      setTimeout(() => setKonamiActive(false), 3000);
    }, [])
  );

  return (
    <>
      {/* Virtual scroll spacer — drives section transitions */}
      <div style={{ height: `${sectionCount * 100}vh` }} aria-hidden />

      {/* Fixed 3D canvas */}
      <Scene
        activeSection={section}
        highlightedNodeIds={highlightedNodeIds}
        selectedNodeId={selectedNode?.id ?? null}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
      />

      {/* Header */}
      <Header />

      {/* Search bar */}
      <SearchBar
        onHighlightChange={handleHighlightChange}
        onNodeSelect={handleSearchNodeSelect}
      />

      {/* Section label */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {section !== 5 && (
              <>
                <p className="text-[11px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                  {SECTION_NAMES[section]}
                </p>
                <p className="text-xs text-slate-700 mt-0.5">{SECTION_DESCRIPTIONS[section]}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Section nav */}
      <SectionNav activeSection={section} onSectionClick={scrollToSection} />

      {/* Node detail panel */}
      <DetailPanel
        node={selectedNode}
        onClose={handleCloseDetail}
        onNodeSelect={handleNodeClick}
      />

      {/* Contact section overlay */}
      <ContactSection visible={section === 5} />

      {/* Terminal easter egg */}
      <TerminalTrigger onClick={() => setTerminalOpen(true)} />
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Konami code flash */}
      <AnimatePresence>
        {konamiActive && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, times: [0, 0.1, 0.3, 0.5, 1] }}
            style={{ background: "radial-gradient(ellipse at center, rgba(0,240,255,0.4) 0%, transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Toast for konami */}
      <AnimatePresence>
        {konamiActive && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass rounded-xl px-4 py-2.5 border border-[#00f0ff]/30"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            style={{ boxShadow: "0 0 30px rgba(0,240,255,0.2)" }}
          >
            <p className="text-xs font-mono text-[#00f0ff]">⚡ Neural network activated</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
