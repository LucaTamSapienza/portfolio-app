// Web Worker for running the embedding model
// This file is loaded by useSemanticSearch via new Worker(new URL(...))

import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

let extractor: FeatureExtractionPipeline | null = null;

async function loadModel() {
  try {
    self.postMessage({ type: "progress", message: "Loading AI model..." });
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        dtype: "q8",
        progress_callback: (progress: { status: string; progress?: number }) => {
          self.postMessage({ type: "progress", message: progress.status, progress: progress.progress });
        },
      }
    );
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "error", message: String(err) });
  }
}

async function embed(text: string, id: number) {
  if (!extractor) {
    self.postMessage({ type: "error", message: "Model not loaded" });
    return;
  }
  try {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    // output.data is a Float32Array
    const embedding = Array.from(output.data as Float32Array);
    self.postMessage({ type: "result", embedding, id });
  } catch (err) {
    self.postMessage({ type: "error", message: String(err), id });
  }
}

self.addEventListener("message", (event: MessageEvent) => {
  const { type, text, id } = event.data;
  if (type === "init") {
    loadModel();
  } else if (type === "embed") {
    embed(text, id);
  }
});
