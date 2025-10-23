import React, { useState, useRef, useEffect } from 'react';
import {
    HiSparkles,
    HiPaperClip,
    HiX
} from 'react-icons/hi';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { VscGear } from 'react-icons/vsc';
import DeSignAiSettings from './DeSignAiSettings';
import { useDesign } from '@/hooks/use-de-sign';

interface PromptModalProps {
    onClose: () => void;
    onSubmit: (prompt: string, image: { data: string; mimeType: string } | null) => void;
    isLoading: boolean;
    type: 'create' | 'edit';
    initialPrompt?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
    onClose,
    onSubmit,
    isLoading,
    type,
    initialPrompt
}) => {
    const { apiKey } = useDesign();
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image.previewUrl);
            }
        }
    },[image]);

    const processImageFile = (file: File | null | undefined) => {
        if (file && file.type.startsWith('image/')) {
            setImage({ file, previewUrl: URL.createObjectURL(file) });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processImageFile(e.target.files?.[0]);
        if (e.target) e.target.value = '';
    };

    const removeImage = () => {
        if (image) {
            URL.revokeObjectURL(image.previewUrl);
            setImage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() && !image) return;

        let imageData: { data: string; mimeType: string } | null = null;
        if (image) {
            imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        const base64String = reader.result.split(',')[1];
                        resolve({ data: base64String, mimeType: image.file.type });
                    } else {
                        reject(new Error('Failed to read file as base64 string.'));
                    }
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(image.file);
            });
        }
        onSubmit(prompt, imageData);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        processImageFile(e.dataTransfer.files?.[0]);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const file = Array.from(e.clipboardData.items)
            .find(item => item.type.startsWith('image/'))
            ?.getAsFile();

        if (file) {
            e.preventDefault();
            processImageFile(file);
        }
    };

    return (
        <div className="modal modal-open z-10">
            <div
                className="modal-box max-w-2xl relative bg-base-200 border border-base-300"
                onClick={e => e.stopPropagation()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPaste={handlePaste}
            >
                {/* Drag Overlay */}
                {isDraggingOver && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary rounded-box flex items-center justify-center pointer-events-none z-10">
                        <div className="flex flex-col items-center gap-2">
                            <HiPaperClip className="w-12 h-12 text-primary" />
                            <p className="text-lg font-semibold text-primary">Drop image to attach</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <HiSparkles className="w-6 h-6 text-primary" />
                            {type === 'create' ? 'Create a new sketch' : 'Edit sketch'}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-circle"
                            disabled={isLoading || !apiKey}
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Textarea */}
                    <div className="form-control">
                        <textarea 
                            autoFocus
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={
                                type === 'create'
                                    ? "e.g., a login form with a neon blue theme. You can also paste or drop an image."
                                    : "e.g., change the primary button to green. Paste or drop an image to provide context."
                            }
                            className="textarea textarea-bordered h-32 resize-none bg-base-300 focus:textarea-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Image Preview */}
                    {image && (
                        <div className="mt-4">
                            <div className="relative w-24 h-24 rounded-box overflow-hidden border-2 border-base-300">
                                <img
                                    src={image.previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                                    aria-label="Remove image"
                                >
                                    <HiX className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Setup ai provider info */}
                    {!apiKey && (
                        <div className="mt-4 alert alert-info">
                            <div className="text-xs">
                                <p className="font-semibold mb-1">Configure AI</p>
                                <p className="opacity-80 font-mono whitespace-pre-wrap flex">
                                    Setup AI provider using settings <VscGear className='size-4' />
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Previous Prompt (Edit Mode) */}
                    {type === 'edit' && initialPrompt && (
                        <div className="mt-4 alert alert-info">
                            <div className="text-xs">
                                <p className="font-semibold mb-1">Previous Prompt:</p>
                                <p className="opacity-80 font-mono whitespace-pre-wrap">
                                    {initialPrompt.split('---').pop()?.trim()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="modal-action flex justify-between items-center">
                        <div className="tooltip" data-tip="AI Settings">
                            <Popover>
                                <PopoverTrigger className="btn btn-ghost btn-sm btn-circle" disabled={isLoading}>
                                    <VscGear className='size-5' />
                                </PopoverTrigger>
                                <PopoverContent className='z-50'>
                                    <DeSignAiSettings />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex gap-2 items-center">
                            {/* File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="btn btn-ghost btn-sm btn-circle"
                                title="Attach image"
                            >
                                <HiPaperClip className="size-5" />
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="btn btn-ghost btn-sm"
                            >
                                Cancel
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || (!prompt.trim() && !image)}
                                className="btn btn-primary btn-sm gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <HiSparkles className="w-4 h-4" />
                                        {type === 'create' ? 'Generate' : 'Update'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default PromptModal;