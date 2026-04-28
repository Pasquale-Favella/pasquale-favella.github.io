import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { GRID_PRESETS, type GridPreset } from '@/utils/RubikUtils'
import { useRubikConverter } from '@/hooks/use-rubik-converter'
import { FiUploadCloud } from 'react-icons/fi'

const RubikUploader: React.FC = () => {
  const { image, resolution, setResolution, dithering, setDithering, handleImageUpload, convert, converting, gridData, reset } = useRubikConverter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0])
    }
  }, [handleImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="flex flex-col gap-4 w-full not-prose">
      {/* Dropzone — compact when image is loaded */}
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-10 cursor-pointer transition-colors text-center
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-base-content/20 hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          <FiUploadCloud className="mx-auto text-3xl sm:text-4xl mb-2 opacity-60" />
          <p className="text-sm">Drag & drop an image, or <span className="text-primary font-medium">click to browse</span></p>
          <p className="text-xs opacity-50 mt-1">JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-base-200 rounded-xl px-3 sm:px-4 py-3">
          {/* Image thumbnail + change */}
          <div
            {...getRootProps()}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          >
            <input {...getInputProps()} />
            <img
              src={image}
              alt="Uploaded"
              className="w-8 h-8 rounded object-cover ring-1 ring-base-content/10"
            />
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <FiUploadCloud className="text-sm" /> Change
            </span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-base-content/10" />

          {/* Resolution + dithering + actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
            <label className="text-xs sm:text-sm font-medium">Resolution:</label>
            <select
              className="select select-bordered select-xs"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value) as GridPreset)}
            >
              {GRID_PRESETS.map((p) => (
                <option key={p} value={p}>{p}×{p}</option>
              ))}
            </select>

            <div className="hidden sm:block w-px h-6 bg-base-content/10" />

            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-xs sm:text-sm font-medium">Dithering</span>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-xs"
                checked={dithering}
                onChange={(e) => setDithering(e.target.checked)}
              />
            </label>

            <div className="flex-1" />

            <button
              className="btn btn-primary btn-xs sm:btn-sm"
              onClick={convert}
              disabled={converting}
            >
              {converting ? (
                <><span className="loading loading-spinner loading-xs"></span> Converting...</>
              ) : (
                'Convert'
              )}
            </button>

            {gridData && (
              <button className="btn btn-ghost btn-xs sm:btn-sm" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RubikUploader
