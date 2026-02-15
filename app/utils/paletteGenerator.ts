import type { ColorShade, OKLCHColor, PaletteConfig } from '~/app/types/palette';
import { parseColorInput, hexToOklch, oklchToHex, rgbToHsl } from './colorConversions';

// ============================================================================
// Lightness Targets (12-shade palette with 100-step increments)
// ============================================================================

const LIGHTNESS_TARGETS = [
  0.99,  // 100 - Lightest (nearly white)
  0.92,  // 200 - Extremely light
  0.84,  // 300 - Very light
  0.76,  // 400 - Light
  0.68,  // 500 - Light-medium
  0.60,  // 600 - Medium-light
  0.52,  // 700 - Medium (typical seed anchor)
  0.44,  // 800 - Medium-dark
  0.36,  // 900 - Dark-medium
  0.28,  // 1000 - Dark
  0.22,  // 1100 - Very dark
  0.16   // 1200 - Darkest (never pure black)
];

const SHADE_NUMBERS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

// ============================================================================
// Chroma Curve Adjustment (Gaussian anchored to seed color)
// ============================================================================

function adjustChroma(
  lightness: number,
  baseChroma: number,
  curveStrength: number = 0.35,
  seedLightness?: number,
  seedChroma?: number,
  seedHue?: number
): number {
  // Gaussian curve centered at L=0.52 (maximum chroma near medium shades)
  const gaussianMultiplier = Math.exp(
    -Math.pow((lightness - 0.52) / curveStrength, 2)
  );

  // Piecewise adjustments based on lightness range
  // More aggressive chroma reduction at extremes for consistent perceived lightness
  let adjustedChroma = baseChroma;

  // Detect near-achromatic colors (very low chroma like #fff8fc)
  const isNearAchromatic = baseChroma < 0.02;

  if (lightness > 0.94) {
    // Shade 100: Adaptive chroma based on seed color properties
    // Low-chroma seeds (muted/pastel) need higher multiplier for visible tint
    // High-chroma seeds (vibrant) need higher multiplier to maintain color identity
    if (baseChroma < 0.15) {
      // Muted colors: Use 20-30% multiplier for visible light tint
      adjustedChroma *= 0.20 + (0.10 * gaussianMultiplier);
      // For near-achromatic colors, ensure minimum visible chroma
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.008);
      }
    } else {
      // Vibrant colors: Balanced chroma to maintain color identity without oversaturation
      adjustedChroma *= 0.22 + (0.10 * gaussianMultiplier);

      // Hue-aware minimum chroma floors to prevent perceptual hue shifts
      // Cool colors (blues, cyans, greens) need higher minimum chroma at very light shades
      // to maintain their perceived hue when converting OKLCH→sRGB
      if (seedHue !== undefined) {
        let minChroma = 0.025; // Default for stable hues (reds, yellows, oranges)

        if (seedHue >= 240 && seedHue < 260) {
          // Blues (worst perceptual shift: -60 to -73° toward cyan)
          minChroma = 0.045;
        } else if (seedHue >= 200 && seedHue < 240) {
          // Blue-greens (significant shift: -40 to -60°)
          minChroma = 0.038;
        } else if (seedHue >= 260 && seedHue < 290) {
          // Blue-purples (moderate shift toward cyan)
          minChroma = 0.035;
        } else if (seedHue >= 140 && seedHue < 200) {
          // Greens/cyans (moderate shift)
          minChroma = 0.032;
        }

        adjustedChroma = Math.max(adjustedChroma, minChroma);
      }
    }
  } else if (lightness > 0.90) {
    // Shade 200: Also adaptive to prevent large jumps
    if (baseChroma < 0.15) {
      // Muted colors: Higher multiplier for visible transition
      adjustedChroma *= 0.50 + (0.15 * gaussianMultiplier);
      // For near-achromatic colors, ensure minimum visible chroma
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.015);
      }
    } else {
      // Vibrant colors: Strong presence to connect with seed color
      adjustedChroma *= 0.40 + (0.15 * gaussianMultiplier);
    }
  } else if (lightness > 0.80) {
    // Shade 300: Also adaptive for smooth transitions
    if (baseChroma < 0.15) {
      // Muted colors: Continue gradual increase
      adjustedChroma *= 0.75 + (0.15 * gaussianMultiplier);
      // For near-achromatic colors, ensure minimum visible chroma
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.025);
      }
    } else {
      // Vibrant colors: Maintain vibrant character approaching seed
      adjustedChroma *= 0.65 + (0.15 * gaussianMultiplier);
    }
  } else if (lightness > 0.68) {
    // Shade 400-500: Approaching peak
    adjustedChroma *= 0.92 + (0.06 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.035);
    }
  } else if (lightness >= 0.44) {
    // Shade 600-800: Peak chroma region
    adjustedChroma *= 0.96 + (0.04 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.040);
    }
  } else if (lightness >= 0.28) {
    // Shade 900: Begin descent
    adjustedChroma *= 0.82 + (0.10 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.035);
    }
  } else if (lightness >= 0.20) {
    // Shade 1000-1100: Steeper descent for dark shades
    adjustedChroma *= 0.65 + (0.12 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.030);
    }
  } else {
    // Shade 1200: Strong chroma reduction for darkest shade
    adjustedChroma *= 0.50 + (0.12 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.025);
    }
  }

  // If seed color provided, blend with seed chroma using smooth Gaussian falloff
  if (seedLightness !== undefined && seedChroma !== undefined) {
    // Calculate distance from current lightness to seed lightness
    const distance = Math.abs(lightness - seedLightness);

    // Use tight Gaussian falloff for seed preservation (sigma = 0.08)
    // This limits blending to only the closest shades
    const blendWeight = Math.exp(-Math.pow(distance / 0.08, 2));

    // Smoothly blend between base curve and seed chroma with Gaussian weight
    adjustedChroma = adjustedChroma * (1.0 - blendWeight) + seedChroma * blendWeight;
  }

  return adjustedChroma;
}

// ============================================================================
// Find Closest Target Index
// ============================================================================

function findClosestTargetIndex(targets: number[], value: number): number {
  let closestIndex = 0;
  let minDiff = Math.abs(targets[0] - value);

  for (let i = 1; i < targets.length; i++) {
    const diff = Math.abs(targets[i] - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

// ============================================================================
// Main Palette Generation Function
// ============================================================================

export function generatePalette(
  seedColorInput: string,
  config: PaletteConfig = {}
): ColorShade[] {
  // Configuration with defaults
  const {
    chromaCurveStrength = 0.35,
    preserveSeed = true
  } = config;

  // Parse input color
  const parsed = parseColorInput(seedColorInput);
  const seedHex = `#${parsed.rgb.r.toString(16).padStart(2, '0')}${parsed.rgb.g.toString(16).padStart(2, '0')}${parsed.rgb.b.toString(16).padStart(2, '0')}`;

  // Convert seed to OKLCH
  const seedOklch = hexToOklch(seedHex);

  // Create a mutable copy of lightness targets
  const targets = [...LIGHTNESS_TARGETS];

  // Anchor seed color to closest target (if preserveSeed is true)
  let seedIndex = -1;
  if (preserveSeed) {
    seedIndex = findClosestTargetIndex(targets, seedOklch.l);
    targets[seedIndex] = seedOklch.l;
  }

  // Generate palette
  const palette: ColorShade[] = targets.map((targetLightness, index) => {
    // If this is the seed color index, preserve the exact seed color
    if (preserveSeed && index === seedIndex) {
      // Use exact seed OKLCH values
      const oklch: OKLCHColor = {
        l: seedOklch.l,
        c: seedOklch.c,
        h: seedOklch.h
      };

      // Convert to HSL and RGB from the original seed hex
      const hsl = rgbToHsl(parsed.rgb);
      const rgb = parsed.rgb;

      return {
        shade: SHADE_NUMBERS[index],
        oklch,
        hex: seedHex.toUpperCase(),
        hsl,
        rgb
      };
    }

    // Apply chroma curve adjustment for non-seed shades
    // Pass seed info so curve adapts to pass through seed point
    const adjustedChroma = adjustChroma(
      targetLightness,
      seedOklch.c,
      chromaCurveStrength,
      seedOklch.l,
      seedOklch.c,
      seedOklch.h
    );

    // Create OKLCH color
    const oklch: OKLCHColor = {
      l: targetLightness,
      c: adjustedChroma,
      h: seedOklch.h
    };

    // Convert to HEX
    const hex = oklchToHex(oklch);

    // Convert to HSL and RGB
    const hsl = rgbToHsl({
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16)
    });

    const rgb = {
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16)
    };

    return {
      shade: SHADE_NUMBERS[index],
      oklch,
      hex,
      hsl,
      rgb
    };
  });

  return palette;
}
