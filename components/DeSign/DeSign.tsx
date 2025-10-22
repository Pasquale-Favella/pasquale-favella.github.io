import { FC, useState, useRef, useEffect, useCallback } from 'react';


import PromptModal from './PromptModal';
import SketchCard from './SketchCard';
import FullscreenView from './FullscreenView';
import { HiPlus } from 'react-icons/hi';
import { useDesign } from '@/hooks/use-de-sign';
import { ModalState, Sketch } from '@/store/sketch.atom';
import Toolbar from './Toolbar';
import toast from 'react-hot-toast';

const DeSign: FC = () => {
  const {
    sketches,
    selectedSketchId,
    setSelectedSketchId,
    addSketch,
    updateSketch,
    deleteSketch,
    duplicateSketch,
    getSketchById,
    canvasTransform,
    setCanvasTransform,
    setZoom,
    fitToScreen,
    generateHtml,
    editHtml,
  } = useDesign();

  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenSketch, setFullscreenSketch] = useState<Sketch | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });

  // Handle sketch creation
  const handleCreateSketch = async (
    prompt: string,
    image: { data: string; mimeType: string } | null
  ) => {
    setIsLoading(true);
    try {
      const html = await generateHtml(prompt, image);
      const newSketch: Sketch = {
        id: `sketch_${Date.now()}`,
        prompt,
        html,
        x: -canvasTransform.x / canvasTransform.scale + 100,
        y: -canvasTransform.y / canvasTransform.scale + 100,
        width: 400,
        height: 300,
        view: 'result',
      };
      addSketch(newSketch);
      setModalState({ isOpen: false });
    } catch (error) {
      console.error('Failed to generate sketch:', error);
      toast.error('Error generating sketch. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sketch editing
  const handleEditSketch = async (
    prompt: string,
    sketchId: string,
    image: { data: string; mimeType: string } | null
  ) => {
    setIsLoading(true);
    const originalSketch = getSketchById(sketchId);
    if (!originalSketch) {
      setIsLoading(false);
      return;
    }

    try {
      const newHtml = await editHtml(prompt, originalSketch.html, image);
      updateSketch(sketchId, {
        html: newHtml,
        prompt: `${originalSketch.prompt}\n---\n${prompt}`,
      });
      setModalState({ isOpen: false });
    } catch (error) {
      console.error('Failed to edit sketch:', error);
      toast.error('Error editing sketch. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal submission
  const handleModalSubmit = (
    prompt: string,
    image: { data: string; mimeType: string } | null
  ) => {
    if (modalState.type === 'create') {
      handleCreateSketch(prompt, image);
    } else if (modalState.type === 'edit' && modalState.sketchId) {
      handleEditSketch(prompt, modalState.sketchId, image);
    }
  };

  // Open modal
  const openModal = (type: 'create' | 'edit', sketchId: string | null = null) => {
    setModalState({ isOpen: true, type, sketchId });
  };

  // Canvas panning
  const handlePanStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target !== canvasRef.current &&
      !(e.target as HTMLElement).classList.contains('canvas-bg')
    )
      return;
    isPanningRef.current = true;
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePanMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - lastPanPointRef.current.x;
    const dy = e.clientY - lastPanPointRef.current.y;
    setCanvasTransform({
      ...canvasTransform,
      x: canvasTransform.x + dx,
      y: canvasTransform.y + dy,
    });
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePanEnd = () => {
    isPanningRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  // Canvas zooming
  const handleZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(
      Math.max(0.1, canvasTransform.scale + scaleAmount),
      3
    );

    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX =
      mouseX - (mouseX - canvasTransform.x) * (newScale / canvasTransform.scale);
    const newY =
      mouseY - (mouseY - canvasTransform.y) * (newScale / canvasTransform.scale);

    setCanvasTransform({ x: newX, y: newY, scale: newScale });
  };

  // Fit to screen handler
  const handleFitToScreen = () => {
    const containerWidth = canvasRef.current?.clientWidth || window.innerWidth;
    const containerHeight = canvasRef.current?.clientHeight || window.innerHeight;
    fitToScreen(containerWidth, containerHeight);
  };

  // Fullscreen handlers
  const handleEnterFullscreen = (sketchId: string) => {
    const sketch = getSketchById(sketchId);
    if (sketch) {
      setFullscreenSketch(sketch);
    }
  };

  const handleExitFullscreen = () => {
    setFullscreenSketch(null);
  };

  // Update fullscreen sketch when it changes
  const handleUpdateFullscreenSketch = useCallback(
    (id: string, updates: Partial<Sketch>) => {
      updateSketch(id, updates);
      if (fullscreenSketch && fullscreenSketch.id === id) {
        setFullscreenSketch((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [updateSketch, fullscreenSketch]
  );

  // Mouse up event listener
  useEffect(() => {
    const handleMouseUp = () => handlePanEnd();
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Fit on mount
  useEffect(() => {
    if (canvasRef.current) {
      handleFitToScreen();
    }
  }, [canvasRef.current]);


  return (
    <div className="mx-auto h-[calc(90dvh)] overflow-hidden flex flex-col bg-base-300 relative">
      {fullscreenSketch ? (
        <FullscreenView
          sketch={fullscreenSketch}
          onClose={handleExitFullscreen}
          onUpdate={handleUpdateFullscreenSketch}
        />
      ) : (
        <>
          <Toolbar
            onNewSketch={() => openModal('create')}
            onZoomChange={setZoom}
            onFitToScreen={handleFitToScreen}
            zoomLevel={canvasTransform.scale}
          />
          <div
            ref={canvasRef}
            className="flex-grow w-full h-full relative overflow-hidden cursor-grab canvas-bg"
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onWheel={handleZoom}
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, oklch(var(--bc) / 0.2) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          >
            <div
              className="absolute top-0 left-0"
              style={{
                transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
                transformOrigin: '0 0',
              }}
            >
              {sketches.map((sketch) => (
                <SketchCard
                  key={sketch.id}
                  sketch={sketch}
                  isSelected={selectedSketchId === sketch.id}
                  onSelect={() => setSelectedSketchId(sketch.id)}
                  onUpdate={updateSketch}
                  onDelete={deleteSketch}
                  onDuplicate={duplicateSketch}
                  onEdit={() => openModal('edit', sketch.id)}
                  onFullscreen={() => handleEnterFullscreen(sketch.id)}
                  canvasScale={canvasTransform.scale}
                />
              ))}
            </div>
          </div>

          {/* Empty state */}
          {sketches.length === 0 && !isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-base-content/60">
                AI Sketch Board
              </h2>
              <p className="text-base-content/40">
                Create your first component to get started.
              </p>
              <button
                onClick={() => openModal('create')}
                className="btn btn-primary gap-2"
              >
                <HiPlus className="w-5 h-5" /> New Sketch
              </button>
            </div>
          )}

          {/* Prompt Modal */}
          {modalState.isOpen && (
            <PromptModal
              onClose={() => setModalState({ isOpen: false })}
              onSubmit={handleModalSubmit}
              isLoading={isLoading}
              type={modalState.type || 'create'}
              initialPrompt={
                modalState.type === 'edit' && modalState.sketchId
                  ? getSketchById(modalState.sketchId)?.prompt || ''
                  : ''
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeSign;