import { atomWithStorage } from "jotai/utils";

export type SketchView = 'result' | 'code';

export interface Sketch {
  id: string;
  prompt: string;
  html: string;
  x: number;
  y: number;
  width: number;
  height: number;
  view: SketchView;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'create' | 'edit';
  sketchId?: string | null;
}

export interface CanvasTransform {
    x: number;
    y: number;
    scale: number;
}

export const designSketchesAtom = atomWithStorage<Sketch[]>('design-sketches', []);


export const designSketchAiProviders = ['openai', 'anthropic', 'google'] as const;
export type DesignSketchAiProvider = (typeof designSketchAiProviders)[number];

export const providerModels: Record<DesignSketchAiProvider, string[]> = {
  openai: ['gpt-3.5-turbo', 'gpt-4','gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini'],
  anthropic: [
    'claude-3-5-haiku-latest',
    'claude-3-5-sonnet-latest',
    'claude-4-opus-20250514',
    'claude-4-sonnet-20250514',
  ],
  google: [
    'models/gemini-2.5-pro',
    'models/gemini-2.5-flash',
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash-001',
    'models/gemini-1.5-pro-001',
  ],
};

export const providerLinks: Record<DesignSketchAiProvider, string> = {
  openai: 'https://platform.openai.com/account/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  google: 'https://aistudio.google.com/app/apikey',
};

export const designSketchAiProviderAtom = atomWithStorage<DesignSketchAiProvider>('sketch-ai-provider', 'google');
export const designSketchAiModelAtom = atomWithStorage<string>('sketch-ai-model', providerModels.google[1]);
export const designSketchAiApiKeyAtom = atomWithStorage<string>('sketch-ai-api-key', '');