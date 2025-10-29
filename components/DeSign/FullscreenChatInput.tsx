import React, { useState, useRef, useEffect } from 'react';
import { HiSparkles, HiPaperClip, HiX } from 'react-icons/hi';
import { FiSend } from 'react-icons/fi';
import { PromiseUtils } from '@/utils';
import toast from 'react-hot-toast';
import { useDesign } from '@/hooks/use-de-sign';

interface FullscreenChatInputProps {
    currentSketchHtml: string;
    onHtmlGenerated: (result: string, prompt: string) => void;
    disabled?: boolean;
}

const FullscreenChatInput: React.FC<FullscreenChatInputProps> = ({
    currentSketchHtml,
    onHtmlGenerated,
    disabled = false
}) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { editHtml } = useDesign();

    // Cleanup image preview URL on unmount or image change
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image.previewUrl);
            }
        };
    }, [image]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [prompt]);

    const processImageFile = (file: File | null | undefined) => {
        if (file && file.type.startsWith('image/')) {
            // Cleanup old preview if exists
            if (image) {
                URL.revokeObjectURL(image.previewUrl);
            }
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
        }
        setImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() && !image) return;
        if (disabled || isLoading) return;

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

        setIsLoading(true);
        const { err, result } = await PromiseUtils.tryOf(
            editHtml(prompt, currentSketchHtml, imageData)
        );
        setIsLoading(false)

        if (err) {
            console.error('Failed to edit sketch:', err);
            toast.error('Error editing sketch. Please check the console.');
            return;
        } 

        onHtmlGenerated(result, prompt);
        setPrompt('');
        removeImage();
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
        <div className="p-4 border-t border-base-300 bg-base-200 flex-shrink-0">
            <form onSubmit={handleSubmit} className="w-full">
                <div
                    className="relative w-full"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Drag Overlay */}
                    {isDraggingOver && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none z-10">
                            <div className="flex flex-col items-center gap-2">
                                <HiPaperClip className="w-8 h-8 text-primary" />
                                <p className="text-sm font-semibold text-primary">Drop image to attach</p>
                            </div>
                        </div>
                    )}

                    {/* Image Preview */}
                    {image && (
                        <div className="mb-2">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-base-300 inline-block">
                                <img
                                    src={image.previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-0.5 right-0.5 btn btn-circle btn-xs btn-error"
                                    aria-label="Remove image"
                                    disabled={isLoading}
                                >
                                    <HiX className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Area with Buttons Inside */}
                    <div className="relative w-full">
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="Describe changes... (paste or drag image)"
                            className="textarea textarea-bordered w-full resize-none bg-base-300 focus:textarea-primary text-sm pr-20 pl-3 no-scrollbar"
                            disabled={isLoading || disabled}
                            rows={2}
                        />
                        
                        {/* Buttons Container (inside textarea, right side) */}
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                            {/* File Input Button */}
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
                                disabled={isLoading || disabled}
                                className="btn btn-ghost btn-xs btn-circle hover:bg-base-200"
                                title="Attach image"
                            >
                                <HiPaperClip className="size-4" />
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || disabled || (!prompt.trim() && !image)}
                                className="btn btn-primary btn-xs btn-circle"
                                title="Send message"
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FiSend className="size-3" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FullscreenChatInput;