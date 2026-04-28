import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import { RUBIK_COLORS } from '@/utils/RubikUtils'
import { useRubikConverter } from '@/hooks/use-rubik-converter'
import { FiZoomIn, FiZoomOut, FiMaximize, FiMove } from 'react-icons/fi'

const CELL_SIZE = 12
const CELL_GAP = 1
const CUBE_GAP = 2
const CUBE_SIZE = CELL_SIZE * 3 + CELL_GAP * 2
const MIN_SCALE = 0.005
const MAX_SCALE = 10
const ZOOM_STEP = 1.15

interface Transform {
  x: number
  y: number
  scale: number
}

export interface RubikGridHandle {
  getCanvasElement: () => HTMLCanvasElement | null
}

const RubikGrid = forwardRef<RubikGridHandle>((_props, ref) => {
  const { gridData, selectCube, selectedCube } = useRubikConverter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getCanvasElement: () => canvasRef.current,
  }))
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const [hoveredCube, setHoveredCube] = useState<{ row: number; col: number } | null>(null)
  const isPanning = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const mouseDownPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef<number | null>(null)
  const touchStartPos = useRef({ x: 0, y: 0 })

  const totalWidth = gridData ? gridData.cols * (CUBE_SIZE + CUBE_GAP) - CUBE_GAP : 0
  const totalHeight = gridData ? gridData.rows * (CUBE_SIZE + CUBE_GAP) - CUBE_GAP : 0

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !gridData) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.save()
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.scale, transform.scale)

    const { rows, cols, cubes } = gridData

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cubeX = col * (CUBE_SIZE + CUBE_GAP)
        const cubeY = row * (CUBE_SIZE + CUBE_GAP)
        const cells = cubes[row][col]

        // Cube background (black border)
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(cubeX - 1, cubeY - 1, CUBE_SIZE + 2, CUBE_SIZE + 2)

        // Draw 9 cells
        for (let i = 0; i < 9; i++) {
          const cx = i % 3
          const cy = Math.floor(i / 3)
          const x = cubeX + cx * (CELL_SIZE + CELL_GAP)
          const y = cubeY + cy * (CELL_SIZE + CELL_GAP)
          ctx.fillStyle = RUBIK_COLORS[cells[i]].hex
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        }

        // Highlight hovered cube
        if (hoveredCube && hoveredCube.row === row && hoveredCube.col === col) {
          ctx.strokeStyle = '#facc15'
          ctx.lineWidth = 2
          ctx.strokeRect(cubeX - 2, cubeY - 2, CUBE_SIZE + 4, CUBE_SIZE + 4)
        }

        // Highlight selected cube
        if (selectedCube && selectedCube.row === row && selectedCube.col === col) {
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 2.5
          ctx.strokeRect(cubeX - 2, cubeY - 2, CUBE_SIZE + 4, CUBE_SIZE + 4)
        }
      }
    }

    ctx.restore()
  }, [gridData, transform, hoveredCube, selectedCube])

  // Compute the scale at which the grid fits the container
  const fitScale = useCallback(() => {
    if (!gridData || !containerRef.current) return MIN_SCALE
    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = (rect.width - 20) / totalWidth
    const scaleY = (rect.height - 20) / totalHeight
    return Math.min(scaleX, scaleY, 3)
  }, [gridData, totalWidth, totalHeight])

  // Fit grid to container on first render / grid change
  const fitToView = useCallback(() => {
    if (!gridData || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scale = fitScale()
    const x = (rect.width - totalWidth * scale) / 2
    const y = (rect.height - totalHeight * scale) / 2
    setTransform({ x, y, scale })
  }, [gridData, totalWidth, totalHeight, fitScale])

  useEffect(() => { fitToView() }, [fitToView])

  useEffect(() => { draw() }, [draw])

  const canvasToGrid = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || !gridData) return null
    const rect = canvas.getBoundingClientRect()
    const mx = (clientX - rect.left - transform.x) / transform.scale
    const my = (clientY - rect.top - transform.y) / transform.scale
    const col = Math.floor(mx / (CUBE_SIZE + CUBE_GAP))
    const row = Math.floor(my / (CUBE_SIZE + CUBE_GAP))
    if (row < 0 || row >= gridData.rows || col < 0 || col >= gridData.cols) return null
    // Check if within the cube bounds (not in the gap)
    const localX = mx - col * (CUBE_SIZE + CUBE_GAP)
    const localY = my - row * (CUBE_SIZE + CUBE_GAP)
    if (localX < 0 || localX > CUBE_SIZE || localY < 0 || localY > CUBE_SIZE) return null
    return { row, col }
  }, [gridData, transform])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
      return
    }
    const hit = canvasToGrid(e.clientX, e.clientY)
    setHoveredCube(hit)
  }, [canvasToGrid])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      isPanning.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      mouseDownPos.current = { x: e.clientX, y: e.clientY }
    }
  }, [])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x)
      const dy = Math.abs(e.clientY - mouseDownPos.current.y)
      // If barely moved from mouseDown, treat as click
      if (dx < 5 && dy < 5) {
        const hit = canvasToGrid(e.clientX, e.clientY)
        if (hit) selectCube(hit.row, hit.col)
      }
    }
    isPanning.current = false
  }, [canvasToGrid, selectCube])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const delta = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP
    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * delta, MIN_SCALE), MAX_SCALE)
      const ratio = newScale / prev.scale
      return {
        scale: newScale,
        x: mx - (mx - prev.x) * ratio,
        y: my - (my - prev.y) * ratio,
      }
    })
  }, [])

  const zoomFromCenter = useCallback((factor: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE)
      const ratio = newScale / prev.scale
      return {
        scale: newScale,
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio,
      }
    })
  }, [])

  // Touch handlers for mobile pan/pinch/tap
  const getTouchDist = (t1: React.Touch, t2: React.Touch) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      lastMouse.current = { x: t.clientX, y: t.clientY }
      touchStartPos.current = { x: t.clientX, y: t.clientY }
      isPanning.current = true
    }
    if (e.touches.length === 2) {
      lastTouchDist.current = getTouchDist(e.touches[0], e.touches[1])
      isPanning.current = false
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning.current) {
      const t = e.touches[0]
      const dx = t.clientX - lastMouse.current.x
      const dy = t.clientY - lastMouse.current.y
      lastMouse.current = { x: t.clientX, y: t.clientY }
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dist = getTouchDist(e.touches[0], e.touches[1])
      const factor = dist / lastTouchDist.current
      lastTouchDist.current = dist
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mx = cx - rect.left
      const my = cy - rect.top
      setTransform(prev => {
        const newScale = Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE)
        const ratio = newScale / prev.scale
        return { scale: newScale, x: mx - (mx - prev.x) * ratio, y: my - (my - prev.y) * ratio }
      })
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && isPanning.current) {
      const t = e.changedTouches[0]
      const dx = Math.abs(t.clientX - touchStartPos.current.x)
      const dy = Math.abs(t.clientY - touchStartPos.current.y)
      if (dx < 10 && dy < 10) {
        const hit = canvasToGrid(t.clientX, t.clientY)
        if (hit) selectCube(hit.row, hit.col)
      }
    }
    isPanning.current = false
    lastTouchDist.current = null
  }, [canvasToGrid, selectCube])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!gridData) return
    const current = selectedCube || { row: 0, col: 0 }
    let { row, col } = current

    switch (e.key) {
      case 'ArrowUp':    row = Math.max(0, row - 1); break
      case 'ArrowDown':  row = Math.min(gridData.rows - 1, row + 1); break
      case 'ArrowLeft':  col = Math.max(0, col - 1); break
      case 'ArrowRight': col = Math.min(gridData.cols - 1, col + 1); break
      case 'Enter':      selectCube(row, col); return
      default: return
    }

    e.preventDefault()
    selectCube(row, col)
  }, [gridData, selectedCube, selectCube])

  if (!gridData) return null

  const zoomPercent = Math.round(transform.scale * 100)

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-base-content/10 rounded-xl overflow-hidden bg-base-200"
      style={{ height: `clamp(280px, 50vh, ${Math.min(500, totalHeight * 1.5 + 40)}px)` }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label={`Rubik grid ${gridData.rows} rows × ${gridData.cols} columns. Use arrow keys to navigate, Enter to select.`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isPanning.current = false; setHoveredCube(null) }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Canvas controls */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 bg-base-100/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 shadow-md">
        <button
          className="btn btn-ghost btn-xs btn-square"
          onClick={() => zoomFromCenter(1 / ZOOM_STEP)}
          title="Zoom out"
        >
          <FiZoomOut />
        </button>

        <input
          type="range"
          className="range range-xs range-primary w-20 sm:w-32"
          min={Math.log(Math.max(MIN_SCALE, fitScale() * 0.5))}
          max={Math.log(MAX_SCALE)}
          step={0.01}
          value={Math.log(transform.scale)}
          onChange={(e) => {
            const newScale = Math.exp(parseFloat(e.target.value))
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const cx = rect.width / 2
            const cy = rect.height / 2
            setTransform(prev => {
              const ratio = newScale / prev.scale
              return {
                scale: newScale,
                x: cx - (cx - prev.x) * ratio,
                y: cy - (cy - prev.y) * ratio,
              }
            })
          }}
        />

        <button
          className="btn btn-ghost btn-xs btn-square"
          onClick={() => zoomFromCenter(ZOOM_STEP)}
          title="Zoom in"
        >
          <FiZoomIn />
        </button>

        <span className="text-[10px] sm:text-xs w-10 sm:w-12 text-center tabular-nums opacity-70">
          {zoomPercent}%
        </span>

        <div className="w-px h-4 bg-base-content/10" />

        <button
          className="btn btn-ghost btn-xs btn-square"
          onClick={fitToView}
          title="Fit to view"
        >
          <FiMaximize />
        </button>
      </div>

      {/* Hover tooltip */}
      {hoveredCube && (
        <div className="absolute top-2 right-2 bg-base-100/90 backdrop-blur-sm text-xs px-2 py-1 rounded shadow pointer-events-none">
          [{hoveredCube.row + 1}, {hoveredCube.col + 1}]
        </div>
      )}

      {/* Hint — short on mobile */}
      <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] sm:text-xs opacity-40 pointer-events-none">
        <FiMove className="text-xs sm:text-sm" />
        <span className="hidden sm:inline">Drag to pan · Scroll to zoom · Click to select</span>
        <span className="sm:hidden">Pan · Pinch · Tap</span>
      </div>
    </div>
  )
})

RubikGrid.displayName = 'RubikGrid'

export default RubikGrid
