import { useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { ConverterAction } from "@/types";
import { ConverterUtils } from "@/utils";
import { useStateWithPartialUpdates } from "./use-stateWithPartialUpdate";

type UseConverterProps = { }

type UseConverterState = {
    isFFmpegLoaded : boolean ,
    ffmpeg : FFmpeg | null
}

export const useConverter = (props?: UseConverterProps) => {
    const [{ffmpeg , isFFmpegLoaded}, setConverterState] = useStateWithPartialUpdates<UseConverterState>({
        ffmpeg : null ,
        isFFmpegLoaded : false
    });

    useEffect(() => {
        ConverterUtils.loadFFmpeg().then((ffmpeg)=> {
            if(isFFmpegLoaded) return;
            setConverterState({ ffmpeg, isFFmpegLoaded: true });
        });
    }, []);

    const convertFile = (action : ConverterAction)=> ConverterUtils.convert(ffmpeg!, action);

    return {
        isFFmpegLoaded ,
        ffmpeg ,
        convertFile 
    }
}