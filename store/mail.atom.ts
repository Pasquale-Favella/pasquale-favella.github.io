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

const initialContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your New Email Editor!</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 25px;
            font-size: 28px;
        }
        p {
            margin-bottom: 15px;
            font-size: 16px;
        }
        ul {
            list-style-type: disc;
            padding-left: 25px;
            margin-bottom: 20px;
        }
        ul li {
            margin-bottom: 10px;
            font-size: 16px;
        }
        ul li p {
            margin: 0; /* Remove default paragraph margin inside list items */
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to your new email editor!</h1>
        <p>This is a sample email to get you started. You can edit this content, or start from scratch.</p>
        <p>Here are a few things you can do:</p>
        <ul>
            <li><p>Use the AI assistant to help you write and edit your emails.</p></li>
            <li><p>Directly edit the underlying HTML code, similar to a professional code editor like VS Code.</p></li>
        </ul>
        <p>Happy emailing!</p>
        <div class="footer">
            <p>This email was sent from your new email editor.</p>
        </div>
    </div>
</body>
</html>`;

export const mailContentAtom = atom<string>(initialContent);
export const mailContentHistoryAtom = atom<string[]>([initialContent]);
export const mailContentHistoryIndexAtom = atom<number>(0);

export const mailContentWithHistoryAtom = atom(
  (get) => get(mailContentAtom),
  (get, set, newContent: string) => {
    const history = get(mailContentHistoryAtom);
    const index = get(mailContentHistoryIndexAtom);

    // If we are not at the end of the history, truncate the history
    // before adding new content (i.e., if user went back and then generated new content)
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newContent);

    set(mailContentHistoryAtom, newHistory);
    set(mailContentHistoryIndexAtom, newHistory.length - 1);
    set(mailContentAtom, newContent);
  }
);

export const mailSystemPromptAtom = atom<string>(
  `You are a specialized AI assistant for editing email templates in HTML format. Your sole purpose is to return a valid HTML string based on the user's instructions.

You will be given an existing HTML string representing an email template. Your task is to modify this HTML based on the user's prompt and return the complete, updated HTML string.

You MUST return a single, valid HTML string. Do NOT include any introductory text, explanations, or markdown formatting around the HTML.

Based on the user's prompt and the provided HTML, modify the content to reflect the requested changes. You can add, remove, or update HTML elements as needed. The final output must be ONLY the complete, modified HTML string.`
);
