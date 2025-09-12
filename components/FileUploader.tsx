
import { Utils } from '@/utils';
import React, { forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
    BsCloudUpload,
    BsX,
    BsFileEarmark,
    BsExclamationCircle
} from 'react-icons/bs';

interface FileUploaderProps {
    maxFiles?: number;
    maxSize?: number;
    acceptedFileTypes?: { [key: string]: string[] };
    onFilesUploaded?: (acceptedFiles: File[]) => void;
    onFileRemove?: (fileRemoved: File) => void;
    values?: File[];
    className?: string;
    disabled?: boolean;
}

export interface FileUploaderRef {
    resetFiles: () => void;
}

const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(({
    maxFiles = 5,
    maxSize = 104857600, // 100MB
    acceptedFileTypes = { 'application/pdf': ['.pdf'] }, // PDF only
    onFilesUploaded = () => { },
    onFileRemove = () => { },
    values = [],
    className = '',
    disabled = false
}, ref) => {
    const [files, setFiles] = useState<File[]>(() => values.filter(file => !!file));
    const [errors, setErrors] = useState<{ name: string, errors: string[] }[]>([]);

    const isDisabled = disabled || files.length >= maxFiles;

    useImperativeHandle(ref, () => ({
        resetFiles: () => {
            setFiles([]);
            setErrors([]);
        }
    }));

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const currentFileCount = files.length;
        if (currentFileCount >= maxFiles) return;

        const allowed = Math.max(0, maxFiles - currentFileCount);
        const filesToAdd = acceptedFiles.slice(0, allowed);

        if (filesToAdd.length > 0) {
            setFiles([...files, ...filesToAdd]);
            onFilesUploaded(filesToAdd);
        }

        if (rejectedFiles.length > 0) {
            const newErrors = rejectedFiles.map(file => ({
                name: file.file.name,
                errors: file.errors.map(err => err.message)
            }));
            setErrors(prev => [...prev, ...newErrors]);
        }
    }, [files, maxFiles, onFilesUploaded]);

    const removeFile = (file: File) => {
        const filteredFiles = Utils.removeFirstMatchImmutable(files, f => f.name === file.name && f.size === file.size);
        setFiles(filteredFiles);
        onFileRemove(file);
    };

    const removeError = (fileName: string) => {
        setErrors(errors.filter(error => error.name !== fileName));
    };

    const duplicateValidator = (file: File) => {
        const isDuplicate = files.some(
            (f) => f.name === file.name && f.size === file.size
        );
        return isDuplicate ? {
            code: 'duplicate-file',
            message: 'File already uploaded',
        } : null;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        maxSize,
        multiple: true,
        accept: acceptedFileTypes,
        validator: duplicateValidator,
        disabled: isDisabled
    });

    return (
        <div className={`${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    p-6 border-2 border-dashed rounded-lg transition-all
                    flex flex-col items-center justify-center text-center
                    ${isDisabled ? 'bg-base-200 border-base-300 text-base-content cursor-not-allowed' : ''}
                    ${isDragActive ? 'border-primary bg-primary-focus bg-opacity-10' : 'border-base-300'}
                    cursor-pointer min-h-[200px]
                `}
            >
                <input {...getInputProps()} disabled={isDisabled} />
                <BsCloudUpload className={`text-4xl mb-3 ${isDisabled ? 'text-base-content' : 'text-primary'}`} />
                {isDragActive && !isDisabled ? (
                    <p className="text-lg font-medium text-primary">Drop the files here…</p>
                ) : (
                    <>
                        <p className={`text-lg font-medium ${isDisabled ? 'text-base-content' : 'text-primary'}`}>
                            Drag &#96;n&#96; drop files here, or click to select files
                        </p>
                        <p className="text-sm text-base-content">
                            Maximum {maxFiles} files, up to {(maxSize / 1024 / 1024).toFixed(0)}MB each
                        </p>
                    </>
                )}
            </div>

            {/* Accepted Files */}
            {files.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                    {files.map((file) => (
                        <div key={file.name} className="alert rounded-lg shadow-md">
                            <BsFileEarmark size={20} className='text-primary' />
                            <div className="flex items-center gap-2 max-w-80">
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(file)} className="btn btn-ghost btn-circle btn-sm ml-auto" type='button'>
                                <BsX size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                    {errors.map((error) => (
                        <div key={error.name} className="alert alert-error rounded-lg shadow-md">
                            <BsExclamationCircle size={20} />
                            <div className="flex items-center gap-2 max-w-80">
                                <span className="text-sm truncate">{error.name}</span>
                                <span className="text-xs truncate">{error.errors.join(', ')}</span>
                            </div>
                            <button onClick={() => removeError(error.name)} className="btn btn-ghost btn-circle btn-sm ml-auto" type='button'>
                                <BsX size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;
