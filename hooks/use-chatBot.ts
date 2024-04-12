import { useEffect, useMemo, useRef } from "react";
import { useStateWithPartialUpdates } from "./use-stateWithPartialUpdate";

const DEFAULT_ANSWER = `Apologies, I didn't quite grasp your query. Could you reformulate it or ask something else?`

export function useChatbot(onBotResponse : (botResponse : string)=> void){
    const workerRef = useRef<Worker>();

	const [{ready, progress, aiModelLoaded} , setChatbotState] = useStateWithPartialUpdates({
		ready : false ,
		progress : 0 ,
		aiModelLoaded : false
	})

    useEffect(() => {
		workerRef.current = new Worker(new URL('./../ai.worker.ts', import.meta.url));
		
		const onMessageReceived = (event: MessageEvent) => {

			switch (event.data.status) {
				case 'initiate':
					setChatbotState({ready : false});
					break;
				case 'ready':
					setChatbotState({ready : true});
					break;
				case 'progress':
					setChatbotState({progress : event.data.progress});
					break;
				case 'evaluating':
					setChatbotState({ready : false});
					break;
				case 'complete':
					setChatbotState({
						ready : true ,
						...(!aiModelLoaded) && {aiModelLoaded : true}
					});
                    onBotResponse(event.data.output.answer || DEFAULT_ANSWER);
					break;
			}

		};
		
		// Attach the callback function as an event listener.
		workerRef.current.addEventListener('message', onMessageReceived);

		return () => {
			workerRef.current?.terminate();
		}
	}, []);

    const sendMessage = (message : string)=> {
        workerRef.current?.postMessage({ text: message });
    }

    const isBotLoadingResponse = useMemo(
		()=> Boolean(progress) && (!ready || !aiModelLoaded), 
		[ready, progress, aiModelLoaded]
	);

    return {
        isChatReady : ready ,
        progress ,
        isBotLoadingResponse,
        sendMessage
    }
}