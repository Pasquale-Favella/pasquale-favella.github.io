import { useAtom } from 'jotai';
import {
  mailProviderAtom,
  mailModelAtom,
  mailApiKeyAtom,
  mailContentAtom,
  mailSystemPromptAtom,
  mailContentHistoryAtom,
  mailContentHistoryIndexAtom,
  mailContentWithHistoryAtom,
  providerModels,
  MailProvider,
} from '@/store/mail.atom';
import { useCallback } from 'react';

export const useMailEditor = () => {
  const [provider, setProvider] = useAtom(mailProviderAtom);
  const [model, setModel] = useAtom(mailModelAtom);
  const [apiKey, setApiKey] = useAtom(mailApiKeyAtom);
  const [mailContent, setMailContent] = useAtom(mailContentAtom);
  const [systemPrompt, setSystemPrompt] = useAtom(mailSystemPromptAtom);

  const [history, setHistory] = useAtom(mailContentHistoryAtom);
  const [historyIndex, setHistoryIndex] = useAtom(mailContentHistoryIndexAtom);
  const [, setContentWithHistory] = useAtom(mailContentWithHistoryAtom);

  const handleProviderChange = useCallback(
    (newProvider: MailProvider) => {
      setProvider(newProvider);
      setModel(providerModels[newProvider][0]);
    },
    [setProvider, setModel]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMailContent(history[newIndex]);
    }
  }, [history, historyIndex, setHistoryIndex, setMailContent]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMailContent(history[newIndex]);
    }
  }, [history, historyIndex, setHistoryIndex, setMailContent]);

  return {
    provider,
    model,
    apiKey,
    mailContent,
    systemPrompt,
    history,
    historyIndex,
    handleProviderChange,
    setModel,
    setApiKey,
    setMailContent,
    setSystemPrompt,
    setContentWithHistory,
    handleUndo,
    handleRedo,
    setHistoryIndex,
  };
};
