import { atomWithStorage } from 'jotai/utils';

export enum AIProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  GoogleGemini = 'google-gemini',
  // Potentially add Groq for open models if Vercel SDK supports its client-side key usage easily
}

export const aiProvidersList = [
  { id: AIProvider.OpenAI, name: 'OpenAI' },
  { id: AIProvider.Anthropic, name: 'Anthropic (Claude)' },
  { id: AIProvider.GoogleGemini, name: 'Google Gemini' },
];

export const selectedAIProviderAtom = atomWithStorage<AIProvider | null>(
  'selectedAIProvider',
  null
);

export const aiApiKeyAtom = atomWithStorage<string>(
  'aiApiKey',
  ''
);

export const aiFeaturesEnabledAtom = atomWithStorage<boolean>(
  'aiFeaturesEnabled',
  true // Default to true, can be changed based on preference
);

export const aiProviderApiDocs: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: 'https://platform.openai.com/account/api-keys',
  [AIProvider.Anthropic]: 'https://console.anthropic.com/settings/keys',
  [AIProvider.GoogleGemini]: 'https://makersuite.google.com/app/apikey',
  // Add other provider URLs if they are added to AIProvider enum
};
