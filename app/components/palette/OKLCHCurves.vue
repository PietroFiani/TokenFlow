<script setup lang="ts">
import { computed } from 'vue';
import type { ColorShade } from '~/app/types/palette';

interface PaletteData {
  id: string;
  seedColor: string;
  shades: ColorShade[];
}

interface Props {
  palettes: PaletteData[];
}

const props = defineProps<Props>();

// Chart dimensions
const width = 350;
const height = 220;
const padding = { top: 20, right: 20, bottom: 40, left: 60 };
const chartWidth = width - padding.left - padding.right;
const chartHeight = height - padding.top - padding.bottom;

// Color palette for different lines
const lineColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

function getLineColor(index: number): string {
  return lineColors[index % lineColors.length];
}

// Scale functions
function scaleX(shade: number): number {
  const min = 100;
  const max = 1200;
  return padding.left + (shade - min) / (max - min) * chartWidth;
}

function scaleY(value: number, min: number, max: number): number {
  return padding.top + chartHeight - ((value - min) / (max - min) * chartHeight);
}

// Generate SVG path for a dataset
function generatePath(data: { shade: number; value: number }[], min: number, max: number): string {
  if (data.length === 0) return '';
  const points = data.map(d => `${scaleX(d.shade)},${scaleY(d.value, min, max)}`);
  return `M ${points.join(' L ')}`;
}

// Extract data for all palettes
const allPalettesData = computed(() => {
  return props.palettes.map(palette => ({
    id: palette.id,
    seedColor: palette.seedColor,
    lightness: palette.shades.map(s => ({ shade: s.shade, value: s.oklch.l })),
    chroma: palette.shades.map(s => ({ shade: s.shade, value: s.oklch.c })),
    hue: palette.shades.map(s => ({ shade: s.shade, value: s.oklch.h })),
    hslHue: palette.shades.map(s => ({ shade: s.shade, value: s.hsl.h })),
    hslSaturation: palette.shades.map(s => ({ shade: s.shade, value: s.hsl.s })),
    hslLightness: palette.shades.map(s => ({ shade: s.shade, value: s.hsl.l })),
  }));
});

// Calculate max chroma across all palettes
const maxChroma = computed(() => {
  const allChromaValues = props.palettes.flatMap(p => p.shades.map(s => s.oklch.c));
  return Math.max(...allChromaValues, 0.1);
});

// Y-axis ticks
function getYTicks(min: number, max: number, count: number = 5): number[] {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

const lightnessTicks = computed(() => getYTicks(0, 1, 5));
const chromaTicks = computed(() => getYTicks(0, maxChroma.value * 1.1, 5));
const hueTicks = computed(() => getYTicks(0, 360, 5));
const hslHueTicks = computed(() => getYTicks(0, 360, 5));
const hslSaturationTicks = computed(() => getYTicks(0, 100, 5));
const hslLightnessTicks = computed(() => getYTicks(0, 100, 5));

// Format tick labels
function formatTick(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

// Calculate target chroma curve (base algorithm without seed blending)
function calculateTargetChroma(lightness: number, baseChroma: number = 0.15): number {
  const gaussianMultiplier = Math.exp(-Math.pow((lightness - 0.52) / 0.35, 2));

  let adjustedChroma = baseChroma;

  // Detect near-achromatic colors (very low chroma like #fff8fc)
  const isNearAchromatic = baseChroma < 0.02;

  if (lightness > 0.94) {
    // Adaptive chroma based on seed color properties
    if (baseChroma < 0.15) {
      adjustedChroma *= 0.20 + (0.10 * gaussianMultiplier);
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.008);
      }
    } else {
      adjustedChroma *= 0.22 + (0.10 * gaussianMultiplier);

      // Apply default minimum chroma floor for target curve visualization
      // (actual palette generation applies hue-specific minimums)
      const minChroma = 0.025;
      adjustedChroma = Math.max(adjustedChroma, minChroma);
    }
  } else if (lightness > 0.90) {
    // Also adaptive to prevent large jumps
    if (baseChroma < 0.15) {
      adjustedChroma *= 0.50 + (0.15 * gaussianMultiplier);
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.015);
      }
    } else {
      adjustedChroma *= 0.40 + (0.15 * gaussianMultiplier);
    }
  } else if (lightness > 0.80) {
    // Also adaptive for smooth transitions
    if (baseChroma < 0.15) {
      adjustedChroma *= 0.75 + (0.15 * gaussianMultiplier);
      if (isNearAchromatic) {
        adjustedChroma = Math.max(adjustedChroma, 0.025);
      }
    } else {
      adjustedChroma *= 0.65 + (0.15 * gaussianMultiplier);
    }
  } else if (lightness > 0.68) {
    adjustedChroma *= 0.92 + (0.06 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.035);
    }
  } else if (lightness >= 0.44) {
    adjustedChroma *= 0.96 + (0.04 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.040);
    }
  } else if (lightness >= 0.28) {
    adjustedChroma *= 0.82 + (0.10 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.035);
    }
  } else if (lightness >= 0.20) {
    adjustedChroma *= 0.65 + (0.12 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.030);
    }
  } else {
    adjustedChroma *= 0.50 + (0.12 * gaussianMultiplier);
    if (isNearAchromatic) {
      adjustedChroma = Math.max(adjustedChroma, 0.025);
    }
  }

  return adjustedChroma;
}

// Target curve data (what the algorithm aims for)
const targetCurve = computed(() => {
  const lightnessTargets = [0.99, 0.92, 0.84, 0.76, 0.68, 0.60, 0.52, 0.44, 0.36, 0.28, 0.22, 0.16];
  const shadeNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
  const baseChroma = 0.15; // Representative base chroma

  return shadeNumbers.map((shade, i) => ({
    shade,
    value: calculateTargetChroma(lightnessTargets[i], baseChroma)
  }));
});

// Target lightness curve (straight line at defined targets)
const targetLightness = computed(() => {
  const lightnessTargets = [0.99, 0.92, 0.84, 0.76, 0.68, 0.60, 0.52, 0.44, 0.36, 0.28, 0.22, 0.16];
  const shadeNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

  return shadeNumbers.map((shade, i) => ({
    shade,
    value: lightnessTargets[i]
  }));
});
</script>

<template>
  <div v-if="palettes.length > 0" :class="$style.container">
    <div :class="$style.header">
      <h4 :class="$style.title">Color Space Curves - All Palettes</h4>
    </div>

    <!-- Legend -->
    <div :class="$style.legend">
      <div
        v-for="(palette, index) in palettes"
        :key="palette.id"
        :class="$style.legendItem"
      >
        <div
          :class="$style.legendColor"
          :style="{ backgroundColor: getLineColor(index) }"
        ></div>
        <span :class="$style.legendLabel">{{ palette.seedColor }}</span>
      </div>
      <div :class="$style.legendItem">
        <div
          :class="$style.legendColor"
          :style="{
            backgroundColor: '#9ca3af',
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 6px)'
          }"
        ></div>
        <span :class="$style.legendLabel">Target Curve</span>
      </div>
    </div>

    <h5 :class="$style.sectionTitle">OKLCH Color Space</h5>
    <div :class="$style.charts">
      <!-- Lightness Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Lightness (L)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in lightnessTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, 1)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, 1)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in lightnessTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, 1)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 2) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Target curve (dashed gray line) -->
          <g>
            <path
              :d="generatePath(targetLightness, 0, 1)"
              fill="none"
              stroke="#9ca3af"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
            <circle
              v-for="point in targetLightness"
              :key="`target-l-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 1)"
              r="2"
              fill="#9ca3af"
              opacity="0.7"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.lightness, 0, 1)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.lightness"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 1)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>

      <!-- Chroma Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Chroma (C)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in chromaTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, maxChroma * 1.1)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, maxChroma * 1.1)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in chromaTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, maxChroma * 1.1)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 2) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Target curve (dashed gray line) -->
          <g>
            <path
              :d="generatePath(targetCurve, 0, maxChroma * 1.1)"
              fill="none"
              stroke="#9ca3af"
              stroke-width="2"
              stroke-dasharray="5,5"
              :class="$style.targetLine"
            />
            <circle
              v-for="point in targetCurve"
              :key="`target-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, maxChroma * 1.1)"
              r="2"
              fill="#9ca3af"
              opacity="0.7"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.chroma, 0, maxChroma * 1.1)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.chroma"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, maxChroma * 1.1)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>

      <!-- Hue Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Hue (H)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in hueTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, 360)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, 360)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in hueTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, 360)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 0) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.hue, 0, 360)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.hue"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 360)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>
    </div>

    <h5 :class="$style.sectionTitle">HSL Color Space</h5>
    <div :class="$style.charts">
      <!-- HSL Hue Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Hue (H)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in hslHueTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, 360)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, 360)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in hslHueTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, 360)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 0) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.hslHue, 0, 360)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.hslHue"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 360)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>

      <!-- HSL Saturation Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Saturation (S)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in hslSaturationTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, 100)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, 100)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in hslSaturationTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, 100)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 0) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.hslSaturation, 0, 100)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.hslSaturation"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 100)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>

      <!-- HSL Lightness Chart -->
      <div :class="$style.chartWrapper">
        <h5 :class="$style.chartTitle">Lightness (L)</h5>
        <svg :width="width" :height="height" :class="$style.svg">
          <!-- Grid lines -->
          <g :class="$style.grid">
            <line
              v-for="tick in hslLightnessTicks"
              :key="tick"
              :x1="padding.left"
              :y1="scaleY(tick, 0, 100)"
              :x2="width - padding.right"
              :y2="scaleY(tick, 0, 100)"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Y-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="padding.top"
              :x2="padding.left"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
            <text
              v-for="tick in hslLightnessTicks"
              :key="tick"
              :x="padding.left - 5"
              :y="scaleY(tick, 0, 100)"
              text-anchor="end"
              alignment-baseline="middle"
              :class="$style.axisLabel"
            >
              {{ formatTick(tick, 0) }}
            </text>
          </g>

          <!-- X-axis -->
          <g :class="$style.axis">
            <line
              :x1="padding.left"
              :y1="height - padding.bottom"
              :x2="width - padding.right"
              :y2="height - padding.bottom"
              stroke="#6b7280"
              stroke-width="2"
            />
          </g>

          <!-- Data lines for all palettes -->
          <g v-for="(paletteData, index) in allPalettesData" :key="paletteData.id">
            <path
              :d="generatePath(paletteData.hslLightness, 0, 100)"
              fill="none"
              :stroke="getLineColor(index)"
              stroke-width="2"
              :class="$style.line"
            />
            <circle
              v-for="point in paletteData.hslLightness"
              :key="`${paletteData.id}-${point.shade}`"
              :cx="scaleX(point.shade)"
              :cy="scaleY(point.value, 0, 100)"
              r="3"
              :fill="getLineColor(index)"
              :class="$style.point"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.legendItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legendColor {
  width: 20px;
  height: 20px;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.legendLabel {
  font-family: monospace;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
}

.charts {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: start;
  width: 100%;
}

.chartWrapper {
  display: flex;
  flex-direction: column;
}

.chartTitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.sectionTitle {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 3rem 0 1.5rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  text-align: center;
  border: 2px solid #e5e7eb;
}

.svg {
  display: block;
}

.axisLabel {
  font-size: 10px;
  fill: #6b7280;
  font-family: monospace;
}

.line {
  transition: stroke-width 0.2s;
}

.line:hover {
  stroke-width: 3;
}

.point {
  transition: r 0.2s;
}

.point:hover {
  r: 5;
}

@media (max-width: 1200px) {
  .charts {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .legend {
    gap: 0.5rem;
  }
}

@media (min-width: 1201px) {
  .charts {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr !important;
  }
}
</style>
