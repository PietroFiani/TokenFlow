<script setup lang="ts">
import type { NumberToken } from '~/app/types/designTokens'

interface Props {
  opacityTokens: Record<string, NumberToken>
}

const props = defineProps<Props>()

// Sort opacity tokens by value
const sortedOpacities = computed(() => {
  return Object.entries(props.opacityTokens)
    .sort(([, a], [, b]) => a.$value - b.$value)
    .map(([name, token]) => ({
      name,
      value: token.$value,
      percentage: Math.round(token.$value * 100),
      description: token.$description
    }))
})
</script>

<template>
  <div :class="$style.grid">
    <div
      v-for="opacity in sortedOpacities"
      :key="opacity.name"
      :class="$style.opacityItem"
    >
      <!-- Label -->
      <div :class="$style.label">
          <span :class="$style.name">{{ opacity.name }}</span>
          <span :class="$style.percentage">{{ opacity.percentage }}%</span>
      </div>

      <!-- Visual demonstration on light background -->
      <div :class="$style.demoLight">
          <div
            :class="$style.opacityBox"
            :style="{ opacity: opacity.value }"
          />
      </div>

      <!-- Visual demonstration on dark background -->
      <div :class="$style.demoDark">
          <div
            :class="$style.opacityBox"
            :style="{ opacity: opacity.value }"
          />
      </div>

      <!-- Numeric value -->
      <div :class="$style.numericValue">
        {{ opacity.value }}
      </div>
    </div>
  </div>
</template>

<style module>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.opacityItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.name {
  font-weight: 600;
  color: #374151;
}

.percentage {
  color: #6b7280;
  font-size: 0.75rem;
}

.demoLight,
.demoDark {
  position: relative;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.demoLight {
  background: #ffffff;
}

.demoDark {
  background: #1f2937;
}

.opacityBox {
  width: 100%;
  height: 100%;
  background: #000000;
}

.numericValue {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  text-align: center;
}
</style>
