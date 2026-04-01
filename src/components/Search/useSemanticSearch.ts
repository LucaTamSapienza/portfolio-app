"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { nodes, PortfolioNode } from "@/data/portfolio";
import { cosineSimilarity, keywordMatch } from "@/lib/similarity";

export interface SearchResult {
  node: PortfolioNode;
  score: number;
  matchType: "semantic" | "keyword";
}

type ModelStatus = "idle" | "loading" | "ready" | "error";

export function useSemanticSearch() {
  const workerRef = useRef<Worker | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [modelProgress, setModelProgress] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const pendingQueryRef = useRef<string>("");
  const requestId = useRef(0);

  // Load worker after first user interaction with search
  const initWorker = useCallback(() => {
    if (workerRef.current || modelStatus !== "idle") return;
    setModelStatus("loading");

    const worker = new Worker(
      new URL("../../lib/embedding-worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event: MessageEvent) => {
      const { type, embedding, id, message, progress } = event.data;

      if (type === "ready") {
        setModelStatus("ready");
        setModelProgress("");
        // If there's a pending query, process it now
        if (pendingQueryRef.current) {
          const q = pendingQueryRef.current;
          const rid = ++requestId.current;
          worker.postMessage({ type: "embed", text: q, id: rid });
        }
      } else if (type === "progress") {
        setModelProgress(message || "");
      } else if (type === "result" && id === requestId.current) {
        // Rank nodes by cosine similarity
        const ranked = nodes
          .map((node) => {
            const nodeText = `${node.title} ${node.subtitle || ""} ${node.description} ${node.tags.join(" ")}`;
            // embeddings stored on nodes — for now use keyword as fallback
            return {
              node,
              score: cosineSimilarity(embedding, getNodeEmbedding(node.id)),
              matchType: "semantic" as const,
            };
          })
          .filter((r) => r.score > 0.2)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);

        if (ranked.length > 0) {
          setResults(ranked);
        }
      } else if (type === "error") {
        setModelStatus("error");
      }
    };

    worker.postMessage({ type: "init" });
    workerRef.current = worker;
  }, [modelStatus]);

  // Tier 1: instant keyword search
  const keywordSearch = useCallback((q: string): SearchResult[] => {
    if (!q.trim()) return [];
    return nodes
      .map((node) => {
        const text = `${node.title} ${node.subtitle || ""} ${node.description} ${node.tags.join(" ")}`;
        const score = keywordMatch(q, text);
        return { node, score, matchType: "keyword" as const };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, []);

  const search = useCallback(
    (q: string) => {
      setQuery(q);

      if (!q.trim()) {
        setResults([]);
        return;
      }

      // Tier 1 immediately
      const kwResults = keywordSearch(q);
      setResults(kwResults);

      // Tier 2 semantically
      if (modelStatus === "ready" && workerRef.current) {
        const rid = ++requestId.current;
        pendingQueryRef.current = q;
        workerRef.current.postMessage({ type: "embed", text: q, id: rid });
      } else {
        pendingQueryRef.current = q;
      }
    },
    [modelStatus, keywordSearch]
  );

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    pendingQueryRef.current = "";
  }, []);

  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return {
    query,
    results,
    search,
    clear,
    modelStatus,
    modelProgress,
    initWorker,
  };
}

// Placeholder: in production, load from embeddings.json
// For now returns empty array (keyword search will be used)
function getNodeEmbedding(nodeId: string): number[] {
  return [];
}
