import { WorkerLoadOptions } from "@browser-ai/transformers-js";

export interface ModelConfig extends Omit<WorkerLoadOptions, "modelId"> {
  id: string;
  name: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "onnx-community/granite-4.0-350m-ONNX-web",
    name: "Granite 4.0 350M (Tool calling)",
    device: "webgpu",
    dtype: "fp16",
  },
  {
    id: "onnx-community/gemma-4-E2B-it-ONNX",
    name: "Gemma4 E2B",
    device: "webgpu",
    dtype: "q4",
    isVisionModel: true,
  },
  {
    id: "onnx-community/LFM2-1.2B-Tool-ONNX",
    name: "LFM2 1.2B-Tool",
    device: "webgpu",
    dtype: "fp16",
  },
  {
    id: "onnx-community/gemma-3-270m-it-ONNX",
    name: "Gemma3 270M",
    device: "webgpu",
    dtype: "fp32",
  },
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
