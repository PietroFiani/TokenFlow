export interface OKLCHColor {
  l: number; // Lightness: 0-1
  c: number; // Chroma: 0-0.4
  h: number; // Hue: 0-360
}

export interface RGBColor {
  r: number; // Red: 0-255
  g: number; // Green: 0-255
  b: number; // Blue: 0-255
}

export interface HSLColor {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  l: number; // Lightness: 0-100
}

export interface ColorShade {
  shade: number;           // Shade number: 100, 150, 200, ..., 950
  oklch: OKLCHColor;       // OKLCH representation
  hex: string;             // HEX format: #RRGGBB
  hsl: HSLColor;           // HSL representation
  rgb: RGBColor;           // RGB representation
}

export interface PaletteConfig {
  chromaCurveStrength?: number;  // Curve steepness: 0.2-0.6, default 0.35
  preserveSeed?: boolean;         // Anchor seed color in output, default true
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export interface PaletteData {
  id: string;
  seedColor: string;
  shades: ColorShade[];
  name?: string;
}

export interface ParsedColor {
  rgb: RGBColor;
  format: ColorFormat;
}
