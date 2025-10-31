import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiX, FiCode, FiEye, FiSmartphone, FiTablet, FiMonitor, FiMenu } from 'react-icons/fi';
import { Editor } from '@monaco-editor/react';
import { SketchView } from '@/store/de-sign.atom';
import { useTheme } from '@/hooks/use-theme';
import { useDesignSketchById } from '@/hooks/use-de-sign';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/Sheet';
import CustomToast from '../Navbar/CustomToast';
import CodeEditorLoader from '../CodeEditor/CodeEditorLoader';
import FullscreenSidebarContent from './FullscreenSidebarContent';

interface FullscreenViewProps {
    sketchId: string;
    onClose: () => void;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export const makeIframePreview = (html: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="h-full w-full m-0 p-0 overflow-auto">
            ${html}
        </body>
        </html>
    `;
}

function useEditSketchHtml(sketchHtml?: string) {
    const [editedHtml, setEditedHtml] = useState(sketchHtml ?? '');

    useEffect(() => {
        setEditedHtml(sketchHtml ?? '');
    }, [sketchHtml]);

    const hasHtmlChanges = useMemo(() => {
        return editedHtml !== sketchHtml;
    }, [editedHtml, sketchHtml]);

    return { editedHtml, setEditedHtml, hasHtmlChanges };
}

const FullscreenView: React.FC<FullscreenViewProps> = ({ sketchId, onClose }) => {
    const { isDarkMode } = useTheme();
    const [view, setView] = useState<SketchView>('result');
    const sketch = useDesignSketchById(sketchId);
    const { editedHtml, setEditedHtml, hasHtmlChanges } = useEditSketchHtml(sketch?.html);
    const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const iframeSrcDoc = useMemo(() => makeIframePreview(editedHtml), [editedHtml]);


    const handleHtmlChange = (codeValue: string | undefined) => {
        setEditedHtml(codeValue ?? '');
    };

    const deviceWidths: Record<DeviceSize, string> = {
        mobile: '375px',
        tablet: '768px',
        desktop: '100%',
    };

    return (
        <div className="fixed inset-0 bg-base-300 flex flex-col z-[99]">
            <CustomToast />
            <header className="flex-shrink-0 bg-base-200/80 backdrop-blur-sm border-b border-base-300 h-14 flex items-center justify-between px-2 sm:px-4">
                <div className="text-xs sm:text-sm opacity-80 truncate flex-1 min-w-0 mr-2">
                    <span className="font-semibold hidden sm:inline">Fullscreen Mode:</span>
                    <span className="ml-1">{sketch?.prompt}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <div className="join">
                        <div className="tooltip tooltip-bottom" data-tip="Result">
                            <button
                                onClick={() => setView('result')}
                                className={`btn btn-xs sm:btn-sm join-item ${view === 'result' ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                <FiEye size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Code">
                            <button
                                onClick={() => setView('code')}
                                className={`btn btn-xs sm:btn-sm join-item ${view === 'code' ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                <FiCode size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="divider divider-horizontal mx-1 hidden sm:flex"></div>
                    <div className="join hidden sm:flex">
                        <div className="tooltip tooltip-bottom" data-tip="Mobile">
                            <button
                                onClick={() => setDeviceSize('mobile')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'mobile' ? 'text-primary' : ''}`}
                            >
                                <FiSmartphone size={16} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Tablet">
                            <button
                                onClick={() => setDeviceSize('tablet')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'tablet' ? 'text-primary' : ''}`}
                            >
                                <FiTablet size={16} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Desktop">
                            <button
                                onClick={() => setDeviceSize('desktop')}
                                className={`btn btn-sm btn-ghost join-item ${deviceSize === 'desktop' ? 'text-primary' : ''}`}
                            >
                                <FiMonitor size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="divider divider-horizontal mx-1 lg:hidden"></div>
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="btn btn-xs sm:btn-sm btn-ghost lg:hidden"
                    >
                        <FiMenu size={16} />
                    </button>

                    <div className="divider divider-horizontal mx-1 sm:mx-2"></div>

                    <div className="tooltip tooltip-left" data-tip="Close">
                        <button
                            onClick={onClose}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-error hover:btn-error"
                        >
                            <FiX size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex h-full overflow-hidden">
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
                                ref={iframeRef}
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

                <aside className="w-80 flex-shrink-0 bg-base-200 border-l border-base-300 hidden lg:flex lg:flex-col">
                    <FullscreenSidebarContent sketchId={sketchId} view={view} iframeRef={iframeRef} editedHtml={editedHtml} hasHtmlChanges={hasHtmlChanges} />
                </aside>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-[85vw] sm:w-96 z-[99] gap-0">
                    <SheetHeader>
                        <SheetTitle>Controls & History</SheetTitle>
                        <SheetDescription>
                            Manage your sketch and view prompt history
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-[calc(100%-5rem)]">
                        <FullscreenSidebarContent sketchId={sketchId} view={view} iframeRef={iframeRef} editedHtml={editedHtml} hasHtmlChanges={hasHtmlChanges} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default FullscreenView;