// hooks/useAIConfig.ts
import { useAtom } from 'jotai';
import {
  selectedAIProviderAtom,
  aiApiKeyAtom,
  aiFeaturesEnabledAtom,
  AIProvider,
  aiProviderApiDocs, // Import aiProviderApiDocs
} from '@/store/aiConfig.atom';

export function useAIConfig() {
  const [selectedProvider, setSelectedProviderAtom] = useAtom(selectedAIProviderAtom);
  const [apiKey, setApiKeyAtom] = useAtom(aiApiKeyAtom);
  const [aiFeaturesEnabled, setInternalAiFeaturesEnabled] = useAtom(aiFeaturesEnabledAtom);

  const apiKeyDocUrl = selectedProvider ? aiProviderApiDocs[selectedProvider] : null;

  // Encapsulate the logic for clearing API key when AI features are disabled
  const setAiFeaturesEnabled = (enabled: boolean) => {
    setInternalAiFeaturesEnabled(enabled);
    if (!enabled) {
      setApiKeyAtom('');
      setSelectedProviderAtom(null);
      // The page component currently handles resetting other UI states like aiSuggestion,
      // editingAIContent, selectedBlockId, and aiPrompt.
      // If these were to be managed more globally or through a dedicated actions hook,
      // that logic could be invoked here. For now, this hook focuses on core AI config atoms.
    }
  };

  return {
    selectedProvider,
    setSelectedProvider: (provider: AIProvider | null) => setSelectedProviderAtom(provider),
    apiKey,
    setApiKey: (key: string) => setApiKeyAtom(key),
    aiFeaturesEnabled,
    setAiFeaturesEnabled, // This is the enhanced setter
    apiKeyDocUrl, // Add new property
  };
}
