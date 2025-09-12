import { useCallback, useMemo, useState } from "react";
import { ModelConfig, MODELS } from "../util/models-config";
import { doesBrowserSupportTransformersJS, transformersJS, TransformersUIMessage } from "@built-in-ai/transformers-js";
import { TransformersChatTransport } from "../util/transformers-chat-transport";
import toast from "react-hot-toast";
import { useChat } from "@ai-sdk/react";
import { usePGlite } from "@/providers/pglite.provider";
import { DocumentProcessor } from "../util/document-processor";

export function useClientRag() {
    const [availableModels] = useState(MODELS);
    const [modelConfig, setModelConfig] = useState<ModelConfig>(availableModels[0]);
    const supportsTransformerJs = useMemo(() => doesBrowserSupportTransformersJS(), []);
    const db = usePGlite();
    const documentProcessor = useMemo(() => new DocumentProcessor(db), [db]);

    const chatTransport = useMemo(() => {
        const { id, name, ...modelOptions } = modelConfig;

        const model = transformersJS(modelConfig.id, {
            ...modelOptions,
            worker: new Worker(new URL("../util/worker.ts", import.meta.url), {
                type: "module",
            }),
        });
        return new TransformersChatTransport(model, documentProcessor); // Client side chat transport
    }, [modelConfig, documentProcessor]);

    const { error, status, sendMessage, messages, regenerate, stop } = useChat<TransformersUIMessage>({
        transport: chatTransport, // use custom transport
        onError(error) {
            toast.error(error.message);
        },
        experimental_throttle: 50,
        id: `chat-client-${modelConfig.id}`,
    });

    const uploadRagDocuments = useCallback(async (files: File[] | FileList)=> {
        if (!documentProcessor) throw new Error("Document processor not initialized");

        await documentProcessor.processAndStoreFiles(files);

    }, [documentProcessor]);

    return {
        availableModels,
        modelConfig,
        setModelConfig,
        supportsTransformerJs,
        error,
        status,
        messages,
        regenerate,
        stop,
        sendMessage,
        uploadRagDocuments
    }
}