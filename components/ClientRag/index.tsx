import { useRef, useState } from "react";
import { IoClose, IoCopySharp } from "react-icons/io5";
import { FiRefreshCcw } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { TbDatabaseStar } from "react-icons/tb";
import { LuFilePlus2 } from "react-icons/lu";
import { Conversation, ConversationContent, ConversationScrollButton } from "./ai/conversation";
import { Loader } from "./ai/loader";
import { Message, MessageAvatar, MessageContent } from "./ai/message";
import { Progress } from "../progress";
import { AudioFileDisplay } from "../audio-file-display";
import { Response } from "./ai/response";
import { Button } from "../Button";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./ai/reasoning";
import { PromptInput, PromptInputModelSelect, PromptInputModelSelectContent, PromptInputModelSelectItem, PromptInputModelSelectTrigger, PromptInputModelSelectValue, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar, PromptInputTools } from "./ai/prompt-input";
import ErrorCard from "../ErrorCard";
import { useClientRag } from "./hooks/use-client-rag";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../Dialog";
import FileUploader from "../FileUploader";
import toast from "react-hot-toast";
import { RagSources } from "./ai/rag-sources";

function ClientRag() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ragState, setRagState] = useState<{
    ragFiles: File[],
    isUploading: boolean,
    isDialogOpen: boolean
  }>({
    ragFiles: [],
    isUploading: false,
    isDialogOpen: false
  });
  const RAG_UPLOAD_FILE_SIZE_MB = 20;

  const {
    availableModels,
    modelConfig,
    setModelConfig,
    supportsTransformerJs,
    error,
    status,
    sendMessage,
    uploadRagDocuments,
    messages,
    regenerate,
    stop,
  } = useClientRag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || files) && status === "ready") {
      sendMessage({
        text: input,
        files,
      });
      setInput("");
      setFiles(undefined);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (files) {
      const dt = new DataTransfer();
      Array.from(files).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file);
        }
      });
      setFiles(dt.files);

      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
      }
    }
  };

  const copyMessageToClipboard = (message: any) => {
    const textContent = message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n");

    navigator.clipboard.writeText(textContent);
  };

  const handleKnowledgebaseUpload = async () => {

    try {
      setRagState(prev => ({
        ...prev,
        isUploading: true,
      }));
      await uploadRagDocuments(ragState.ragFiles);
      setRagState({
        ragFiles: [],
        isUploading: false,
        isDialogOpen: false
      });
      toast.success('Files uploaded successfully!');
    } catch(err){
      console.error(err);
      toast.error('Error uploading files.');
    } finally {
      setRagState(prev => ({
        ...prev,
        isUploading: false,
      }));
    }
  }

  if (!supportsTransformerJs) return (
    <ErrorCard message="Your browser does not support Transformers.js. Please try a different browser." />
  );

  return (
    <div className="flex flex-col h-[calc(90dvh)] max-w-4xl mx-auto">

      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-xs">AI Rag</p>
          <h1 className="text-lg font-medium">
            Using Transformers.js client-side
          </h1>
          <p className="text-sm max-w-xs">
            Switch model at the bottom of this page
          </p>
        </div>
      )}
      <Conversation className="flex-1 no-scrollbar [&>*:first-child]:no-scrollbar">
        <ConversationContent>
          {messages.map((m, index) => (
            <Message
              from={m.role === "system" ? "assistant" : m.role}
              key={m.id}
            >
              <MessageContent className="no-scrollbar">
                {/* Handle download progress parts first */}
                {m.parts
                  .filter((part) => part.type === "data-modelDownloadProgress")
                  .map((part: any, partIndex) => {
                    // Only show if message is not empty (hiding completed/cleared progress)
                    if (!part.data.message) return null;

                    // Don't show the entire div when actively streaming
                    if (status === "ready") return null;

                    return (
                      <div key={partIndex}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-1">
                            <Loader className="size-4 " />
                            {part.data.message}
                          </span>
                        </div>
                        {part.data.status === "downloading" &&
                          part.data.progress !== undefined && (
                            <Progress value={part.data.progress} />
                          )}
                      </div>
                    );
                  })}

                {/* Handle file parts */}
                {m.parts
                  .filter((part) => part.type === "file")
                  .map((part: any, partIndex) => {
                    if (part.mediaType?.startsWith("image/")) {
                      return (
                        <div key={partIndex} className="mt-2">
                          <img
                            src={part.url}
                            width={300}
                            height={300}
                            alt={part.filename || "Uploaded image"}
                            className="object-contain max-w-sm rounded-lg border"
                          />
                        </div>
                      );
                    }

                    if (part.mediaType?.startsWith("audio/")) {
                      return (
                        <AudioFileDisplay
                          key={partIndex}
                          fileName={part.filename!}
                          fileUrl={part.url}
                        />
                      );
                    }

                    // TODO: Handle other file types
                    return null;
                  })}

                {/* Handle reasoning */}
                {m.parts
                  .filter((part) => part.type === "reasoning")
                  .map((part: any, partIndex) => (
                    <Reasoning
                      key={`${m.id}-${partIndex}`}
                      className="w-full"
                      isStreaming={
                        status === "streaming" && index === messages.length - 1
                      }
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  ))}

                {/* Handle text parts */}
                {m.parts
                  .filter((part) => part.type === "text")
                  .map((part: any, partIndex) => (
                    <Response key={partIndex} responseText={part.text} />
                  ))}

                {/* Handle sources */}
                {m?.metadata &&  <RagSources metadata={m.metadata} />}

                {/* Action buttons for assistant messages */}
                {(m.role === "assistant" || m.role === "system") &&
                  index === messages.length - 1 &&
                  status === "ready" && (
                    <div className="flex gap-1 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessageToClipboard(m)}
                      >
                        <IoCopySharp />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => regenerate()}
                      >
                        <FiRefreshCcw />
                      </Button>
                    </div>
                  )}
              </MessageContent>
              <MessageAvatar name={m.role} src={m.role === "user" ? "" : ""} />
            </Message>
          ))}

          {/* Loading state */}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex gap-1 items-center text-base-content">
                  <Loader className="size-4" />
                  Thinking...
                </div>
              </MessageContent>
              <MessageAvatar name="assistant" src="" />
            </Message>
          )}

          {/* Error state */}
          {error && (
            <ErrorCard
              message="An error occurred."
              retryConfig={{ onRetry: () => regenerate(), retryDisabled: status === "streaming" || status === "submitted" }} />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4">
        <PromptInput
          onSubmit={handleSubmit}
          className="bg-base-100 rounded-lg"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"What would you like to know?"}
            minHeight={48}
            maxHeight={164}
          />
          <PromptInputToolbar>
            <PromptInputTools>

              <div className="dropdown dropdown-top">
                <div tabIndex={0} role="button" className="btn btn-ghost"><AiOutlinePlus size={16} /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow border">
                  <li onClick={e => {
                    e.preventDefault();
                    fileInputRef.current?.click()
                  }}><a><LuFilePlus2 /> Attach file to chat</a></li>
                  <li onClick={e => {
                    e.preventDefault();
                  }}>
                    <Dialog open={ragState.isDialogOpen} onOpenChange={isOpen => {
                      setRagState(prev=> ({
                        ...prev,
                        isDialogOpen: isOpen,
                        ragFiles: isOpen ? prev.ragFiles : [],
                      }));
                    }}>
                      <DialogTrigger asChild><a> <TbDatabaseStar /> Add file knowledge</a></DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="mb-4">
                          <DialogTitle className="flex justify-start items-center gap-2"><TbDatabaseStar size={25} /> Add to knowledge base</DialogTitle>
                          <DialogDescription>
                            Upload PDF or TXT files (max {RAG_UPLOAD_FILE_SIZE_MB}MB each) to add to the knowledge base.
                          </DialogDescription>
                        </DialogHeader>
                        <FileUploader
                          maxSize={RAG_UPLOAD_FILE_SIZE_MB * 1024 * 1024}
                          acceptedFileTypes={{
                            'application/pdf': ['.pdf'],
                            'text/plain': ['.txt'],
                          }}
                          onFilesUploaded={(newFiles) => {
                            setRagState(prev => ({
                              ...prev,
                              ragFiles: [...prev.ragFiles, ...newFiles],
                            }));
                          }}
                          onFileRemove={(removedFile) => {
                            setRagState(prev => ({
                              ...prev,
                              ragFiles: prev.ragFiles.filter((f) => f !== removedFile),
                            }));
                          }}
                          values={ragState.ragFiles}
                        />

                        <DialogFooter className="mt-4">
                          <Button type="button" disabled={ragState.ragFiles.length === 0 || ragState.isUploading} isLoading={ragState.isUploading} onClick={handleKnowledgebaseUpload}>
                            Upload Files
                          </Button>
                          <DialogClose asChild>
                            <Button type="button" variant="ghost" className="">
                              Close
                            </Button>
                          </DialogClose>

                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                </ul>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,text/*,audio/*"
                className="hidden"
              />

              <PromptInputModelSelect
                onValueChange={(modelId) => {
                  const selectedModel = availableModels.find((m) => m.id === modelId);
                  if (selectedModel) setModelConfig(selectedModel);
                }}
                value={modelConfig.id}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {availableModels.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={
                status === "ready" &&
                !input.trim() &&
                (!files || files.length === 0)
              }
              status={status}
              onClick={
                status === "submitted" || status === "streaming"
                  ? stop
                  : undefined
              }
              type={
                status === "submitted" || status === "streaming"
                  ? "button"
                  : "submit"
              }
            />
          </PromptInputToolbar>

          {/* File preview area - moved inside the form */}
          {files && files.length > 0 && (
            <div className="w-full flex px-2 p-2 gap-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="relative bg-base-200/30 flex w-fit flex-col gap-2 p-1 border-t border-x rounded-md"
                >
                  {file.type.startsWith("image/") ? (
                    <div className="flex text-sm">
                      <img
                        width={100}
                        height={100}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-auto rounded-md w-auto max-w-[100px] max-h-[100px]"
                      />
                    </div>
                  ) : file.type.startsWith("audio/") ? (
                    <div className="flex text-sm flex-col">
                      <audio src={URL.createObjectURL(file)} className="hidden">
                        Your browser does not support the audio element.
                      </audio>
                      <span className="text-xs text-gray-500 truncate max-w-[100px]">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex text-sm">
                      <span className="text-xs truncate max-w-[100px]">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-1.5 -right-1.5 text-white cursor-pointer bg-red-500 hover:bg-red-600 w-4 h-4 rounded-full flex items-center justify-center"
                    type="button"
                  >
                    <IoClose className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </PromptInput>
      </div>
    </div>
  );
}

export default ClientRag;
