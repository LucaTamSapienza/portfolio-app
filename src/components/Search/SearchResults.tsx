"use client";

import { motion } from "framer-motion";
import { PortfolioNode } from "@/data/portfolio";
import { SearchResult } from "./useSemanticSearch";

const TYPE_LABELS: Record<string, string> = {
  about: "About",
  education: "Education",
  experience: "Experience",
  project: "Project",
  contribution: "Open Source",
  skill: "Skill",
};

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (node: PortfolioNode) => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 1px rgba(0,240,255,0.2)" }}
    >
      <div className="max-h-80 overflow-y-auto">
        {results.map((result, i) => (
          <motion.button
            key={result.node.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(result.node)}
            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#00f0ff]/30 text-[#00f0ff]/70">
                  {TYPE_LABELS[result.node.type] || result.node.type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                  {result.node.title}
                </div>
                {result.node.subtitle && (
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {result.node.subtitle}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <div
                  className="h-1 rounded-full bg-[#00f0ff]/30"
                  style={{ width: `${Math.round(result.score * 40 + 4)}px` }}
                >
                  <div
                    className="h-full rounded-full bg-[#00f0ff]"
                    style={{ width: `${Math.round(result.score * 100)}%`, opacity: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-white/5">
        <span className="text-[10px] text-slate-600 font-mono">
          {results.length} result{results.length !== 1 ? "s" : ""} · esc to close
        </span>
      </div>
    </motion.div>
  );
}
