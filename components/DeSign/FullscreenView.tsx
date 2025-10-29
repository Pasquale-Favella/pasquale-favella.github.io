import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiX, FiCode, FiEye, FiDownload, FiSmartphone, FiTablet, FiMonitor, FiMenu, FiArrowDown } from 'react-icons/fi';
import { Sketch, SketchView } from '@/store/de-sign.atom';
import { useTheme } from '@/hooks/use-theme';
import { Editor } from '@monaco-editor/react';
import CodeEditorLoader from '../CodeEditor/CodeEditorLoader';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/Sheet';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import FullscreenChatInput from './FullscreenChatInput';

interface FullscreenViewProps {
    sketch: Sketch;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Sketch>) => void;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

// Scroll to bottom indicator component
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

const FullscreenView: React.FC<FullscreenViewProps> = ({ sketch, onClose, onUpdate }) => {
    const { isDarkMode } = useTheme();
    const [view, setView] = useState<SketchView>('result');
    const [editedHtml, setEditedHtml] = useState(sketch.html);
    const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
    const [hasChanges, setHasChanges] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
 

    // Hide body overflow when fullscreen is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

     const iframeSrcDoc = useMemo(()=> {
        return`
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="h-full w-full m-0 p-0 overflow-auto">
            ${sketch.html}
        </body>
        </html>
        `;
    }, [sketch.html]);

    const recentHistoryQuery = useLiveQuery(`
    WITH all_prompts AS (
        SELECT prompt, updated_at AS timestamp
        FROM sketches
        WHERE id = $1
        
        UNION ALL
        
        SELECT prompt, created_at AS timestamp
        FROM sketch_history
        WHERE sketch_id = $2
        ORDER BY timestamp DESC
    )
    SELECT prompt, timestamp
    FROM all_prompts
    ORDER BY timestamp ASC;
    `, [sketch.id, sketch.id]);

    const promptHistory = useMemo(() => {
        const sketchHistory: { prompt: string; timestamp: string }[] = recentHistoryQuery?.rows ?? [];
        return sketchHistory;
    }, [recentHistoryQuery?.rows]);

    const handleSave = () => {
        onUpdate(sketch.id, { html: editedHtml });
        setHasChanges(false);
    };

    const handleHtmlChange = (codeValue: string | undefined) => {
        setEditedHtml(codeValue ?? '');
        setHasChanges(true);
    };

    const downloadHtml = () => {
        const blob = new Blob([iframeSrcDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sketch.prompt.split(' ').slice(0, 5).join('_') || 'sketch'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const deviceWidths: Record<DeviceSize, string> = {
        mobile: '375px',
        tablet: '768px',
        desktop: '100%',
    };

    const onHtmlGeneratedFromAI = (
        htmlResult: string,
        prompt: string
    ) => {
        onUpdate(sketch.id, {
            html: htmlResult,
            prompt,
        });
    }

    // Sidebar content component with StickToBottom
    const SidebarContent = () => (
        <>
            <div className="p-4 border-b border-base-300 space-y-2 flex-shrink-0">
                <h3 className="font-semibold text-lg mb-2">Controls</h3>
                {view === 'code' && (
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="btn btn-primary btn-sm w-full"
                    >
                        {hasChanges ? 'Save Changes' : 'Saved'}
                    </button>
                )}
                <button
                    onClick={downloadHtml}
                    className="btn btn-neutral btn-sm w-full gap-2"
                >
                    <FiDownload size={16} /> Download HTML
                </button>
            </div>

            <StickToBottom className="flex-grow overflow-y-auto relative no-scrollbar [&>*:first-child]:no-scrollbar" resize="smooth">
                <StickToBottom.Content>
                    <div className="p-4 pb-16">
                        {promptHistory.length === 0 ? (
                            <p className="text-xs opacity-50 text-center py-8">No history yet</p>
                        ) : (
                            <ul className="space-y-4">
                                {promptHistory.map((item, index) => (
                                    <li
                                        key={index}
                                        className="text-xs opacity-70 font-mono p-3 bg-base-300 rounded-lg whitespace-pre-wrap hover:opacity-100 hover:bg-base-200 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-primary font-bold">Step {index + 1}</span>
                                            <span className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">
                                                {new Date(item.timestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="break-words leading-relaxed">{item.prompt}</p>
                                    </li>
                                ))}
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

            <FullscreenChatInput
                currentSketchHtml={sketch.html}
                onHtmlGenerated={onHtmlGeneratedFromAI}
            />
        </>
    );

    return (
        <div className="fixed inset-0 bg-base-300 flex flex-col z-[99]">
            {/* Header */}
            <header className="flex-shrink-0 bg-base-200/80 backdrop-blur-sm border-b border-base-300 h-14 flex items-center justify-between px-2 sm:px-4">
                <div className="text-xs sm:text-sm opacity-80 truncate flex-1 min-w-0 mr-2">
                    <span className="font-semibold hidden sm:inline">Fullscreen Mode:</span>
                    <span className="ml-1">{sketch.prompt}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* View Toggle */}
                    <div className="join">
                        <div className="tooltip tooltip-bottom" data-tip="Result">
                            <button
                                onClick={() => setView('result')}
                                className={`btn btn-xs sm:btn-sm join-item ${view === 'result' ? 'btn-primary' : 'btn-ghost'}`}
                                title="Show Result"
                            >
                                <FiEye size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Code">
                            <button
                                onClick={() => setView('code')}
                                className={`btn btn-xs sm:btn-sm join-item ${view === 'code' ? 'btn-primary' : 'btn-ghost'}`}
                                title="Show Code"
                            >
                                <FiCode size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Device Size Toggle - Hidden on mobile */}
                    <div className="divider divider-horizontal mx-1 hidden sm:flex"></div>
                    <div className="join hidden sm:flex">
                        <div className="tooltip tooltip-bottom" data-tip="Mobile">
                            <button
                                onClick={() => setDeviceSize('mobile')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'mobile' ? 'text-primary' : ''}`}
                                title="Mobile View"
                            >
                                <FiSmartphone size={16} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Tablet">
                            <button
                                onClick={() => setDeviceSize('tablet')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'tablet' ? 'text-primary' : ''}`}
                                title="Tablet View"
                            >
                                <FiTablet size={16} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Desktop">
                            <button
                                onClick={() => setDeviceSize('desktop')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'desktop' ? 'text-primary' : ''}`}
                                title="Desktop View"
                            >
                                <FiMonitor size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Menu button for mobile */}
                    <div className="divider divider-horizontal mx-1 lg:hidden"></div>
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="btn btn-xs sm:btn-sm btn-ghost lg:hidden"
                        title="Open Menu"
                    >
                        <FiMenu size={16} />
                    </button>

                    <div className="divider divider-horizontal mx-1 sm:mx-2"></div>

                    <div className="tooltip tooltip-left" data-tip="Close">
                        <button
                            onClick={onClose}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-error hover:btn-error"
                            title="Close Fullscreen"
                        >
                            <FiX size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex h-full overflow-hidden">
                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 overflow-auto bg-base-300">
                    <div
                        className="bg-base-100 shadow-2xl transition-all duration-300 ease-in-out"
                        style={{
                            width: window.innerWidth < 1024 ? '100%' : deviceWidths[deviceSize],
                            height: '100%',
                            maxWidth: '100%'
                        }}
                    >
                        {view === 'result' ? (
                            <iframe
                                srcDoc={iframeSrcDoc}
                                title="Sketch Result"
                                sandbox="allow-scripts allow-same-origin"
                                className="w-full h-full border-0"
                            />
                        ) : (
                            <Editor
                                theme={isDarkMode ? 'vs-dark' : 'light'}
                                language='html'
                                value={editedHtml}
                                onChange={handleHtmlChange}
                                loading={<CodeEditorLoader />}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: window.innerWidth < 640 ? 12 : 14,
                                }}
                            />
                        )}
                    </div>
                </main>

                {/* Desktop Sidebar - Hidden on mobile/tablet */}
                <aside className="w-80 flex-shrink-0 bg-base-200 border-l border-base-300 hidden lg:flex lg:flex-col">
                    <SidebarContent />
                </aside>
            </div>

            {/* Mobile Sheet Sidebar */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-[85vw] sm:w-96 z-[99]">
                    <SheetHeader>
                        <SheetTitle>Controls & History</SheetTitle>
                        <SheetDescription>
                            Manage your sketch and view prompt history
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-[calc(100%-5rem)] mt-4">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default FullscreenView;