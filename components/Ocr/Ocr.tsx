import { useRef, ChangeEvent } from 'react';
import { useTesseract } from '@/hooks/use-tesseract';
import { useStateWithPartialUpdates } from '@/hooks/use-stateWithPartialUpdate';
import { RxCopy } from 'react-icons/rx';
import { TbUnlink } from 'react-icons/tb';
import ErrorCard from '@/components/ErrorCard';
import { MdOutlineImageSearch } from 'react-icons/md';
import InputWithIcon from '@/components/InputWithIcon';

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

    const isConvertFromUrlDisabled = ocrResult.isSearchFromUrl && !Boolean(ocrResult.searchUrl);
    const isConvertFromFileDisabled = !ocrResult.isSearchFromUrl && !Boolean(ocrResult.imgSrc);
    const isConvertDisabled = ocrResult.isLoading || isConvertFromUrlDisabled || isConvertFromFileDisabled;

    const handleFileChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files || !files[0]) return;
        handleOcrStateChange({imgSrc : URL.createObjectURL(files[0])});
    }

    const handleFromFile = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const image = imageRef.current as HTMLImageElement;

        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

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

                const outcome : Partial<OcrResult> = !Boolean(result?.data?.text) ? { hasError : true } : {
                    textResult: result.data.text,
                    confidence: result.data.confidence
                }

                handleOcrStateChange(outcome);
            })
            .finally(() => handleOcrStateChange({ isLoading: false }))
    }

    const copyToClipboard = async ()=> {
        await navigator.clipboard.writeText(ocrResult.textResult);
    }

    return (

        <section className="flex flex-col items-center justify-start mx-auto ">

            <img ref={imageRef} src={ocrResult.imgSrc} hidden />
            <canvas ref={canvasRef} hidden></canvas>

            <div className='flex flex-col gap-2 w-full md:w-2/3'>

                <InputWithIcon hide={!ocrResult.isSearchFromUrl}
                 type='url'
                 value={ocrResult.searchUrl} 
                 onChange={(e) => handleOcrStateChange({ searchUrl: e.target.value })}
                 placeholder='Type image url here'
                 aria-label='Type image url here'
                 Icon={TbUnlink}
                />

                {!ocrResult.isSearchFromUrl && <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleFileChange} />}

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

                    <button className="btn btn-sm" onClick={handleClick} disabled={isConvertDisabled}>
                        {ocrResult.isLoading ? <span className="loading loading-spinner"></span> : <MdOutlineImageSearch size={20} />}
                        Convert
                    </button>
                </div>
            </div>

            {ocrResult.textResult
                && <div className="card w-full mt-2 bg-base-200 shadow-xl">
                    <div className="card-body">
                        <div className="card-actions justify-between items-center">
                            <div className="badge badge-outline">confidence {ocrResult.confidence}%</div>
                            
                            <div className="tooltip tooltip-left before:text-xs before:content-[attr(data-tip)]" data-tip="copy">
                                <button className="btn btn-ghost btn-circle btn-sm" onClick={copyToClipboard}>
                                    <RxCopy size={20}/>
                                </button>
                            </div>
                        </div>
                        <p className="!my-1 text-left" dangerouslySetInnerHTML={{ __html: ocrResult.textResult }} />
                    </div>
                </div>
            }

            {ocrResult.hasError && <ErrorCard message='An issue occurred. Please make another attempt or consider altering the image.'/>}
        </section>
    );
}

export default Ocr