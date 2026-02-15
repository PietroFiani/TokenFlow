import type { OKLCHColor, RGBColor, HSLColor, ParsedColor } from '~/app/types/palette';

// ============================================================================
// Constants for color space conversions
// ============================================================================

const GAMMA_THRESHOLD = 0.04045;

// D65 illuminant transformation matrix (sRGB to XYZ)
const RGB_TO_XYZ_MATRIX = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

// Inverse matrix (XYZ to sRGB)
const XYZ_TO_RGB_MATRIX = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252]
];

// Oklab M1 matrix (XYZ to LMS)
const M1 = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.6338517070]
];

// Oklab M2 matrix (LMS to Lab)
const M2 = [
  [0.2104542553, 0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660]
];

// Inverse matrices
const M1_INV = [
  [1.2270138511, -0.5577999807, 0.2812561490],
  [-0.0405801784, 1.1122568696, -0.0716766787],
  [-0.0763812845, -0.4214819784, 1.5861632204]
];

const M2_INV = [
  [1.0000000000, 0.3963377774, 0.2158037573],
  [1.0000000000, -0.1055613458, -0.0638541728],
  [1.0000000000, -0.0894841775, -1.2914855480]
];

// ============================================================================
// Input Parsing Functions
// ============================================================================

export function parseColorInput(input: string): ParsedColor {
  const trimmed = input.trim();

  // Try HEX
  const hexMatch = trimmed.match(/^#?([0-9A-Fa-f]{6})$/);
  if (hexMatch) {
    return {
      rgb: hexToRgb(hexMatch[1]),
      format: 'hex'
    };
  }

  // Try RGB
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return {
      rgb: {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      },
      format: 'rgb'
    };
  }

  // Try HSL
  const hslMatch = trimmed.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
  if (hslMatch) {
    const hsl: HSLColor = {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3])
    };
    return {
      rgb: hslToRgb(hsl),
      format: 'hsl'
    };
  }

  throw new Error('Invalid color format. Use HEX (#RRGGBB), RGB (rgb(r, g, b)), or HSL (hsl(h, s%, l%))');
}

// ============================================================================
// HEX Conversions
// ============================================================================

export function hexToRgb(hex: string): RGBColor {
  const cleaned = hex.replace(/^#/, '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16)
  };
}

export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// ============================================================================
// HSL Conversions
// ============================================================================

export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// ============================================================================
// Gamma Correction
// ============================================================================

function gammaCorrection(value: number): number {
  // sRGB to Linear RGB
  return value <= GAMMA_THRESHOLD
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function gammaExpansion(value: number): number {
  // Linear RGB to sRGB
  return value <= 0.0031308
    ? value * 12.92
    : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

// ============================================================================
// Matrix Multiplication Helper
// ============================================================================

function multiplyMatrix(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row =>
    row.reduce((sum, val, i) => sum + val * vector[i], 0)
  );
}

// ============================================================================
// RGB ↔ XYZ Conversions
// ============================================================================

function rgbToXyz(rgb: RGBColor): number[] {
  // Normalize to 0-1
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Apply gamma correction
  const linear = [
    gammaCorrection(r),
    gammaCorrection(g),
    gammaCorrection(b)
  ];

  // Transform to XYZ using D65 matrix
  return multiplyMatrix(RGB_TO_XYZ_MATRIX, linear);
}

function xyzToRgb(xyz: number[]): RGBColor {
  // Transform XYZ to linear RGB
  const linear = multiplyMatrix(XYZ_TO_RGB_MATRIX, xyz);

  // Apply gamma expansion
  const srgb = linear.map(gammaExpansion);

  // Clamp to 0-255 range
  return {
    r: Math.max(0, Math.min(255, Math.round(srgb[0] * 255))),
    g: Math.max(0, Math.min(255, Math.round(srgb[1] * 255))),
    b: Math.max(0, Math.min(255, Math.round(srgb[2] * 255)))
  };
}

// ============================================================================
// XYZ ↔ Oklab Conversions
// ============================================================================

function xyzToOklab(xyz: number[]): number[] {
  // XYZ to LMS (cone response)
  const lms = multiplyMatrix(M1, xyz);

  // Apply cube root
  const lmsPrime = lms.map(v => Math.cbrt(v));

  // LMS to Lab
  return multiplyMatrix(M2, lmsPrime);
}

function oklabToXyz(lab: number[]): number[] {
  // Lab to LMS (inverse M2)
  const lmsPrime = multiplyMatrix(M2_INV, lab);

  // Inverse cube root
  const lms = lmsPrime.map(v => v * v * v);

  // LMS to XYZ (inverse M1)
  return multiplyMatrix(M1_INV, lms);
}

// ============================================================================
// Oklab ↔ OKLCH Conversions (Cartesian ↔ Polar)
// ============================================================================

function oklabToOklch(lab: number[]): OKLCHColor {
  const [L, a, b] = lab;

  // Convert to polar coordinates
  const C = Math.sqrt(a * a + b * b);
  let H = Math.atan2(b, a) * 180 / Math.PI;

  // Normalize hue to 0-360
  if (H < 0) H += 360;

  return { l: L, c: C, h: H };
}

function oklchToOklab(oklch: OKLCHColor): number[] {
  const { l, c, h } = oklch;

  // Convert to Cartesian coordinates
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  return [l, a, b];
}

// ============================================================================
// Main Conversion Functions: HEX ↔ OKLCH
// ============================================================================

export function hexToOklch(hex: string): OKLCHColor {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb);
  const lab = xyzToOklab(xyz);
  return oklabToOklch(lab);
}

export function oklchToHex(oklch: OKLCHColor): string {
  const lab = oklchToOklab(oklch);
  const xyz = oklabToXyz(lab);
  const rgb = xyzToRgb(xyz);
  return rgbToHex(rgb);
}

// ============================================================================
// Format Conversion Utilities
// ============================================================================

export function formatOklch(oklch: OKLCHColor): string {
  return `oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h.toFixed(0)})`;
}

export function formatHsl(hsl: HSLColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatRgb(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// ============================================================================
// RGB Gamut Validation
// ============================================================================

/**
 * Checks if an RGB color is within the valid sRGB gamut (0-255 for each channel).
 * @param rgb RGB color object
 * @returns true if color is displayable in sRGB, false otherwise
 */
export function isInRgbGamut(rgb: RGBColor): boolean {
  return rgb.r >= 0 && rgb.r <= 255 &&
         rgb.g >= 0 && rgb.g <= 255 &&
         rgb.b >= 0 && rgb.b <= 255;
}

/**
 * Finds the maximum displayable chroma for a given lightness and hue in OKLCH space.
 * Uses binary search to find the highest chroma that produces a valid RGB color.
 * @param lightness OKLCH lightness (0-1)
 * @param hue OKLCH hue in degrees (0-360)
 * @param baseChroma Initial chroma to start searching from
 * @returns Maximum chroma that fits within sRGB gamut
 */
export function findMaxDisplayableChroma(
  lightness: number,
  hue: number,
  baseChroma: number
): number {
  let low = 0;
  let high = baseChroma;
  let maxChroma = baseChroma;

  // Binary search for maximum displayable chroma (20 iterations for precision)
  for (let i = 0; i < 20; i++) {
    const testChroma = (low + high) / 2;
    const testOklch: OKLCHColor = { l: lightness, c: testChroma, h: hue };

    // Convert to RGB to check if it's in gamut
    const hex = oklchToHex(testOklch);
    const rgb: RGBColor = {
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16)
    };

    if (isInRgbGamut(rgb)) {
      // This chroma works, try higher
      low = testChroma;
      maxChroma = testChroma;
    } else {
      // This chroma is too high, try lower
      high = testChroma;
    }
  }

  // Return with 2% safety margin to avoid edge cases
  return maxChroma * 0.98;
}
