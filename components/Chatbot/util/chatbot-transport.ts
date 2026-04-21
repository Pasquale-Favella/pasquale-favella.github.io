import {
  ChatTransport,
  UIMessageChunk,
  streamText,
  convertToModelMessages,
  ChatRequestOptions,
  createUIMessageStream,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from "ai";
import {
  TransformersJSLanguageModel,
  TransformersUIMessage,
} from "@browser-ai/transformers-js";

export interface ChatbotTransportOptions {
  systemPrompt: string;
}

/**
 * Client-side chat transport for the portfolio chatbot.
 * Uses granite model with a system prompt containing personal context.
 */
export class ChatbotTransport
  implements ChatTransport<TransformersUIMessage>
{
  private readonly model: TransformersJSLanguageModel;
  private readonly systemPrompt: string;

  constructor(model: TransformersJSLanguageModel, options: ChatbotTransportOptions) {
    this.model = model;
    this.systemPrompt = options.systemPrompt;
  }

  async sendMessages(
    options: {
      chatId: string;
      messages: TransformersUIMessage[];
      abortSignal: AbortSignal | undefined;
    } & {
      trigger: "submit-message" | "submit-tool-result" | "regenerate-message";
      messageId: string | undefined;
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk>> {
    const { messages, abortSignal } = options;
    const prompt = await convertToModelMessages(messages);
    const model = this.model;

    return createUIMessageStream<TransformersUIMessage>({
      execute: async ({ writer }) => {
        let downloadProgressId: string | undefined;
        const availability = await model.availability();

        if (availability !== "available") {
          await model.createSessionWithProgress((progress) => {
            const percent = Math.round(progress * 100);

            if (progress >= 1) {
              if (downloadProgressId) {
                writer.write({
                  type: "data-modelDownloadProgress",
                  id: downloadProgressId,
                  data: {
                    status: "complete",
                    progress: 100,
                    message: "Model ready!",
                  },
                });
              }
              return;
            }

            if (!downloadProgressId) {
              downloadProgressId = `download-${Date.now()}`;
            }

            writer.write({
              type: "data-modelDownloadProgress",
              id: downloadProgressId,
              data: {
                status: "downloading",
                progress: percent,
                message: `Downloading AI model... ${percent}%`,
              },
              transient: !downloadProgressId,
            });
          });
        }

        const result = streamText({
          model: wrapLanguageModel({
            model,
            middleware: extractReasoningMiddleware({
              tagName: "think",
            }),
          }),
          system: this.systemPrompt,
          messages: prompt,
          abortSignal,
          onChunk: (event) => {
            if (event.chunk.type === "text-delta" && downloadProgressId) {
              writer.write({
                type: "data-modelDownloadProgress",
                id: downloadProgressId,
                data: { status: "complete", progress: 100, message: "" },
              });
              downloadProgressId = undefined;
            }
          },
        });

        writer.merge(result.toUIMessageStream({
          sendStart: false,
        }));
      },
    });
  }

  async reconnectToStream(
    _options: {
      chatId: string;
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk> | null> {
    return null;
  }
}
