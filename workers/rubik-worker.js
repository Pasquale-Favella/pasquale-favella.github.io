/**
 * Web Worker for Rubik image processing.
 * Receives an ImageBitmap + grid dimensions + dithering flag.
 * Pipeline: canvas resize → Lab conversion → contrast stretch → CIEDE2000 quantization (± F-S dithering)
 */

// --- Color math ---

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function rgbToXyz(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return [
    0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb,
    0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb,
    0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb,
  ];
}

const D65 = [0.95047, 1.0, 1.08883];

function labF(t) {
  const delta = 6 / 29;
  return t > delta * delta * delta ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

function rgbToLab(r, g, b) {
  const [x, y, z] = rgbToXyz(r, g, b);
  const fx = labF(x / D65[0]);
  const fy = labF(y / D65[1]);
  const fz = labF(z / D65[2]);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function ciede2000(lab1, lab2) {
  const L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];
  const L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];

  const avgL = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const avgC7 = Math.pow(avgC, 7);
  const G = 0.5 * (1 - Math.sqrt(avgC7 / (avgC7 + Math.pow(25, 7))));
  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  let h1p = Math.atan2(b1, a1p) * (180 / Math.PI);
  if (h1p < 0) h1p += 360;
  let h2p = Math.atan2(b2, a2p) * (180 / Math.PI);
  if (h2p < 0) h2p += 360;

  let avgHp;
  if (Math.abs(h1p - h2p) > 180) {
    avgHp = (h1p + h2p + 360) / 2;
  } else {
    avgHp = (h1p + h2p) / 2;
  }

  const T = 1
    - 0.17 * Math.cos((avgHp - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * avgHp) * Math.PI / 180)
    + 0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180);

  let dhp;
  if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }

  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * Math.PI / 180);

  const SL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const SC = 1 + 0.045 * avgCp;
  const SH = 1 + 0.015 * avgCp * T;

  const dTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const avgCp7 = Math.pow(avgCp, 7);
  const RC = 2 * Math.sqrt(avgCp7 / (avgCp7 + Math.pow(25, 7)));
  const RT = -Math.sin((2 * dTheta) * Math.PI / 180) * RC;

  return Math.sqrt(
    Math.pow(dLp / SL, 2) +
    Math.pow(dCp / SC, 2) +
    Math.pow(dHp / SH, 2) +
    RT * (dCp / SC) * (dHp / SH)
  );
}

const RUBIK_RGB = [
  [255, 255, 255], // White
  [255, 213, 0],   // Yellow
  [196, 30, 58],   // Red
  [255, 88, 0],    // Orange
  [0, 155, 72],    // Green
  [0, 70, 173],    // Blue
];

const RUBIK_LAB = RUBIK_RGB.map(([r, g, b]) => rgbToLab(r, g, b));

// Precompute palette L range (Blue≈33 to White≈100)
const PALETTE_L_MIN = Math.min(...RUBIK_LAB.map(l => l[0]));
const PALETTE_L_MAX = Math.max(...RUBIK_LAB.map(l => l[0]));

function nearestRubikColor(lab) {
  let minDist = Infinity;
  let minIdx = 0;
  for (let i = 0; i < RUBIK_LAB.length; i++) {
    const d = ciede2000(lab, RUBIK_LAB[i]);
    if (d < minDist) {
      minDist = d;
      minIdx = i;
    }
  }
  return minIdx;
}

// --- Gentle contrast stretch ---
// Maps image L range → Rubik palette L range, preserving tonal relationships.
// Uses percentile clipping (2%/98%) to ignore outliers.
function contrastStretchL(labGrid, totalW, totalH) {
  const allL = [];
  for (let y = 0; y < totalH; y++) {
    for (let x = 0; x < totalW; x++) {
      allL.push(labGrid[y][x][0]);
    }
  }
  allL.sort((a, b) => a - b);

  const lo = allL[Math.floor(allL.length * 0.02)];
  const hi = allL[Math.floor(allL.length * 0.98)];
  const srcRange = hi - lo;
  if (srcRange < 1) return; // flat image, nothing to stretch

  const dstRange = PALETTE_L_MAX - PALETTE_L_MIN;

  for (let y = 0; y < totalH; y++) {
    for (let x = 0; x < totalW; x++) {
      const normalized = Math.max(0, Math.min(1, (labGrid[y][x][0] - lo) / srcRange));
      labGrid[y][x][0] = PALETTE_L_MIN + normalized * dstRange;
    }
  }
}

// --- Floyd-Steinberg error diffusion ---

function floydSteinbergDither(labGrid, width, height) {
  const result = new Array(height);
  for (let y = 0; y < height; y++) {
    result[y] = new Array(width);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldLab = labGrid[y][x];
      const idx = nearestRubikColor(oldLab);
      result[y][x] = idx;

      const newLab = RUBIK_LAB[idx];
      const errL = oldLab[0] - newLab[0];
      const errA = oldLab[1] - newLab[1];
      const errB = oldLab[2] - newLab[2];

      const spread = [
        [x + 1, y,     7 / 16],
        [x - 1, y + 1, 3 / 16],
        [x,     y + 1, 5 / 16],
        [x + 1, y + 1, 1 / 16],
      ];

      for (const [nx, ny, w] of spread) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          labGrid[ny][nx][0] += errL * w;
          labGrid[ny][nx][1] += errA * w;
          labGrid[ny][nx][2] += errB * w;
        }
      }
    }
  }

  return result;
}

function directQuantize(labGrid, width, height) {
  const result = new Array(height);
  for (let y = 0; y < height; y++) {
    result[y] = new Array(width);
    for (let x = 0; x < width; x++) {
      result[y][x] = nearestRubikColor(labGrid[y][x]);
    }
  }
  return result;
}

// --- Main processing ---

self.onmessage = function (e) {
  const { imageBitmap, cols, rows, dithering } = e.data;

  const totalW = cols * 3;
  const totalH = rows * 3;

  // Step 1: Resize using canvas (bilinear interpolation — fast, smooth)
  const canvas = new OffscreenCanvas(totalW, totalH);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0, totalW, totalH);
  const imageData = ctx.getImageData(0, 0, totalW, totalH);
  const pixels = imageData.data;

  // Step 2: Convert all pixels to CIELAB
  const labGrid = new Array(totalH);
  for (let y = 0; y < totalH; y++) {
    labGrid[y] = new Array(totalW);
    for (let x = 0; x < totalW; x++) {
      const idx = (y * totalW + x) * 4;
      labGrid[y][x] = rgbToLab(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
    }
  }

  // Step 3: Gentle contrast stretch — map image L range to palette L range
  contrastStretchL(labGrid, totalW, totalH);

  // Step 4: Quantize (with or without Floyd-Steinberg dithering)
  let colorGrid;
  if (dithering) {
    colorGrid = floydSteinbergDither(labGrid, totalW, totalH);
  } else {
    colorGrid = directQuantize(labGrid, totalW, totalH);
  }

  // Step 5: Pack into cubes[row][col] = [9 color indices]
  const cubes = [];
  for (let row = 0; row < rows; row++) {
    const cubeRow = [];
    for (let col = 0; col < cols; col++) {
      const cells = [];
      for (let cy = 0; cy < 3; cy++) {
        for (let cx = 0; cx < 3; cx++) {
          cells.push(colorGrid[row * 3 + cy][col * 3 + cx]);
        }
      }
      cubeRow.push(cells);
    }
    cubes.push(cubeRow);
  }

  imageBitmap.close();
  self.postMessage({ cubes, rows, cols });
};
