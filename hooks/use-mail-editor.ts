import { useAtom } from 'jotai';
import {
  mailProviderAtom,
  mailModelAtom,
  mailApiKeyAtom,
  mailContentAtom,
  mailSystemPromptAtom,
  providerModels,
  MailProvider,
} from '@/store/mail.atom';
import { useCallback } from 'react';

export const useMailEditor = () => {
  const [provider, setProvider] = useAtom(mailProviderAtom);
  const [model, setModel] = useAtom(mailModelAtom);
  const [apiKey, setApiKey] = useAtom(mailApiKeyAtom);
  const [content, setContent] = useAtom(mailContentAtom);
  const [systemPrompt, setSystemPrompt] = useAtom(mailSystemPromptAtom);

  const handleProviderChange = useCallback(
    (newProvider: MailProvider) => {
      setProvider(newProvider);
      setModel(providerModels[newProvider][0]);
    },
    [setProvider, setModel]
  );

  return {
    provider,
    model,
    apiKey,
    content,
    systemPrompt,
    handleProviderChange,
    setModel,
    setApiKey,
    setContent,
    setSystemPrompt,
  };
};
