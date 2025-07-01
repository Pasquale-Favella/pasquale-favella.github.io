import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const mailProviders = ['openai', 'anthropic', 'google'] as const;
export type MailProvider = (typeof mailProviders)[number];

export const providerModels: Record<MailProvider, string[]> = {
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

export const providerLinks: Record<MailProvider, string> = {
  openai: 'https://platform.openai.com/account/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  google: 'https://aistudio.google.com/app/apikey',
};

export const mailProviderAtom = atomWithStorage<MailProvider>('mail-provider', 'google');
export const mailModelAtom = atomWithStorage<string>('mail-model', providerModels.google[1]);
export const mailApiKeyAtom = atomWithStorage<string>('mail-api-key', '');
export const mailContentAtom = atom<string>(
  `<h1>Welcome to your new email editor!</h1><p>This is a sample email to get you started. You can edit this content, or start from scratch.</p><p>Here are a few things you can do:</p><ul><li><p>Use the toolbar to format your text (bold, italics, etc.)</p></li><li><p>Add headings, lists, and other elements.</p></li><li><p>Use the AI assistant to help you write and edit your emails.</p></li></ul><p>Happy emailing!</p>`
);
export const mailSystemPromptAtom = atom<string>(
  `You are a specialized AI assistant for editing email templates in HTML format. Your sole purpose is to return a valid HTML string based on the user's instructions.

You will be given an existing HTML string representing an email template. Your task is to modify this HTML based on the user's prompt and return the complete, updated HTML string.

You MUST return a single, valid HTML string. Do NOT include any introductory text, explanations, or markdown formatting around the HTML.

Based on the user's prompt and the provided HTML, modify the content to reflect the requested changes. You can add, remove, or update HTML elements as needed. The final output must be ONLY the complete, modified HTML string.`
);
