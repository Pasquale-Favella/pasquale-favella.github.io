import React from 'react'
import { RUBIK_COLORS, type RubikColorIndex } from '@/utils/RubikUtils'

interface RubikCrossNetProps {
  frontFace: RubikColorIndex[]
}

const FACE_SIZE = 90
const CELL_SIZE = 28
const GAP = 2

const PLACEHOLDER = '#9ca3af' // gray-400

const FaceGrid: React.FC<{
  x: number
  y: number
  cells?: RubikColorIndex[]
  label: string
}> = ({ x, y, cells, label }) => (
  <g>
    <title>{label}</title>
    {/* Face background */}
    <rect x={x} y={y} width={FACE_SIZE} height={FACE_SIZE} rx={2} fill="#1a1a1a" />
    {/* 3×3 cells */}
    {Array.from({ length: 9 }).map((_, i) => {
      const cx = i % 3
      const cy = Math.floor(i / 3)
      const cellX = x + GAP + cx * (CELL_SIZE + GAP)
      const cellY = y + GAP + cy * (CELL_SIZE + GAP)
      const color = cells ? RUBIK_COLORS[cells[i]].hex : PLACEHOLDER
      return (
        <rect
          key={i}
          x={cellX}
          y={cellY}
          width={CELL_SIZE}
          height={CELL_SIZE}
          rx={2}
          fill={color}
          stroke={cells ? 'none' : '#6b728033'}
          strokeWidth={cells ? 0 : 1}
        />
      )
    })}
    {/* Label */}
    <text
      x={x + FACE_SIZE / 2}
      y={y + FACE_SIZE + 14}
      textAnchor="middle"
      fontSize={10}
      className="fill-base-content"
      opacity={0.5}
    >
      {label}
    </text>
  </g>
)

const RubikCrossNet: React.FC<RubikCrossNetProps> = ({ frontFace }) => {
  // Cross layout:
  //        [Up]
  //  [Left][Front][Right][Back]
  //        [Down]
  const spacing = FACE_SIZE + 6
  const topLeft = { x: spacing, y: 0 } // Up
  const midRow = [
    { x: 0,             y: spacing, label: 'Left' },
    { x: spacing,       y: spacing, label: 'Front' },
    { x: spacing * 2,   y: spacing, label: 'Right' },
    { x: spacing * 3,   y: spacing, label: 'Back' },
  ]
  const bottomLeft = { x: spacing, y: spacing * 2 } // Down

  const svgWidth = spacing * 4
  const svgHeight = spacing * 3 + 18

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-sm mx-auto"
      role="img"
      aria-label="Cube cross-net diagram"
    >
      {/* Up face */}
      <FaceGrid x={topLeft.x} y={topLeft.y} label="Up" />
      {/* Middle row */}
      {midRow.map(({ x, y, label }) => (
        <FaceGrid
          key={label}
          x={x}
          y={y}
          cells={label === 'Front' ? frontFace : undefined}
          label={label}
        />
      ))}
      {/* Down face */}
      <FaceGrid x={bottomLeft.x} y={bottomLeft.y} label="Down" />
    </svg>
  )
}

export default RubikCrossNet
