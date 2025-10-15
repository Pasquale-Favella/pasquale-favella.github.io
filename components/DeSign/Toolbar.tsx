import React from 'react';
import { 
  HiPlus, 
  HiZoomIn, 
  HiZoomOut, 
} from 'react-icons/hi';
import { MdOutlineFitScreen } from 'react-icons/md';

interface ToolbarProps {
  onNewSketch: () => void;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  zoomLevel: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onNewSketch, 
  onZoomChange, 
  onFitToScreen, 
  zoomLevel 
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoomLevel + 0.1, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoomLevel - 0.1, 0.1));
  };

  const handleResetZoom = () => {
    onZoomChange(1);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-base-200/80 backdrop-blur-md border border-base-300 rounded-box shadow-lg">
      <div className="flex items-center p-2 gap-2">
        {/* New Sketch Button */}
        <button
          onClick={onNewSketch}
          className="btn btn-primary btn-sm gap-2 font-medium"
        >
          <HiPlus className="w-4 h-4" />
          New Sketch
        </button>

        {/* Divider */}
        <div className="divider divider-horizontal mx-0"></div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Zoom Out"
            disabled={zoomLevel <= 0.1}
          >
            <HiZoomOut className="w-5 h-5" />
          </button>

          <button
            onClick={handleResetZoom}
            className="btn btn-ghost btn-sm min-w-[60px] font-mono"
            aria-label="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Zoom In"
            disabled={zoomLevel >= 3}
          >
            <HiZoomIn className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="divider divider-horizontal mx-0"></div>

        {/* Fit to Screen Button */}
        <div className="tooltip tooltip-bottom" data-tip="Fit to Screen">
            <button
            onClick={onFitToScreen}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Fit to Screen"
            >
            <MdOutlineFitScreen className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;