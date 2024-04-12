import { FC, FormEvent, useState } from "react";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { RiRobot2Line, RiUser3Fill } from "react-icons/ri";
import { TbWriting } from "react-icons/tb";
import { ChatMessage } from "@/types";
import { cn } from "@/utils";
import { useChatScroll } from "@/hooks/use-chatScroll";
import { useChatbot } from "@/hooks/use-chatBot";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover"

const ChatMessageRow : FC<ChatMessage & {isBotLoading ?: boolean}>= (props)=> {

    const isBotMessage = props.from === 'bot';

    const Icon = isBotMessage ?  RiRobot2Line : RiUser3Fill;

    return (
        <div className={cn("chat", isBotMessage ? 'chat-start' : 'chat-end')}>
            <div className="chat-image avatar">
                <Icon size={30} />
            </div>
            <div className="chat-bubble">
                {props?.isBotLoading ? <TbWriting size={20} className="animate-bounce"/> : <>{props.body}</>}
            </div>
        </div>
    );
}

const Chatbot = ()=> {

    const [messages , setMessages] = useState<ChatMessage[]>([{
        from : 'bot',
        body : 'Ask me something!'
    }]);

    const {isBotLoadingResponse, sendMessage} = useChatbot((botResponse => {
        setMessages(prevMessages => [...prevMessages , {from : 'bot', body : botResponse}]);
    }));

    const messagesContainer = useChatScroll([messages , isBotLoadingResponse]);

    const onSubmitMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const message = new FormData(e.currentTarget).get('message') as string;

        setMessages(prevMessages => [...prevMessages , {from : 'user', body : message}]);

        e.currentTarget.reset();

        sendMessage(message);
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild className="fixed bottom-4 right-1 sm:bottom-10 sm:right-6 z-100">
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

                    <div ref={messagesContainer} className="h-[200px] overflow-y-auto scrollbar">
                        {messages.map((message,i)=> <ChatMessageRow key={i} from={message.from} body={message.body} />)}
                        {isBotLoadingResponse 
                            ? <ChatMessageRow from={'bot'} body={''} isBotLoading />
                            : null
                        }
                    </div>

                    <form className="flex items-center justify-center w-full space-x-2" onSubmit={onSubmitMessage}>
                        <input type="text" name="message" placeholder="Type your question" required autoComplete="off" className="input input-bordered w-full max-w-xs" />
                        <button className="btn btn-neutral btn-square" type="submit">
                            <IoSendSharp />
                        </button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Chatbot