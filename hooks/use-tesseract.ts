import imagePreprocess from '@/lib/imagePreprocess';
import Tesseract from 'tesseract.js';

type UseTesseractProps = {
    image: Tesseract.ImageLike,
    langs?: string | undefined,
    options?: Partial<Tesseract.WorkerOptions> | undefined
}

export const useTesseract = (props?: UseTesseractProps) => {

    const recognize = (input ?: UseTesseractProps) => {
        const image = input?.image ?? props?.image;
        const langs = input?.langs ?? props?.langs;

        if(!image) throw new Error(
            'Tesseract image is required'
        );

        return Tesseract.recognize(
            image,
            langs,
            input?.options ?? {
                logger: m => console.log({ m })
            }
        );
    }

    const recognizeWorker = async (input ?: UseTesseractProps) => {
        const image = input?.image ?? props?.image;
        const langs = input?.langs ?? props?.langs;

        if(!image) throw new Error('Tesseract image is required');

        const worker = await Tesseract.createWorker(langs);

        return await worker.recognize(image).finally(async ()=> {
            await worker.terminate();
        });
    }

    return {
        recognize ,
        recognizeWorker ,
        imagePreprocess
    }
}