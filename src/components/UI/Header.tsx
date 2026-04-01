"use client";

import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      className="fixed top-6 left-6 z-50 flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div
        className="w-9 h-9 rounded-lg glass flex items-center justify-center"
        style={{ boxShadow: "0 0 20px rgba(0,240,255,0.15)" }}
      >
        <span
          className="text-sm font-bold text-[#00f0ff] font-mono"
          style={{ textShadow: "0 0 10px rgba(0,240,255,0.8)" }}
        >
          LT
        </span>
      </div>
    </motion.header>
  );
}
