"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PortfolioNode } from "@/data/portfolio";
import { edges, nodes } from "@/data/portfolio";

const TYPE_ICON: Record<string, string> = {
  about: "◉",
  education: "◎",
  experience: "▸",
  project: "◆",
  contribution: "⬡",
  skill: "●",
};

const LINK_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  demo: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  article: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  email: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

function getRelatedNodes(nodeId: string): PortfolioNode[] {
  const relatedIds = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === nodeId) relatedIds.add(edge.target);
    if (edge.target === nodeId) relatedIds.add(edge.source);
  });
  return nodes.filter((n) => relatedIds.has(n.id)).slice(0, 5);
}

interface DetailPanelProps {
  node: PortfolioNode | null;
  onClose: () => void;
  onNodeSelect: (node: PortfolioNode) => void;
}

export function DetailPanel({ node, onClose, onNodeSelect }: DetailPanelProps) {
  const relatedNodes = node ? getRelatedNodes(node.id) : [];

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-40 w-full max-w-sm glass border-l border-white/8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/6">
                <div className="flex items-start gap-3">
                  <span className="text-[#00f0ff] text-lg mt-0.5" style={{ textShadow: "0 0 8px rgba(0,240,255,0.8)" }}>
                    {TYPE_ICON[node.type] || "●"}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white leading-tight">{node.title}</h2>
                    {node.subtitle && (
                      <p className="text-xs text-slate-500 mt-1">{node.subtitle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-600 hover:text-slate-300 transition-colors p-1 -mt-1 -mr-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">{node.description}</p>

                {/* Tags */}
                {node.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[#00f0ff]/20 text-[#00f0ff]/60 bg-[#00f0ff]/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {node.links && node.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {node.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00f0ff] transition-colors py-1.5 px-3 rounded-lg glass border border-white/8 hover:border-[#00f0ff]/30"
                      >
                        {LINK_ICONS[link.icon]}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Related nodes */}
                {relatedNodes.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-2">
                      Connected
                    </h3>
                    <div className="space-y-1">
                      {relatedNodes.map((related) => (
                        <button
                          key={related.id}
                          onClick={() => onNodeSelect(related)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-[#00f0ff]/40 text-xs">{TYPE_ICON[related.type]}</span>
                          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors truncate">
                            {related.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
