"use client";

import { motion } from "framer-motion";

interface TerminalTriggerProps {
  onClick: () => void;
}

export function TerminalTrigger({ onClick }: TerminalTriggerProps) {
  return (
    <motion.button
      className="fixed bottom-6 left-6 z-40 glass rounded-lg px-3 py-2 flex items-center gap-2 group border border-white/10 hover:border-[#5eead4]/40 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      onClick={onClick}
      title="Open terminal"
    >
      <svg
        className="w-4 h-4 text-slate-500 group-hover:text-[#5eead4] transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
      <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
        terminal
      </span>
    </motion.button>
  );
}
