import { WorkerLoadOptions } from "@built-in-ai/transformers-js";

export interface ModelConfig extends Omit<WorkerLoadOptions, "modelId"> {
  id: string;
  name: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "onnx-community/Qwen3-0.6B-ONNX",
    name: "Qwen3 0.6B",
    device: "webgpu",
    dtype: "q4f16",
  },
  {
    id: "HuggingFaceTB/SmolLM2-360M-Instruct",
    name: "SmolLM2 360M",
    device: "webgpu",
    dtype: "q4",
  },
  {
    id: "onnx-community/Llama-3.2-1B-Instruct-q4f16",
    name: "Llama 3.2 1B",
    device: "webgpu",
  },
  {
    id: "HuggingFaceTB/SmolVLM-256M-Instruct",
    name: "SmolVLM 256M (Vision)",
    device: "webgpu",
    dtype: "fp32",
    isVisionModel: true,
  },
];
