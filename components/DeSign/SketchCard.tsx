import { useTheme } from '@/hooks/use-theme';
import { Sketch } from '@/store/sketch.atom';
import { Editor } from '@monaco-editor/react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiCode, FiEye, FiCopy, FiMaximize2 } from 'react-icons/fi';
import CodeEditorLoader from '../CodeEditor/CodeEditorLoader';

interface SketchCardProps {
    sketch: Sketch;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (id: string, updates: Partial<Sketch>) => void;
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
    const dragStartPos = useRef({ x: 0, y: 0 });
    const elementStartPos = useRef({ x: 0, y: 0 });

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        elementStartPos.current = { x: sketch.x, y: sketch.y };
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect();
        setIsResizing(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const dx = (e.clientX - dragStartPos.current.x) / canvasScale;
            const dy = (e.clientY - dragStartPos.current.y) / canvasScale;
            onUpdate(sketch.id, {
                x: elementStartPos.current.x + dx,
                y: elementStartPos.current.y + dy
            });
        }
        if (isResizing) {
            const dx = (e.clientX - dragStartPos.current.x) / canvasScale;
            const dy = (e.clientY - dragStartPos.current.y) / canvasScale;
            onUpdate(sketch.id, {
                width: Math.max(200, sketch.width + dx),
                height: Math.max(150, sketch.height + dy)
            });
            dragStartPos.current = { x: e.clientX, y: e.clientY };
        }
    }, [isDragging, isResizing, canvasScale, onUpdate, sketch.id, sketch.width, sketch.height]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
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
                left: sketch.x,
                top: sketch.y,
                width: sketch.width,
                height: sketch.height,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className={`card bg-base-200 shadow-xl flex flex-col transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary' : ''
                }`}
            onMouseDown={onSelect}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="card-title bg-base-300/50 rounded-t-2xl flex items-center justify-between px-3 py-2 cursor-grab"
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

            <div className="flex-grow w-full h-full bg-base-100 relative overflow-hidden rounded-b-2xl">
                {sketch.view === 'result' ? (
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

            <div
                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-full border-2 border-base-200 cursor-se-resize"
                onMouseDown={handleResizeStart}
            />
        </div>
    );
};

export default SketchCard;