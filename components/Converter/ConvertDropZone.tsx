import { FC, useState } from 'react';
import ReactDropzone from 'react-dropzone';
import { toast } from "react-hot-toast";
import { FiUploadCloud } from 'react-icons/fi';
import { LuFileSymlink } from 'react-icons/lu';

const acceptedFiles = {
    "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".ico",
        ".tif",
        ".tiff",
        ".raw",
        ".tga",
    ],
    "audio/*": [],
    "video/*": [],
};

type ConvertDropZoneProps = {
    onDrop: (data: Array<File>) => void,
}

const ConvertDropZone: FC<ConvertDropZoneProps> = ({ onDrop }) => {

    const [isHover, setIsHover] = useState<boolean>(false);

    const handleHover = (): void => setIsHover(true);
    const handleExitHover = (): void => setIsHover(false);

    const handleUpload = (data: Array<File>): void => {
        handleExitHover();
        onDrop(data);
    };

    return (
        <ReactDropzone
            maxFiles={1}
            onDrop={handleUpload}
            onDragEnter={handleHover}
            onDragLeave={handleExitHover}
            accept={acceptedFiles}
            onDropRejected={(e) => {
                handleExitHover();
                const rejectMessage = e.at(0)?.errors.at(0)?.message;
                toast.error(rejectMessage ?? 'Allowed Files: Audio, Video and Images.' , {
                    position : 'top-right'
                });
            }}
            onError={() => {
                handleExitHover();
                toast.error('Allowed Files: Audio, Video and Images.', {
                    position : 'top-right'
                });
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps()}
                    className="min-h-72 rounded-3xl shadow-sm border-primary border-2 border-dashed cursor-pointer flex items-center justify-center"
                >
                    <input {...getInputProps()} />
                    <div className="space-y-4 ">
                        {isHover ? (
                            <>
                                <div className="justify-center flex text-6xl">
                                    <LuFileSymlink />
                                </div>
                                <h3 className="text-center font-medium text-2xl">
                                    Yes, right there
                                </h3>
                            </>
                        ) : (
                            <>
                                <div className="justify-center flex text-6xl">
                                    <FiUploadCloud />
                                </div>
                                <h3 className="text-center font-medium text-2xl">
                                    Click, or drop your files here
                                </h3>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ReactDropzone>
    );
}
export default ConvertDropZone