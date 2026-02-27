import {
  ChatTransport,
  UIMessageChunk,
  streamText,
  convertToModelMessages,
  ChatRequestOptions,
  createUIMessageStream,
  wrapLanguageModel,
  extractReasoningMiddleware,
  stepCountIs,
} from "ai";
import {
  TransformersJSLanguageModel,
  TransformersUIMessage,
} from "@browser-ai/transformers-js";
import { DocumentProcessor } from "./document-processor";

/**
 * Client-side chat transport AI SDK implementation that handles AI model communication
 * with in-browser AI capabilities.
 *
 * @implements {ChatTransport<TransformersUIMessage>}
 */
export class TransformersChatTransport
  implements ChatTransport<TransformersUIMessage>
{
  private readonly model: TransformersJSLanguageModel;
  private readonly documentProcessor: DocumentProcessor;

  constructor(model: TransformersJSLanguageModel, documentProcessor: DocumentProcessor) {
    this.model = model;
    this.documentProcessor = documentProcessor;
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
    const {  messages, abortSignal } = options as any;

    const latestMessage = messages.at(-1)?.parts.find((p: any) => p.type === 'text')?.text;
    const relevantDocs = await this.documentProcessor.searchSimilarDocuments(latestMessage ?? '');
    const hasRelevantDocs = relevantDocs.length > 0;
    const knowledgeBase = relevantDocs
      .map(doc => `Context: ${doc.content}`)
      .join('\n\n');
    const prompt = await convertToModelMessages(messages);
    const model = this.model;

    const system = `You are a helpful assistant. Check your knowledge base before answering any questions.
    ${hasRelevantDocs ? `Only respond to questions based on the following knowledge base: ${knowledgeBase}` :``}
    if no relevant information is found, respond, "Sorry, I don't know."`;

    // Check if model is already available to skip progress tracking
    const availability = await model.availability();
    if (availability === "available") {
      const result = streamText({
        model: wrapLanguageModel({
          model,
          middleware: extractReasoningMiddleware({
            tagName: "think",
          }),
        }),
        messages: prompt,
        system,
        abortSignal: abortSignal,
      });
      return result.toUIMessageStream({
        messageMetadata: ({ part }) => {
          if (part.type === 'finish') {
            return {
              relevantDocs
            };
          }
        },
      });
    }

    return createUIMessageStream<TransformersUIMessage>({
      execute: async ({ writer }) => {
        let downloadProgressId: string | undefined;
        const availability = await model.availability();

        // Only track progress if model needs downloading
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
                    message:
                      "Model finished downloading! Getting ready for inference...",
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
                message: `Downloading browser AI model... ${percent}%`,
              },
              transient: !downloadProgressId, // transient only on first write
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
          stopWhen: stepCountIs(5),
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
          sendStart: false ,
           messageMetadata: ({part}) => {
              if (part.type === 'finish') {
                return {
                  relevantDocs
                } as any as undefined;
              }
            },
        }));
      },
    });
  }

  async reconnectToStream(
    options: {
      chatId: string;
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk> | null> {
    // Client-side AI doesn't support stream reconnection
    return null;
  }
}
