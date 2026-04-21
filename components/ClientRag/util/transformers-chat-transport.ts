import {
  ChatTransport,
  UIMessageChunk,
  streamText,
  convertToModelMessages,
  ChatRequestOptions,
  createUIMessageStream,
  wrapLanguageModel,
  extractReasoningMiddleware,
  tool,
  stepCountIs,
} from "ai";
import {
  TransformersJSLanguageModel,
  TransformersUIMessage,
} from "@browser-ai/transformers-js";
import { z } from "zod";
import { DocumentProcessor } from "./document-processor";

/**
 * System prompt that guides the LLM on when and how to use the searchDocuments tool
 */
const SYSTEM_PROMPT = `You are a helpful assistant with access to a document retrieval system. You have the ability to search through uploaded documents to find relevant information and provide accurate, well-informed answers.

When the user asks questions that require looking up information from documents, use the searchDocuments tool to retrieve relevant content. The tool will return documents with their titles, snippets, and relevance scores.

Use the searchDocuments tool when:
- The user asks specific questions that require factual information from documents
- The user mentions documents or specific topics they want you to search for
- You're uncertain about details and need to verify them in the knowledge base
- The user asks "what documents" or "find information about" something

Present the search results to the user along with your answers, citing the relevant documents when applicable. Always prioritize accuracy by using the search tool rather than relying on general knowledge when documents are available.`;

/**
 * Create the searchDocuments tool for LLM-driven document retrieval
 */
const createTools = (documentProcessor: DocumentProcessor) => ({
  searchDocuments: tool({
    description: "Search the knowledge base for relevant documents based on a query. Use this when you need to find information from uploaded documents to answer user questions.",
    inputSchema: z.object({
      query: z.string().describe(
        "The search query to find relevant documents in the knowledge base"
      ),
    }),
    needsApproval: false,
    execute: async ({ query }) =>
      await documentProcessor.searchSimilarDocuments(query),
  }),
});

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
  private tools: ReturnType<typeof createTools>;

  constructor(model: TransformersJSLanguageModel, documentProcessor: DocumentProcessor) {
    this.model = model;
    this.tools = createTools(documentProcessor);
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
          system: SYSTEM_PROMPT,
          tools: this.tools,
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
          sendStart: false,
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
