"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NEOFETCH = `
  ╭──────────────────╮
  │   ██╗  ████████╗ │    luca@neural-portfolio
  │   ██║  ╚══██╔══╝ │    ─────────────────────
  │   ██║     ██║    │    Role: Computer Engineer & AI Researcher
  │   ██║     ██║    │    Location: Rome, Italy
  │   ███████╗██║    │    Editor: VS Code / Neovim
  │   ╚══════╝╚═╝    │    Languages: Python, TypeScript, C++
  ╰──────────────────╯    Stack: PyTorch, Next.js, Three.js
                          Shell: zsh
                          Terminal: neural-portfolio v2.0
`.trimStart();

const TREE = `
.
├── about/
│   ├── education.md
│   └── bio.md
├── experience/
│   ├── babelscape/
│   └── google-summer-of-code/
├── projects/
│   ├── museion/
│   └── faqbuddy/
├── open-source/
│   ├── openvino-python/
│   ├── openvino-pytorch/
│   └── openvino-tensorflow/
├── skills/
│   ├── languages/
│   ├── frameworks/
│   └── tools/
└── contact.md
`.trimStart();

const CAT_ABOUT = `# Luca Tam

Computer Engineer with a passion for AI/ML and 3D web development.
Currently working at Babelscape on NLP and knowledge graph research.
Previously contributed to Google Summer of Code with OpenVINO.

Interests: deep learning, computer vision, open-source, creative coding.`;

const CAT_RESUME = `# Resume — Luca Tam

## Experience
  Babelscape          — AI/ML Researcher (current)
  Google Summer of Code — Open Source Contributor (2024)

## Projects
  Museion              — 3D interactive museum (Three.js, Blender)
  FAQBuddy             — RAG-powered chatbot (LangChain, FastAPI)

## Skills
  Languages: Python, TypeScript, C++, SQL
  ML/AI:     PyTorch, HuggingFace, OpenVINO, LangChain
  Web:       Next.js, React, Three.js, React Three Fiber
  Tools:     Docker, PostgreSQL, Git, Linux

Run 'sudo hire luca' to get in touch :)`;

const CAT_SKILLS = `# Skills

## Languages
  Python ████████████████████ 95%
  TypeScript ██████████████████ 90%
  C++ ████████████████ 80%
  SQL ██████████████ 70%

## Frameworks
  PyTorch ████████████████████ 95%
  Next.js ██████████████████ 90%
  Three.js █████████████████ 85%
  FastAPI ██████████████████ 90%

## Tools
  Docker ██████████████████ 90%
  Git ████████████████████ 95%
  Linux █████████████████ 85%
  Blender ████████████ 60%`;

const CAT_CONTACT = `# Contact

  Email:    luca.tam04@gmail.com
  GitHub:   github.com/LucaTamSapienza
  LinkedIn: linkedin.com/in/luca-tam
  CV:       /cv.pdf`;

const AVAILABLE_COMMANDS = [
  "help", "whoami", "neofetch", "ls", "ls projects", "ls skills",
  "ls experience", "tree", "cat about", "cat resume", "cat skills",
  "cat contact", "pwd", "date", "uname", "uptime", "echo",
  "sudo hire luca", "history", "clear", "exit",
];

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
    { input: "", output: "Neural Portfolio Terminal v2.0.0\nType 'help' for available commands. Tab to autocomplete.\n" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Autocomplete suggestion
  useEffect(() => {
    if (!input.trim()) {
      setSuggestion("");
      return;
    }
    const match = AVAILABLE_COMMANDS.find(
      (cmd) => cmd.startsWith(input.toLowerCase()) && cmd !== input.toLowerCase()
    );
    setSuggestion(match ? match.slice(input.length) : "");
  }, [input]);

  const processCommand = (cmd: string): string => {
    // Built-in commands
    if (cmd === "help") {
      return `Available commands:

  whoami          — Who is Luca?
  neofetch        — System info
  ls [dir]        — List directory contents
  tree            — Show file tree
  cat <file>      — Read a file (about, resume, skills, contact)
  pwd             — Print working directory
  date            — Show current date/time
  uname           — System information
  uptime          — Terminal uptime
  echo <text>     — Print text
  history         — Command history
  sudo hire luca  — 😏
  clear           — Clear terminal
  exit            — Close terminal`;
    }

    if (cmd === "whoami") return "Luca Tam — Computer Engineer, AI/ML Researcher, Open Source Contributor.";
    if (cmd === "neofetch") return NEOFETCH;
    if (cmd === "tree") return TREE;
    if (cmd === "cat about") return CAT_ABOUT;
    if (cmd === "cat resume") return CAT_RESUME;
    if (cmd === "cat skills") return CAT_SKILLS;
    if (cmd === "cat contact") return CAT_CONTACT;
    if (cmd === "ls projects") return "museion/  faqbuddy/  neural-portfolio/";
    if (cmd === "ls skills") return "python/  pytorch/  threejs/  r3f/  llm-rag/  openvino/  nextjs/  fastapi/  blender/  docker/";
    if (cmd === "ls experience") return "babelscape/  google-summer-of-code/  openvino-contributor/";
    if (cmd === "ls" || cmd === "ls .") return "about/  experience/  projects/  open-source/  skills/  contact.md";
    if (cmd === "pwd") return "/home/luca/neural-portfolio";
    if (cmd === "date") return new Date().toString();
    if (cmd === "uname" || cmd === "uname -a") return "Darwin neural-portfolio 25.0.0 LucaOS arm64";

    if (cmd === "uptime") {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `up ${mins}m ${secs}s`;
    }

    if (cmd.startsWith("echo ")) return cmd.slice(5);
    if (cmd === "echo") return "";

    if (cmd === "history") {
      return cmdHistory
        .slice()
        .reverse()
        .map((c, i) => `  ${i + 1}  ${c}`)
        .join("\n") || "  (empty)";
    }

    if (cmd === "sudo hire luca") {
      setTimeout(() => {
        window.location.href = "mailto:luca.tam04@gmail.com";
      }, 800);
      return "Permission granted. Opening email client... 🚀";
    }

    // Error handling
    if (cmd.startsWith("cd ")) return `bash: cd: ${cmd.slice(3)}: Permission denied`;
    if (cmd.startsWith("rm ")) return `bash: rm: nice try 😏`;
    if (cmd.startsWith("cat ") && !cmd.match(/^cat (about|resume|skills|contact)$/)) {
      return `cat: ${cmd.slice(4)}: No such file or directory\nTry: cat about, cat resume, cat skills, cat contact`;
    }
    if (cmd.startsWith("ls ") && !["ls projects", "ls skills", "ls experience", "ls .", "ls"].includes(cmd)) {
      return `ls: cannot access '${cmd.slice(3)}': No such file or directory`;
    }
    if (cmd.startsWith("sudo ")) return "sudo: only 'sudo hire luca' is allowed here 😄";
    if (cmd === "vim" || cmd === "nano" || cmd === "vi") return `${cmd}: read-only filesystem. This is a portfolio, not a server!`;

    return `bash: ${cmd.split(" ")[0]}: command not found. Type 'help' for available commands.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");
    setSuggestion("");

    if (cmd === "exit") {
      setHistory([{ input: "", output: "Neural Portfolio Terminal v2.0.0\nType 'help' for available commands. Tab to autocomplete.\n" }]);
      onClose();
      return;
    }

    if (cmd === "clear") {
      setHistory([{ input: "", output: "" }]);
      return;
    }

    const output = processCommand(cmd);
    setHistory((prev) => [...prev, { input: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }

    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput((prev) => prev + suggestion);
        setSuggestion("");
      }
      return;
    }

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-2xl h-[28rem] glass rounded-xl overflow-hidden border border-[#5eead4]/20 flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{ boxShadow: "0 0 60px rgba(94,234,212,0.1), 0 20px 60px rgba(0,0,0,0.8)" }}
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
              className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-[#5eead4] cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, i) => (
                <div key={i} className="mb-1">
                  {item.input && (
                    <div className="text-slate-400">
                      <span className="text-[#5eead4]/60">$ </span>
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
              <span className="text-[#5eead4]/60 font-mono text-xs shrink-0">$</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent font-mono text-xs text-[#5eead4] outline-none caret-[#5eead4]"
                  autoComplete="off"
                  spellCheck={false}
                />
                {suggestion && (
                  <span className="absolute left-0 top-0 font-mono text-xs text-slate-600 pointer-events-none select-none">
                    <span className="invisible">{input}</span>
                    {suggestion}
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
