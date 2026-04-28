/**
 * Rubik's Cube color utilities.
 * sRGB ↔ CIELAB conversion and CIE76 nearest-color mapping.
 */

export interface LabColor {
  L: number
  a: number
  b: number
}

export const RUBIK_COLORS = [
  { name: 'White',  hex: '#FFFFFF', rgb: [255, 255, 255] },
  { name: 'Yellow', hex: '#FFD500', rgb: [255, 213, 0]   },
  { name: 'Red',    hex: '#C41E3A', rgb: [196, 30, 58]   },
  { name: 'Orange', hex: '#FF5800', rgb: [255, 88, 0]    },
  { name: 'Green',  hex: '#009B48', rgb: [0, 155, 72]    },
  { name: 'Blue',   hex: '#0046AD', rgb: [0, 70, 173]    },
] as const

export type RubikColorIndex = 0 | 1 | 2 | 3 | 4 | 5

const RUBIK_LAB: LabColor[] = []

function srgbToLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)
  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb
  const z = 0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb
  return [x, y, z]
}

const D65_X = 0.95047
const D65_Y = 1.00000
const D65_Z = 1.08883

function labF(t: number): number {
  const delta = 6 / 29
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29
}

export function rgbToLab(r: number, g: number, b: number): LabColor {
  const [x, y, z] = rgbToXyz(r, g, b)
  const fx = labF(x / D65_X)
  const fy = labF(y / D65_Y)
  const fz = labF(z / D65_Z)
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

export function cie76(c1: LabColor, c2: LabColor): number {
  return Math.sqrt(
    (c1.L - c2.L) ** 2 +
    (c1.a - c2.a) ** 2 +
    (c1.b - c2.b) ** 2
  )
}

/** CIEDE2000 color difference — more perceptually uniform than CIE76 */
export function ciede2000(lab1: LabColor, lab2: LabColor): number {
  const { L: L1, a: a1, b: b1 } = lab1
  const { L: L2, a: a2, b: b2 } = lab2

  const kL = 1, kC = 1, kH = 1
  const avgL = (L1 + L2) / 2
  const C1 = Math.sqrt(a1 * a1 + b1 * b1)
  const C2 = Math.sqrt(a2 * a2 + b2 * b2)
  const avgC = (C1 + C2) / 2
  const avgC7 = avgC ** 7
  const G = 0.5 * (1 - Math.sqrt(avgC7 / (avgC7 + 25 ** 7)))
  const a1p = a1 * (1 + G)
  const a2p = a2 * (1 + G)
  const C1p = Math.sqrt(a1p * a1p + b1 * b1)
  const C2p = Math.sqrt(a2p * a2p + b2 * b2)
  const avgCp = (C1p + C2p) / 2

  let h1p = Math.atan2(b1, a1p) * (180 / Math.PI)
  if (h1p < 0) h1p += 360
  let h2p = Math.atan2(b2, a2p) * (180 / Math.PI)
  if (h2p < 0) h2p += 360

  let avgHp: number
  if (Math.abs(h1p - h2p) > 180) {
    avgHp = (h1p + h2p + 360) / 2
  } else {
    avgHp = (h1p + h2p) / 2
  }

  const T = 1
    - 0.17 * Math.cos((avgHp - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * avgHp) * Math.PI / 180)
    + 0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180)

  let dhp: number
  if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360
  } else {
    dhp = h2p - h1p + 360
  }

  const dLp = L2 - L1
  const dCp = C2p - C1p
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * Math.PI / 180)

  const SL = 1 + (0.015 * (avgL - 50) ** 2) / Math.sqrt(20 + (avgL - 50) ** 2)
  const SC = 1 + 0.045 * avgCp
  const SH = 1 + 0.015 * avgCp * T

  const dTheta = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2))
  const avgCp7 = avgCp ** 7
  const RC = 2 * Math.sqrt(avgCp7 / (avgCp7 + 25 ** 7))
  const RT = -Math.sin((2 * dTheta) * Math.PI / 180) * RC

  return Math.sqrt(
    (dLp / (kL * SL)) ** 2 +
    (dCp / (kC * SC)) ** 2 +
    (dHp / (kH * SH)) ** 2 +
    RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
  )
}

function ensureRubikLab() {
  if (RUBIK_LAB.length === 0) {
    for (const c of RUBIK_COLORS) {
      RUBIK_LAB.push(rgbToLab(c.rgb[0], c.rgb[1], c.rgb[2]))
    }
  }
}

export function nearestRubikColor(r: number, g: number, b: number): RubikColorIndex {
  ensureRubikLab()
  const lab = rgbToLab(r, g, b)
  let minDist = Infinity
  let minIdx: RubikColorIndex = 0
  for (let i = 0; i < RUBIK_LAB.length; i++) {
    const d = cie76(lab, RUBIK_LAB[i])
    if (d < minDist) {
      minDist = d
      minIdx = i as RubikColorIndex
    }
  }
  return minIdx
}

export const GRID_PRESETS = [100, 125, 150, 175, 200, 250, 300] as const
export type GridPreset = typeof GRID_PRESETS[number]

export function computeGridDimensions(
  imgWidth: number,
  imgHeight: number,
  longSide: GridPreset
): { cols: number; rows: number } {
  if (imgWidth >= imgHeight) {
    const cols = longSide
    const rows = Math.max(1, Math.round((imgHeight / imgWidth) * longSide))
    return { cols, rows }
  }
  const rows = longSide
  const cols = Math.max(1, Math.round((imgWidth / imgHeight) * longSide))
  return { cols, rows }
}

export default {
  RUBIK_COLORS,
  GRID_PRESETS,
  rgbToLab,
  cie76,
  nearestRubikColor,
  computeGridDimensions,
}
