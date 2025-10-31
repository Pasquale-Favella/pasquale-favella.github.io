import { FC, useCallback, useState } from "react";
import FullscreenChatInput from "./FullscreenChatInput";
import { SketchView } from "@/store/de-sign.atom";
import { useDesign, useDesignAiGeneratedSketchHistoryById, useDesignSketchById } from "@/hooks/use-de-sign";
import { cn, PromiseUtils } from "@/utils";
import toast from "react-hot-toast";
import AISettingsSection from "./FullscreenAiSettingSection";
import { FiArrowDown, FiCheck, FiDownload, FiRotateCcw } from "react-icons/fi";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { makeIframePreview } from "./FullscreenView";
import { toBlob } from 'html-to-image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../HoverCard';
import { FaImages } from "react-icons/fa";

const StickToBottomIndicator = () => {
    const { isAtBottom, scrollToBottom } = useStickToBottomContext();

    const handleScrollToBottom = useCallback(() => {
        scrollToBottom();
    }, [scrollToBottom]);

    if (isAtBottom) return null;

    return (
        <button
            onClick={handleScrollToBottom}
            className="sticky bottom-4 btn btn-circle btn-primary btn-sm shadow-lg"
            aria-label="Scroll to latest"
        >
            <FiArrowDown className="h-4 w-4" />
        </button>
    );
};

const FullscreenSidebarContent: FC<{ 
    sketchId: string; 
    view: SketchView; 
    iframe: HTMLIFrameElement | null, 
    editedHtml: string, 
    hasHtmlChanges: boolean 
}> = ({
    iframe,
    sketchId,
    view,
    editedHtml,
    hasHtmlChanges,
}) => {

    const [isAiSettingsCollapsed, setIsAiSettingsCollapsed] = useState(true);
    const promptHistory = useDesignAiGeneratedSketchHistoryById(sketchId);
    const { updateSketch } = useDesign();
    const sketch = useDesignSketchById(sketchId);

    const handleSave = async () => {
        await updateSketch(sketchId, { html: editedHtml });
    };

    const rollBackToTargetAiGeneration = async (html: string) => {
        await updateSketch(sketchId, { html });
    };

    const downloadHtml = () => {
        const iframeSrcDoc = makeIframePreview(editedHtml);
        const blob = new Blob([iframeSrcDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sketch?.prompt.split(' ').slice(0, 5).join('_') || 'sketch'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async () => {
        const { err } = await PromiseUtils.tryOf((async () => {

            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const body = iframeDoc?.body;
            if (!body) throw new Error('Iframe body not found');

            const blob = await toBlob(body, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
            });

            if (!blob) throw new Error('Blob not found');

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
        })());

        if (err) {
            console.error('Failed to copy:', err);
            toast.error('Error copying to clipboard. Please check the console.');
            return;
        }

        toast.success('Image copied! Paste directly into Figma (Cmd/Ctrl+V)');
    };

    return (
        <>
            {/* AI Settings Section */}
            <AISettingsSection
                isCollapsed={isAiSettingsCollapsed}
                onToggle={() => setIsAiSettingsCollapsed(prev => !prev)}
            />

            {/* Controls Section */}
            <div className="p-4 border-b border-base-300 space-y-2 flex-shrink-0">
                <h3 className="font-semibold text-sm mb-2 opacity-70">Controls</h3>
                {view === 'code' && (
                    <button
                        onClick={handleSave}
                        disabled={!hasHtmlChanges}
                        className="btn btn-primary btn-sm w-full"
                    >
                        {hasHtmlChanges ? 'Save Changes' : 'Saved'}
                    </button>
                )}
                <button
                    onClick={downloadHtml}
                    className="btn btn-neutral btn-sm w-full gap-2"
                >
                    <FiDownload size={16} /> Download HTML
                </button>

                {view === 'result' && (
                    <button
                        onClick={copyToClipboard}
                        className="btn btn-primary btn-sm w-full gap-2"
                    >
                        <FaImages size={16} /> Copy as image
                    </button>
                )}
            </div>

            {/* History Section */}
            <StickToBottom className="flex-grow overflow-y-auto relative no-scrollbar [&>*:first-child]:no-scrollbar" resize="smooth">
                <StickToBottom.Content>
                    <div className="p-4 pb-16">
                        <h3 className="font-semibold text-sm mb-3 opacity-70">AI Generation History</h3>
                        {promptHistory.length === 0 ? (
                            <p className="text-xs opacity-50 text-center py-8">No history yet</p>
                        ) : (
                            <ul className="space-y-3">
                                {promptHistory.map((item, index) => {
                                    const isCurrentVersion = sketch?.html === item.html;
                                    const iframePreviewSrcDoc = makeIframePreview(item.html);
                                    return (
                                        <li
                                            key={index}
                                            className={cn("relative overflow-hidden rounded-xl transition-all duration-200",
                                                isCurrentVersion
                                                    ? 'ring-2 ring-primary shadow-lg'
                                                    : 'hover:shadow-md cursor-pointer'
                                            )}
                                        >
                                            <div className={`p-4 ${isCurrentVersion ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-base-300 group hover:bg-base-200'}`}>
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <div className={cn(
                                                            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                                            isCurrentVersion
                                                                ? 'bg-primary text-primary-content'
                                                                : 'bg-base-100 text-base-content opacity-60'
                                                        )}>
                                                            {index + 1}
                                                        </div>

                                                        {isCurrentVersion ? (
                                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                                                <FiCheck className="size-3" />
                                                                <span className="text-[10px] font-semibold">Active</span>
                                                            </div>
                                                        ) : (
                                                            <HoverCard openDelay={200} closeDelay={100}>
                                                                <HoverCardTrigger asChild>
                                                                    <button
                                                                        onClick={() => rollBackToTargetAiGeneration(item.html)}
                                                                        className="btn btn-xs btn-ghost gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                    >
                                                                        <FiRotateCcw className="size-3" />
                                                                        <span className="text-[10px]">Restore</span>
                                                                    </button>
                                                                </HoverCardTrigger>
                                                                <HoverCardContent side="right" align="start" className="w-80 p-3 z-[9999]">
                                                                    <h3 className="text-xs font-semibold mb-2">Preview - Version {index + 1}</h3>
                                                                    <div className="w-full h-48 bg-base-300 rounded-lg overflow-hidden border border-base-300">
                                                                        <iframe
                                                                            srcDoc={iframePreviewSrcDoc}
                                                                            title={`Preview ${index}`}
                                                                            sandbox="allow-scripts allow-same-origin"
                                                                            className="w-full h-full border-0"
                                                                            style={{
                                                                                width: '200%',
                                                                                height: '200%',
                                                                                transform: 'scale(0.5)',
                                                                                transformOrigin: 'top left'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <p className="text-[10px] opacity-60 mt-2">{item.timestamp}</p>
                                                                </HoverCardContent>
                                                            </HoverCard>
                                                        )}
                                                    </div>

                                                    <span className="text-[10px] opacity-50 whitespace-nowrap flex-shrink-0">
                                                        {item.timestamp}
                                                    </span>
                                                </div>

                                                <p className="text-xs leading-relaxed break-words whitespace-pre-wrap opacity-90 mt-3">
                                                    {item.prompt}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-4 pointer-events-none">
                        <div className="pointer-events-auto">
                            <StickToBottomIndicator />
                        </div>
                    </div>
                </StickToBottom.Content>
            </StickToBottom>

            {/* Chat Input */}
            <FullscreenChatInput
                sketchId={sketchId}
                currentSketchHtml={sketch?.html ?? ''}
            />
        </>
    );
}

export default FullscreenSidebarContent;