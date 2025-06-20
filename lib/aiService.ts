import { generateText, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AIProvider } from '@/store/aiConfig.atom';
import { BlockToolData } from '@editorjs/editorjs'; // Ensure BlockToolData is imported

const BASE_SYSTEM_PROMPT = `You are an expert email marketing copywriter and designer. Your goal is to help users craft effective, engaging, and well-formatted email templates.
When asked to generate content blocks, provide a valid JSON array of objects, where each object represents a block.
Each block object must have a "type" (string) and a "data" (object) property.
Supported block types and their data structures:
- type: "header", data: { "text": "Your header content", "level": 1-6 }
- type: "paragraph", data: { "text": "Your paragraph content." }
- type: "list", data: { "style": "ordered" | "unordered", "items": ["item1", "item2", ...] }
- type: "image", data: { "file": { "url": "image_url_here" }, "caption": "Image caption" } (use placeholder URLs if actual images are not provided in the prompt)
Respond with ONLY the JSON array when block generation is requested, without conversational fluff or explanations. For other text modifications or suggestions, respond with only the requested text.`;

interface AIServiceParams {
  prompt: string;
  provider: AIProvider;
  apiKey: string;
  modelName?: string; // Optional: to specify different models like gpt-4, gpt-3.5-turbo, etc.
}

// Define default models for each provider
const defaultModels: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: 'gpt-3.5-turbo',
  [AIProvider.Anthropic]: 'claude-3-haiku-20240307',
  [AIProvider.GoogleGemini]: 'gemini-pro',
};

export async function getAISuggestion({
  prompt,
  provider,
  apiKey,
  modelName,
}: AIServiceParams): Promise<string | null> {
  let modelInstance: LanguageModel;
  const resolvedModelName = modelName || defaultModels[provider];

  try {
    switch (provider) {
      case AIProvider.OpenAI:
        const openai = createOpenAI({ apiKey });
        modelInstance = openai(resolvedModelName);
        break;
      case AIProvider.Anthropic:
        const anthropic = createAnthropic({ apiKey });
        modelInstance = anthropic(resolvedModelName);
        break;
      case AIProvider.GoogleGemini:
        const google = createGoogleGenerativeAI({ apiKey });
        modelInstance = google(resolvedModelName);
        break;
      default:
        console.error('Unsupported AI provider:', provider);
        // Throw an error or return a specific error message for unsupported provider
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    const { text } = await generateText({
      model: modelInstance,
      prompt: prompt,
      system: BASE_SYSTEM_PROMPT,
    });
    return text;

  } catch (error) {
    console.error(`Error getting AI suggestion from ${provider} (${resolvedModelName}):`, error);
    if (error instanceof Error) {
      // It might be useful to return a more specific error message or re-throw
      // For now, returning a string with the error message
      return `Error from ${provider}: ${error.message}`;
    }
    return 'An unknown error occurred while fetching AI suggestion.';
  }
}

interface AITextEditParams {
  textToEdit: string;
  provider: AIProvider;
  apiKey: string;
  modelName?: string;
}

async function callTextEditingAI(
  basePrompt: string,
  { textToEdit, provider, apiKey, modelName }: AITextEditParams
): Promise<string | null> {
  let model: LanguageModel; // Changed modelInstance to model to match new function scope
  const selectedModelName = modelName || defaultModels[provider];
  const fullPrompt = `${basePrompt}

"${textToEdit}"`;

  try {
    switch (provider) {
      case AIProvider.OpenAI:
        const openai = createOpenAI({ apiKey }); // Re-declare openai for this scope
        model = openai(selectedModelName);
        break;
      case AIProvider.Anthropic:
        const anthropic = createAnthropic({ apiKey }); // Re-declare anthropic
        model = anthropic(selectedModelName);
        break;
      case AIProvider.GoogleGemini:
        const google = createGoogleGenerativeAI({ apiKey }); // Re-declare google
        model = google(selectedModelName);
        break;
      default:
        console.error('Unsupported AI provider:', provider);
        return `Error: Unsupported AI provider: ${provider}`; // Return error string
    }

    const { text } = await generateText({
      model: model,
      prompt: fullPrompt,
      system: BASE_SYSTEM_PROMPT,
    });
    return text;

  } catch (error) {
    console.error(`Error performing AI text editing with ${provider} (${selectedModelName}):`, error);
    if (error instanceof Error) {
      return `Error from ${provider}: ${error.message}`;
    }
    return 'An unknown error occurred during AI text editing.';
  }
}

export async function rephraseTextAI(params: AITextEditParams): Promise<string | null> {
  return callTextEditingAI("Rephrase the following text concisely and clearly:", params);
}

export async function shortenTextAI(params: AITextEditParams): Promise<string | null> {
  return callTextEditingAI("Summarize the following text, making it significantly shorter while preserving its core meaning:", params);
}

export async function lengthenTextAI(params: AITextEditParams): Promise<string | null> {
  return callTextEditingAI("Expand on the following text, adding more relevant detail, examples, or explanation to make it more comprehensive:", params);
}

// New function for generating blocks
interface AIGenerateBlocksParams {
  userPrompt: string;
  provider: AIProvider;
  apiKey: string;
  modelName?: string;
}

export async function generateAIBlocks({
  userPrompt,
  provider,
  apiKey,
  modelName,
}: AIGenerateBlocksParams): Promise<{ blocks: BlockToolData[] | null; error?: string }> { // Using BlockToolData[]
  let model: LanguageModel;
  const selectedModelName = modelName || defaultModels[provider];

  const detailedPrompt = `
Based on the user's request, generate a JSON array of Editor.js blocks.
User request: "${userPrompt}"

Remember the supported block types: header, paragraph, list, image.
Ensure your output is ONLY the valid JSON array.
  `;

  try {
    switch (provider) {
      case AIProvider.OpenAI:
        model = createOpenAI({ apiKey })(selectedModelName);
        break;
      case AIProvider.Anthropic:
        model = createAnthropic({ apiKey })(selectedModelName);
        break;
      case AIProvider.GoogleGemini:
        model = createGoogleGenerativeAI({ apiKey })(selectedModelName);
        break;
      default:
        return { blocks: null, error: `Unsupported AI provider: ${provider}` };
    }

    const { text: aiResponse } = await generateText({
      model: model,
      prompt: detailedPrompt,
      system: BASE_SYSTEM_PROMPT,
    });

    try {
      const cleanedResponse = aiResponse.trim().replace(/^```json\s*|\s*```$/g, '');
      const parsedBlocks = JSON.parse(cleanedResponse);

      if (!Array.isArray(parsedBlocks)) {
        return { blocks: null, error: "AI response was not a JSON array." };
      }

      const validBlocks: BlockToolData[] = [];
      for (const block of parsedBlocks) {
        if (typeof block === 'object' && block !== null && 'type' in block && 'data' in block) {
          // Basic validation (can be expanded)
          if (block.type === 'header' && (!block.data.text || typeof block.data.level !== 'number')) {
            console.warn('Invalid header block structure from AI:', block);
            continue;
          }
          if (block.type === 'paragraph' && typeof block.data.text !== 'string') {
            console.warn('Invalid paragraph block structure from AI:', block);
            continue;
          }
          if (block.type === 'list' && (!block.data.items || !Array.isArray(block.data.items) || !block.data.style)) {
            console.warn('Invalid list block structure from AI:', block);
            continue;
          }
          if (block.type === 'image' && (!block.data.file || typeof block.data.file.url !== 'string' || typeof block.data.caption !== 'string')) {
            console.warn('Invalid image block structure from AI:', block);
            continue;
          }
          validBlocks.push({ id: `ai-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, ...block } as BlockToolData);
        } else {
          console.warn('Invalid block structure from AI:', block);
        }
      }

      if (validBlocks.length === 0 && parsedBlocks.length > 0) {
        return { blocks: null, error: "AI generated blocks, but none passed validation." };
      }
      if (validBlocks.length === 0) {
        return { blocks: null, error: "AI did not generate any valid blocks." };
      }

      return { blocks: validBlocks, error: undefined };

    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e, "\nRaw response:", aiResponse);
      return { blocks: null, error: "Failed to parse AI response. Ensure the AI returns a valid JSON array." };
    }

  } catch (error) {
    console.error('Error generating AI blocks:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { blocks: null, error: `AI service error: ${errorMessage}` };
  }
}
