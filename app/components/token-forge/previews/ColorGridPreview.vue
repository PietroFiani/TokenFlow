<script setup lang="ts">
import type { ColorToken, ColorScale } from '~/app/types/designTokens'

interface Props {
  colorTokens: Record<string, ColorScale | ColorToken>
}

const props = defineProps<Props>()

// Separate scales from individual color tokens
const colorScales = computed(() => {
  const scales: Record<string, ColorScale> = {}
  const individual: Record<string, ColorToken> = {}

  Object.entries(props.colorTokens).forEach(([key, value]) => {
    // Check if it's a scale (object with numeric keys like 50, 100, etc.) or individual token
    if (value && typeof value === 'object' && '$type' in value) {
      // It's an individual color token (white, black)
      individual[key] = value as ColorToken
    } else {
      // It's a color scale (primary, secondary, etc.)
      scales[key] = value as ColorScale
    }
  })

  return { scales, individual }
})

// Get text color for contrast on colored backgrounds
function getTextColor(lightness: number): string {
  return lightness > 60 ? '#000000' : '#ffffff'
}

// Extract hex and lightness from color token
function getColorInfo(token: ColorToken) {
  return {
    hex: token.$value.hex,
    lightness: token.$value.components[2]
  }
}
</script>

<template>
  <div :class="$style.container">
    <!-- Color Scales (primary, secondary, neutral, etc.) -->
    <div v-for="(scale, scaleName) in colorScales.scales" :key="scaleName" :class="$style.scaleRow">
      <div :class="$style.scaleLabel">
        {{ scaleName }}
      </div>
      <div :class="$style.swatchGrid">
        <div
          v-for="(token, shade) in scale"
          :key="shade"
          :class="$style.swatch"
          :style="{
            backgroundColor: getColorInfo(token as ColorToken).hex,
            color: getTextColor(getColorInfo(token as ColorToken).lightness)
          }"
        >
          <div :class="$style.shadeNumber">{{ shade }}</div>
          <div :class="$style.hexValue">{{ getColorInfo(token as ColorToken).hex }}</div>
        </div>
      </div>
    </div>

    <!-- Individual Colors (white, black) -->
    <div v-if="Object.keys(colorScales.individual).length > 0" :class="$style.individualRow">
      <div :class="$style.scaleLabel">
        base
      </div>
      <div :class="$style.swatchGrid">
        <div
          v-for="(token, name) in colorScales.individual"
          :key="name"
          :class="$style.swatch"
          :style="{
            backgroundColor: getColorInfo(token).hex,
            color: getTextColor(getColorInfo(token).lightness)
          }"
        >
          <div :class="$style.shadeNumber">{{ name }}</div>
          <div :class="$style.hexValue">{{ getColorInfo(token).hex }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scaleRow,
.individualRow {
  display: flex;
  align-items: flex-start;
}

.scaleLabel {
  min-width: 80px;
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
  padding-top: 0.5rem;
  font-size: 0.875rem;
}

.swatchGrid {
  display: flex;
  width:100%;
  flex-wrap: wrap;
  flex: 1;
}

.swatch {
  min-width: 80px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: transform 0.2s ease;
  cursor: default;
}

.shadeNumber {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.hexValue {
  font-size: 0.75rem;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  opacity: 0.9;
}
</style>
