import { useRef, ChangeEvent } from 'react';
import { useTesseract } from '@/hooks/use-tesseract';
import { useStateWithPartialUpdates } from '@/hooks/use-stateWithPartialUpdate';
import { BiErrorCircle } from 'react-icons/bi';

type OcrResult = {
    textResult: string;
    hasError: boolean;
    searchUrl: string;
    isLoading: boolean;
    isSearchFromUrl: boolean;
    confidence: number;
    imgSrc : string;
}

const DEFAULT_OCR: OcrResult = {
    hasError: false,
    searchUrl: '',
    textResult: '',
    isLoading: false,
    isSearchFromUrl: false,
    confidence: 0 ,
    imgSrc : ''
}

const Ocr = () => {

    const [ocrResult, handleOcrStateChange] = useStateWithPartialUpdates(DEFAULT_OCR);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const { recognizeWorker, imagePreprocess } = useTesseract();

    const isFromUrlDisabled = ocrResult.isSearchFromUrl && !Boolean(ocrResult.searchUrl);
    const isFromFileDisabled = !ocrResult.isSearchFromUrl && !Boolean(ocrResult.imgSrc);

    const isConvertDisabled = ocrResult.isLoading || isFromUrlDisabled || isFromFileDisabled;

    const handleFileChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files || !files[0]) return;
        const fileToRead = files[0];
        const image = imageRef.current as HTMLImageElement;
        const imgSrc = URL.createObjectURL(fileToRead);
        handleOcrStateChange({imgSrc});
        image.src = imgSrc;
    }

    const handleFromFile = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const image = imageRef.current as HTMLImageElement;

        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(image, 0, 0);
        ctx?.putImageData(imagePreprocess(canvas), 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");

        return dataUrl;
    }

    const handleConversionFrom = (e: ChangeEvent<HTMLInputElement>) => handleOcrStateChange({
        ...DEFAULT_OCR,
        isSearchFromUrl: e.target.checked
    });

    const handleClick = () => {
        const dataUrl = ocrResult.isSearchFromUrl ? ocrResult.searchUrl : handleFromFile();

        handleOcrStateChange({ isLoading: true, hasError: false, textResult: '' })

        recognizeWorker({ image: dataUrl })
            .catch(_err => handleOcrStateChange({ hasError: true }))
            .then(result => {
                if (!result) return;
                handleOcrStateChange({
                    textResult: result.data.text,
                    confidence: result.data.confidence
                })
            })
            .finally(() => handleOcrStateChange({ isLoading: false }))
    }

    return (

        <section className="flex flex-col items-center justify-start mx-auto prose md:prose-lg lg:prose-xl">

            <img ref={imageRef} hidden />
            <canvas ref={canvasRef} hidden></canvas>

            <div className='flex flex-col gap-2 w-full md:w-1/2 max-w-80'>

                <input hidden={!ocrResult.isSearchFromUrl} type="url" placeholder="Type image url here" className="input input-bordered w-full" value={ocrResult.searchUrl} onChange={(e) => handleOcrStateChange({ searchUrl: e.target.value })} />
                <input hidden={ocrResult.isSearchFromUrl} type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleFileChange} />

                <div className='w-full flex justify-between items-center gap-5'>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={ocrResult.isSearchFromUrl}
                                onChange={handleConversionFrom}
                            />
                            <span className="label-text">convert from url</span>
                        </label>
                    </div>

                    <button className="btn" onClick={handleClick} disabled={isConvertDisabled}>
                        {ocrResult.isLoading && <span className="loading loading-spinner"></span>}
                        Convert
                    </button>
                </div>
            </div>

            {ocrResult.textResult
                && <div className="card w-full mt-2 bg-base-200 shadow-xl">
                    <div className="card-body">
                        <div className="card-actions justify-start">
                            <div className="badge badge-outline">confidence {ocrResult.confidence}%</div>
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: ocrResult.textResult }} />
                    </div>
                </div>
            }

            {ocrResult.hasError 
                && <div className='flex w-full flex-1 items-center justify-start rounded-lg border border-error p-4 sm:px-6 mt-2'>
                    <BiErrorCircle size={50} className='text-error'/> 
                    <div className='px-4'>
                        <p>An issue occurred. Please make another attempt or consider altering the image.</p>
                    </div>      
                </div>
            }

        </section>
    );
}

export default Ocr