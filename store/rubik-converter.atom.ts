import { atom } from 'jotai'
import type { GridPreset, RubikColorIndex } from '@/utils/RubikUtils'

export interface RubikGridData {
  rows: number
  cols: number
  /** [row][col][cellIndex 0..8] → RubikColorIndex */
  cubes: RubikColorIndex[][][]
}

export const rubikImageAtom = atom<string | null>(null)
export const rubikResolutionAtom = atom<GridPreset>(100)
export const rubikDitheringAtom = atom<boolean>(true)
export const rubikGridDataAtom = atom<RubikGridData | null>(null)
export const rubikConvertingAtom = atom<boolean>(false)
export const rubikSelectedCubeAtom = atom<{ row: number; col: number } | null>(null)
export const rubikPanelOpenAtom = atom<boolean>(false)

export const rubikSelectedCubeDataAtom = atom((get) => {
  const grid = get(rubikGridDataAtom)
  const selected = get(rubikSelectedCubeAtom)
  if (!grid || !selected) return null
  const { row, col } = selected
  if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return null
  return {
    row,
    col,
    cells: grid.cubes[row][col],
  }
})
