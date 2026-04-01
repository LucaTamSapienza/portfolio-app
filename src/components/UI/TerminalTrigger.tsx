"use client";

import { motion } from "framer-motion";

interface TerminalTriggerProps {
  onClick: () => void;
}

export function TerminalTrigger({ onClick }: TerminalTriggerProps) {
  return (
    <motion.button
      className="fixed bottom-6 left-6 z-40 font-mono text-xs text-slate-700 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      onClick={onClick}
      title="Open terminal"
    >
      <span className="w-2 h-3 border border-current opacity-50 group-hover:opacity-100" />
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">terminal</span>
    </motion.button>
  );
}
