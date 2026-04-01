"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS: Record<string, string | (() => string)> = {
  whoami: "Luca Tam — Computer Engineer, AI/ML Researcher, Open Source Contributor.",
  help: "Available commands: whoami, ls projects, ls skills, ls experience, cat contact, sudo hire luca, clear, exit",
  "ls projects": "museion/  faqbuddy/  neural-portfolio/",
  "ls skills": "python/  pytorch/  threejs/  r3f/  llm-rag/  openvino/  nextjs/  fastapi/  blender/  docker/",
  "ls experience": "babelscape/  google-summer-of-code/  openvino-contributor/",
  "cat contact": "email: luca.tam04@gmail.com\ngithub: github.com/LucaTamSapienza\nlinkedin: linkedin.com/in/luca-tam",
  "sudo hire luca": () => {
    setTimeout(() => {
      window.location.href = "mailto:luca.tam04@gmail.com";
    }, 800);
    return "Permission granted. Opening email client...";
  },
  pwd: "/home/luca/neural-portfolio",
  date: () => new Date().toString(),
  uname: "Darwin neural-portfolio 25.0.0 LucaOS",
  clear: "__CLEAR__",
  exit: "__EXIT__",
};

interface HistoryItem {
  input: string;
  output: string;
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { input: "", output: "Neural Portfolio Terminal v1.0.0\nType 'help' for available commands.\n" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");

    if (cmd === "exit") {
      setHistory([{ input: "", output: "Neural Portfolio Terminal v1.0.0\nType 'help' for available commands.\n" }]);
      onClose();
      return;
    }

    if (cmd === "clear") {
      setHistory([{ input: "", output: "" }]);
      return;
    }

    const handler = COMMANDS[cmd];
    let output = "";

    if (handler !== undefined) {
      output = typeof handler === "function" ? (handler as () => string)() : handler;
    } else if (cmd.startsWith("cd ")) {
      output = `bash: cd: ${cmd.slice(3)}: Permission denied`;
    } else if (cmd.startsWith("cat ") && !COMMANDS[cmd]) {
      output = `cat: ${cmd.slice(4)}: No such file or directory`;
    } else if (cmd.startsWith("ls")) {
      output = `ls: cannot access '${cmd.slice(3)}': No such file or directory`;
    } else {
      output = `bash: ${cmd.split(" ")[0]}: command not found`;
    }

    setHistory((prev) => [...prev, { input: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(newIdx);
      setInput(cmdHistory[newIdx] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[newIdx] || "");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-4 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl h-96 glass rounded-xl overflow-hidden border border-[#00f0ff]/20 flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{ boxShadow: "0 0 60px rgba(0,240,255,0.15), 0 20px 60px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-white/3">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
              <span className="ml-2 text-[11px] font-mono text-slate-600">luca@neural-portfolio ~ $</span>
            </div>

            {/* Terminal body */}
            <div
              className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#00f0ff] cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, i) => (
                <div key={i} className="mb-1">
                  {item.input && (
                    <div className="text-slate-400">
                      <span className="text-[#00f0ff]/60">$ </span>
                      {item.input}
                    </div>
                  )}
                  {item.output && (
                    <div className="text-slate-300 whitespace-pre-wrap opacity-90">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2.5 border-t border-white/6">
              <span className="text-[#00f0ff]/60 font-mono text-xs shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-xs text-[#00f0ff] outline-none caret-[#00f0ff]"
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
