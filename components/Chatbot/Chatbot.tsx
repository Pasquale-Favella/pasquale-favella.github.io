import { FormEvent } from "react";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { RiRobot2Line, RiUser3Fill } from "react-icons/ri";
import { TbWriting } from "react-icons/tb";
import { MdRefresh } from "react-icons/md";
import { cn } from "@/utils";
import { useChatbot } from "@/components/Chatbot/hooks/use-chatBot";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Response } from "@/components/ai/response";
import { Loader } from "@/components/ai/loader";
import { Progress } from "../progress";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai/conversation";

const Chatbot = () => {

    const {
        messages,
        status,
        isBotLoadingResponse,
        sendMessage,
        supportsTransformerJs,
        error,
        regenerate,
    } = useChatbot();

    const isInputDisabled = isBotLoadingResponse || !!error;

    const onSubmitMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const message = new FormData(e.currentTarget).get('message') as string;
        if (!message.trim()) return;

        e.currentTarget.reset();
        sendMessage(message);
    }

    if (!supportsTransformerJs) return null;

    return (
        <Popover>
            <PopoverTrigger asChild className="fixed bottom-4 right-1 sm:bottom-10 sm:right-6 z-50">
                <div className="tooltip tooltip-left before:text-xs before:content-[attr(data-tip)]" data-tip="ask a question">
                    <button className="btn btn-ghost btn-circle " >
                        <BsFillChatQuoteFill size={40}/>
                    </button>
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-96">
                <div className="grid gap-4">

                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Pakybot</h4>
                        <p className="text-sm text-base-content">
                            Ask some question about me
                        </p>
                    </div>

                    <Conversation className="h-[200px] no-scrollbar">
                        <ConversationContent>
                        {messages.length === 0 && (
                            <div className={cn("chat chat-start")}>
                                <div className="chat-image avatar">
                                    <RiRobot2Line size={30} />
                                </div>
                                <div className="chat-bubble bg-base-300 text-base-content">Ask me something!</div>
                            </div>
                        )}
                        {messages.map((message) => {
                            const isAssistant = message.role === "assistant" || message.role === "system";
                            const Icon = isAssistant ? RiRobot2Line : RiUser3Fill;

                            return (
                                <div key={message.id} className={cn("chat", isAssistant ? 'chat-start' : 'chat-end')}>
                                    <div className="chat-image avatar">
                                        <Icon size={30} />
                                    </div>
                                    <div className="chat-bubble bg-base-300 text-base-content">
                                        {/* Download progress */}
                                        {message.parts
                                            .filter((part) => part.type === "data-modelDownloadProgress")
                                            .map((part: any, i) => {
                                                if (!part.data.message || status === "ready") return null;
                                                return (
                                                    <div key={i}>
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <Loader className="size-3" />
                                                            <span className="text-xs">{part.data.message}</span>
                                                        </div>
                                                        {part.data.status === "downloading" && part.data.progress !== undefined && (
                                                            <Progress value={part.data.progress} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        {/* Text content */}
                                        {message.parts
                                            .filter((part) => part.type === "text")
                                            .map((part: any, i) => (
                                                <Response key={i} responseText={part.text} className="text-sm " />
                                            ))}
                                        {/* User content fallback */}
                                        {message.role === "user" && message.parts.filter(p => p.type === "text").length === 0 && (
                                            <>{(message as any).content}</>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {status === "submitted" && (
                            <div className={cn("chat chat-start")}>
                                <div className="chat-image avatar">
                                    <RiRobot2Line size={30} />
                                </div>
                                <div className="chat-bubble bg-base-300 text-base-content">
                                    <TbWriting size={20} className="animate-bounce"/>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className={cn("chat chat-start")}>
                                <div className="chat-image avatar">
                                    <RiRobot2Line size={30} />
                                </div>
                                <div className="chat-bubble chat-bubble-error">
                                    <p className="text-sm">Something went wrong.</p>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs mt-1 gap-1"
                                        onClick={() => regenerate()}
                                    >
                                        <MdRefresh size={14} />
                                        Retry
                                    </button>
                                </div>
                            </div>
                        )}
                        </ConversationContent>
                        <ConversationScrollButton className="btn-sm animate-bounce" />
                    </Conversation>

                    <form className="flex items-center justify-center w-full space-x-2" onSubmit={onSubmitMessage}>
                        <input
                            type="text"
                            name="message"
                            placeholder="Type your question"
                            required
                            autoComplete="off"
                            className="input input-bordered w-full max-w-xs"
                            disabled={isInputDisabled}
                        />
                        <button
                            className="btn btn-neutral btn-square"
                            type="submit"
                            disabled={isInputDisabled}
                        >
                            <IoSendSharp />
                        </button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Chatbot