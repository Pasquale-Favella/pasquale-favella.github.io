import { useState } from 'react';
import { ConverterAction } from '@/types';
import ConvertDropZone from './ConvertDropZone';
import ConverterCard from './ConverterCard';
import { useConverter } from '@/hooks/use-converter';

const Converter = () => {

    const { isFFmpegLoaded, convertFile } = useConverter();

    const [action, setAction] = useState<ConverterAction | null>(null);

    const handleUpload = ([file]: Array<File>): void => {
        setAction({
            fileName: file.name,
            fileSize: file.size,
            from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
            to: null,
            fileType: file.type,
            file,
            isConverted: false,
            isConverting: false,
            isError: false,
        });
    };

    const updateAction = (to: String) => {
        setAction(prev => ({ ...prev!, to }));
    };

    const reset = (): void => {
        setAction(null);
    };

    const convert = async (): Promise<any> => {

        if (!action) return;

        setAction(prev => ({ ...prev!, isConverting: true, }));

        try {
            const { url, output } = await convertFile(action);

            setAction(prev => ({
                ...prev!,
                isConverted: true,
                isConverting: false,
                url,
                output,
            }));

        } catch (error) {
            setAction(prev => ({
                ...prev!,
                isConverted: false,
                isConverting: false,
                isError: true,
                output: null
            }));
        }
    };

    if(action && !isFFmpegLoaded){
        return (
            <div className="skeleton w-full h-16"></div>
        );
    }

    if (action) {
        
        return (

            <div className="space-y-2">
            
                <ConverterCard action={action} onRemove={reset} onToFileTypeChange={updateAction}/>

                <div className="flex w-full justify-end">
                    {Boolean(action?.output) ? (
                        <button
                            onClick={reset}
                            className="btn btn-sm"
                        >
                            Convert Another File
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm"
                            disabled={!Boolean(action?.to) || Boolean(action?.isConverting)}
                            onClick={convert}
                        >
                            {Boolean(action?.isConverting) && <span className="loading loading-spinner"></span>}
                            <span>Convert</span>
                        </button>
                    )}
                </div>

            </div>
        )
    }

    return <ConvertDropZone onDrop={handleUpload} />;
}

export default Converter