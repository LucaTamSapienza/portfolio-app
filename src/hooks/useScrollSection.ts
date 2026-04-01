"use client";

import { useState, useEffect, useCallback } from "react";

const SECTION_COUNT = 6;

export function useScrollSection() {
  const [section, setSection] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const scrollFraction = Math.min(scrollTop / maxScroll, 1);
      const exact = scrollFraction * (SECTION_COUNT - 1);
      setSection(Math.round(exact));
      setProgress(exact % 1);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler(); // init
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const target = (index / (SECTION_COUNT - 1)) * maxScroll;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return { section, progress, scrollToSection, sectionCount: SECTION_COUNT };
}
