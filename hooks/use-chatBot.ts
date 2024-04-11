import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_ANSWER = `Apologies, I didn't quite grasp your query. Could you reformulate it or ask something else?`

export function useChatbot(onBotResponse : (botResponse : string)=> void){
    const workerRef = useRef<Worker>();

    const [ready, setReady] = useState(false);
	const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
		workerRef.current = new Worker(new URL('./../ai.worker.ts', import.meta.url))
		
		const onMessageReceived = (event: MessageEvent) => {
            console.log(event.data)
			switch (event.data.status) {
				case 'initiate':
					setReady(false);
					break;
				case 'ready':
					setReady(true);
					break;
				case 'progress':
					setProgress(event.data.progress);
					break;
				case 'complete':
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

    const isBotLoadingResponse = useMemo(()=> progress && !ready , [ready,progress]);

    return {
        isChatReady : ready ,
        progress ,
        isBotLoadingResponse,
        sendMessage
    }
}