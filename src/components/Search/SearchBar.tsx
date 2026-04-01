"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchResults } from "./SearchResults";
import { useSemanticSearch } from "./useSemanticSearch";
import { PortfolioNode } from "@/data/portfolio";

interface SearchBarProps {
  onHighlightChange: (nodeIds: Set<string> | null) => void;
  onNodeSelect: (node: PortfolioNode) => void;
}

export function SearchBar({ onHighlightChange, onNodeSelect }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { query, results, search, clear, modelStatus, initWorker } =
    useSemanticSearch();

  // Stable string key — avoids infinite loop from new Set() on every render
  const resultKey = results.map((r) => r.node.id).join(",");
  useEffect(() => {
    const set = query.trim() ? new Set(results.map((r) => r.node.id)) : null;
    onHighlightChange(set);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultKey, query]);

  const handleFocus = () => {
    setIsFocused(true);
    initWorker();
  };

  const handleBlur = () => {
    // Delay to allow result clicks
    setTimeout(() => setIsFocused(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      clear();
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (node: PortfolioNode) => {
    onNodeSelect(node);
    clear();
    inputRef.current?.blur();
  };

  const showResults = isFocused && results.length > 0;
  const showPanel = isFocused || query;

  return (
    <motion.div
      className="fixed top-6 left-1/2 z-50 w-full max-w-lg px-4"
      style={{ translateX: "-50%" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="relative">
        {/* Input */}
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          animate={{
            boxShadow: isFocused
              ? "0 0 0 1px rgba(0,240,255,0.4), 0 0 30px rgba(0,240,255,0.15)"
              : "0 0 0 1px rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => search(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Luca..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none font-[family-name:var(--font-inter)]"
            />
            <AnimatePresence mode="wait">
              {modelStatus === "loading" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-mono">Loading AI</span>
                </motion.div>
              ) : modelStatus === "ready" ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" style={{ boxShadow: "0 0 6px #00f0ff" }} />
                  <span className="text-[10px] text-[#00f0ff] font-mono">AI</span>
                </motion.div>
              ) : query ? (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={clear}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results dropdown */}
        <AnimatePresence>
          {showResults && (
            <SearchResults results={results} onSelect={handleResultClick} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
