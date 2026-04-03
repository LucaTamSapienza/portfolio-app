"use client";

import { motion } from "framer-motion";

const SECTIONS = [
  { label: "About", index: 0 },
  { label: "Experience", index: 1 },
  { label: "Projects", index: 2 },
  { label: "Open Source", index: 3 },
  { label: "Skills", index: 4 },
  { label: "Contact", index: 5 },
];

interface SectionNavProps {
  activeSection: number;
  onSectionClick: (index: number) => void;
}

export function SectionNav({ activeSection, onSectionClick }: SectionNavProps) {
  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.index;
        return (
          <button
            key={section.index}
            onClick={() => onSectionClick(section.index)}
            className="group relative flex items-center justify-end gap-3 py-1"
            aria-label={section.label}
          >
            {/* Label */}
            <span className="text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {section.label}
            </span>

            {/* Dot */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <motion.div
                className="rounded-full"
                animate={{
                  width: isActive ? 12 : 7,
                  height: isActive ? 12 : 7,
                  opacity: isActive ? 1 : 0.4,
                  backgroundColor: isActive ? "#5eead4" : "#94a3b8",
                  boxShadow: isActive ? "0 0 12px rgba(94,234,212,0.5)" : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        );
      })}
    </motion.nav>
  );
}
