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
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
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
            className="group relative flex items-center justify-end gap-2"
            aria-label={section.label}
          >
            {/* Label */}
            <span className="text-[11px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {section.label}
            </span>

            {/* Dot */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              <motion.div
                className="rounded-full bg-[#00f0ff]"
                animate={{
                  width: isActive ? 8 : 4,
                  height: isActive ? 8 : 4,
                  opacity: isActive ? 1 : 0.3,
                  boxShadow: isActive ? "0 0 10px #00f0ff" : "none",
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
