import { useTheme } from '@/hooks/use-theme';
import { Sketch } from '@/store/de-sign.atom';
import { Editor } from '@monaco-editor/react';
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { FiEdit, FiTrash2, FiCode, FiEye, FiCopy, FiMaximize2 } from 'react-icons/fi';
import { PiArrowsOutSimpleBold } from 'react-icons/pi';
import CodeEditorLoader from '../CodeEditor/CodeEditorLoader';

interface SketchCardProps {
    sketch: Sketch;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (id: string, updates: Partial<Sketch>) => Promise<void>;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onEdit: () => void;
    onFullscreen: () => void;
    canvasScale: number;
}

const SketchCard: React.FC<SketchCardProps> = ({
    sketch,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    onDuplicate,
    onEdit,
    onFullscreen,
    canvasScale
}) => {
    const { isDarkMode } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [localPosition, setLocalPosition] = useState({ x: sketch.x, y: sketch.y });
    const [localSize, setLocalSize] = useState({ width: sketch.width, height: sketch.height });
    
    const dragStartPos = useRef({ x: 0, y: 0 });
    const elementStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        if (!isDragging && !isResizing) {
            setLocalPosition({ x: sketch.x, y: sketch.y });
            setLocalSize({ width: sketch.width, height: sketch.height });
        }
    }, [sketch.x, sketch.y, sketch.width, sketch.height, isDragging, isResizing]);

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect();
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        elementStartPos.current = { x: sketch.x, y: sketch.y };
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect();
        setIsResizing(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        resizeStartSize.current = { width: sketch.width, height: sketch.height };
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        animationFrameId.current = requestAnimationFrame(() => {
            if (isDragging) {
                const dx = (e.clientX - dragStartPos.current.x) / canvasScale;
                const dy = (e.clientY - dragStartPos.current.y) / canvasScale;
                const newX = elementStartPos.current.x + dx;
                const newY = elementStartPos.current.y + dy;
                setLocalPosition({ x: newX, y: newY });
            }
            if (isResizing) {
                const dx = (e.clientX - dragStartPos.current.x) / canvasScale;
                const dy = (e.clientY - dragStartPos.current.y) / canvasScale;
                
                const newWidth = Math.max(200, resizeStartSize.current.width + dx);
                const newHeight = Math.max(150, resizeStartSize.current.height + dy);
                
                setLocalSize({ width: newWidth, height: newHeight });
            }
        });
    }, [isDragging, isResizing, canvasScale]);

    const handleMouseUp = useCallback(async () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        if (isDragging) {
            await onUpdate(sketch.id, {
                x: localPosition.x,
                y: localPosition.y
            });
        }
        if (isResizing) {
            await onUpdate(sketch.id, {
                width: localSize.width,
                height: localSize.height
            });
        }
        
        setIsDragging(false);
        setIsResizing(false);
    }, [isDragging, isResizing, sketch.id, localPosition, localSize, onUpdate]);

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    const toggleView = () => {
        onUpdate(sketch.id, { view: sketch.view === 'result' ? 'code' : 'result' });
    };

    const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full w-full m-0 p-0 overflow-hidden">
        ${sketch.html}
      </body>
    </html>
  `;

    return (
        <div
            style={{
                position: 'absolute',
                left: localPosition.x,
                top: localPosition.y,
                width: localSize.width,
                height: localSize.height,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
            }}
            className={`card bg-base-200 shadow-xl flex flex-col transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary' : ''
                }`}
            onMouseDown={onSelect}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="card-title bg-base-300/50 rounded-t-2xl flex items-center justify-between px-3 py-2 cursor-grab select-none"
                onMouseDown={handleDragStart}
            >
                <div className="flex items-center gap-2 text-xs opacity-70 overflow-hidden whitespace-nowrap">
                    <span className="truncate">{sketch.prompt.split('\n').pop()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="tooltip" data-tip={sketch.view === 'result' ? 'Show Code' : 'Show Result'}>
                        <button
                            onClick={toggleView}
                            className="btn btn-ghost btn-xs btn-square"
                            title={sketch.view === 'result' ? 'Show Code' : 'Show Result'}
                        >
                            {sketch.view === 'result' ? <FiCode size={14} /> : <FiEye size={14} />}
                        </button>
                    </div>
                    <div className="tooltip" data-tip='Edit'>
                        <button
                            onClick={onEdit}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Edit"
                        >
                            <FiEdit size={14} />
                        </button>
                    </div>
                    <div className="tooltip" data-tip='Fullscreen'>
                        <button
                            onClick={onFullscreen}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Fullscreen"
                        >
                            <FiMaximize2 size={14} />
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Duplicate">
                        <button
                            onClick={() => onDuplicate(sketch.id)}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Duplicate"
                        >
                            <FiCopy size={14} />
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Delete">
                        <button
                            onClick={() => onDelete(sketch.id)}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Delete"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow w-full h-full bg-base-100 relative overflow-hidden rounded-b-2xl pointer-events-auto">
                {sketch.view === 'result' ? (
                    <iframe
                        srcDoc={iframeSrcDoc}
                        title="Sketch Result"
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0"
                        style={{ pointerEvents: isDragging || isResizing ? 'none' : 'auto' }}
                    />
                ) : (
                    <Editor
                        theme={isDarkMode ? 'vs-dark' : 'light'}
                        language='html'
                        defaultValue={sketch.html}
                        loading={<CodeEditorLoader />}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
            </div>
            <div className="tooltip z-10 absolute bottom-0.5 right-0.5 " data-tip="Resize">
                <button
                    type="button"
                    onMouseDown={handleResizeStart}
                    className="cursor-se-resize btn btn-ghost btn-sm btn-circle"
                >
                    <PiArrowsOutSimpleBold className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default memo(SketchCard);