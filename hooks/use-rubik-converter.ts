import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useRef } from 'react'
import {
  rubikImageAtom,
  rubikResolutionAtom,
  rubikDitheringAtom,
  rubikGridDataAtom,
  rubikConvertingAtom,
  rubikSelectedCubeAtom,
  rubikPanelOpenAtom,
  rubikSelectedCubeDataAtom,
  type RubikGridData,
} from '@/store/rubik-converter.atom'
import { computeGridDimensions, type GridPreset } from '@/utils/RubikUtils'

export const useRubikConverter = () => {
  const [image, setImage] = useAtom(rubikImageAtom)
  const [resolution, setResolution] = useAtom(rubikResolutionAtom)
  const [dithering, setDithering] = useAtom(rubikDitheringAtom)
  const [gridData, setGridData] = useAtom(rubikGridDataAtom)
  const [converting, setConverting] = useAtom(rubikConvertingAtom)
  const [selectedCube, setSelectedCube] = useAtom(rubikSelectedCubeAtom)
  const [panelOpen, setPanelOpen] = useAtom(rubikPanelOpenAtom)
  const selectedCubeData = useAtomValue(rubikSelectedCubeDataAtom)

  const workerRef = useRef<Worker | null>(null)

  const handleImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setImage(url)
    setGridData(null)
    setSelectedCube(null)
    setPanelOpen(false)
  }, [setImage, setGridData, setSelectedCube, setPanelOpen])

  const convert = useCallback(async () => {
    if (!image) return

    setConverting(true)
    setGridData(null)
    setSelectedCube(null)
    setPanelOpen(false)

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = image
      })

      const { cols, rows } = computeGridDimensions(img.naturalWidth, img.naturalHeight, resolution)
      const bitmap = await createImageBitmap(img)

      if (workerRef.current) {
        workerRef.current.terminate()
      }

      const worker = new Worker('/workers/rubik-worker.js')
      workerRef.current = worker

      worker.onmessage = (e: MessageEvent<RubikGridData>) => {
        setGridData(e.data)
        setConverting(false)
        worker.terminate()
        workerRef.current = null
      }

      worker.onerror = () => {
        setConverting(false)
        worker.terminate()
        workerRef.current = null
      }

      worker.postMessage({ imageBitmap: bitmap, cols, rows, dithering }, [bitmap])
    } catch {
      setConverting(false)
    }
  }, [image, resolution, dithering, setConverting, setGridData, setSelectedCube, setPanelOpen])

  const selectCube = useCallback((row: number, col: number) => {
    setSelectedCube({ row, col })
    setPanelOpen(true)
  }, [setSelectedCube, setPanelOpen])

  const navigateCube = useCallback((direction: 'prev' | 'next') => {
    if (!gridData || !selectedCube) return
    const { rows, cols } = gridData
    const { row, col } = selectedCube
    let newCol = col
    let newRow = row

    if (direction === 'next') {
      newCol++
      if (newCol >= cols) { newCol = 0; newRow++ }
      if (newRow >= rows) { newRow = 0; newCol = 0 }
    } else {
      newCol--
      if (newCol < 0) { newCol = cols - 1; newRow-- }
      if (newRow < 0) { newRow = rows - 1; newCol = cols - 1 }
    }

    setSelectedCube({ row: newRow, col: newCol })
  }, [gridData, selectedCube, setSelectedCube])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setSelectedCube(null)
  }, [setPanelOpen, setSelectedCube])

  const reset = useCallback(() => {
    if (image) URL.revokeObjectURL(image)
    setImage(null)
    setGridData(null)
    setSelectedCube(null)
    setPanelOpen(false)
    setConverting(false)
  }, [image, setImage, setGridData, setSelectedCube, setPanelOpen, setConverting])

  return {
    image,
    resolution,
    setResolution,
    dithering,
    setDithering,
    gridData,
    converting,
    selectedCube,
    selectedCubeData,
    panelOpen,
    handleImageUpload,
    convert,
    selectCube,
    navigateCube,
    closePanel,
    reset,
  }
}
