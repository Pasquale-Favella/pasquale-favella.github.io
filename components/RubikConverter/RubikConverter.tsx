import React, { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { useRubikConverter } from '@/hooks/use-rubik-converter'
import RubikUploader from './RubikUploader'
import RubikGrid, { type RubikGridHandle } from './RubikGrid'
import RubikCubeDetail from './RubikCubeDetail'
import { FiDownload } from 'react-icons/fi'

const RubikConverter: React.FC = () => {
  const { image, gridData, converting } = useRubikConverter()
  const gridRef = useRef<RubikGridHandle>(null)

  const handleExport = useCallback(async () => {
    const canvas = gridRef.current?.getCanvasElement()
    if (!canvas) return
    try {
      const dataUrl = await toPng(canvas, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'rubik-grid.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full not-prose">
      <RubikUploader />

      {converting && (
        <div className="flex flex-col items-center gap-2">
          <progress className="progress progress-primary w-40 sm:w-56"></progress>
          <span className="text-xs sm:text-sm opacity-60">Processing image...</span>
        </div>
      )}

      {gridData && image && (
        <>
          {/* Side-by-side comparison — stacks on small screens */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            {/* Original */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 md:flex-1 md:min-w-0">
              <span className="text-xs sm:text-sm font-medium opacity-70">Original</span>
              <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-200 p-1.5 sm:p-2 w-full">
                <img
                  src={image}
                  alt="Original"
                  className="max-h-48 sm:max-h-72 md:max-h-96 object-contain mx-auto rounded"
                />
              </div>
            </div>

            {/* Rubik Grid */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 md:flex-1 md:min-w-0">
              <span className="text-xs sm:text-sm font-medium opacity-70">
                Rubik Grid ({gridData.rows}×{gridData.cols})
              </span>
              <div className="w-full">
                <RubikGrid ref={gridRef} />
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="flex justify-center">
            <button
              className="btn btn-outline btn-xs sm:btn-sm gap-2"
              onClick={handleExport}
            >
              <FiDownload /> Download PNG
            </button>
          </div>
        </>
      )}

      <RubikCubeDetail />
    </div>
  )
}

export default RubikConverter
