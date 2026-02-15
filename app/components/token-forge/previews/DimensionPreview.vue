<script setup lang="ts">
import type { DimensionToken } from '~/app/types/designTokens'

interface Props {
  dimensionTokens: Record<string, DimensionToken>
  visualType: 'spacing' | 'fontSize' | 'borderRadius' | 'borderWidth'
}

const props = defineProps<Props>()

// Sort tokens by value
const sortedTokens = computed(() => {
  return Object.entries(props.dimensionTokens)
    .sort(([, a], [, b]) => a.$value.value - b.$value.value)
    .map(([name, token]) => ({
      name,
      value: token.$value.value,
      unit: token.$value.unit,
      description: token.$description,
      displayValue: `${token.$value.value}${token.$value.unit}`
    }))
})
</script>

<template>
  <div>
    <!-- Spacing Preview -->
    <div v-if="visualType === 'spacing'" :class="$style.spacingGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.spacingItem"
      >
        <div :class="$style.spacingLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div :class="$style.spacingBar">
          <div
            :class="$style.spacingBarFill"
            :style="{ width: `${token.value}px` }"
          />
        </div>
      </div>
    </div>

    <!-- Font Size Preview -->
    <div v-else-if="visualType === 'fontSize'" :class="$style.fontSizeGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.fontSizeItem"
      >
        <div :class="$style.fontSizeLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div
          :class="$style.fontSizePreview"
          :style="{ fontSize: `${token.value}${token.unit}` }"
        >
          Aa
        </div>
      </div>
    </div>

    <!-- Border Radius Preview -->
    <div v-else-if="visualType === 'borderRadius'" :class="$style.borderRadiusGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.borderRadiusItem"
      >
        <div :class="$style.borderRadiusLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div
          :class="$style.borderRadiusBox"
          :style="{ borderRadius: `${token.value}${token.unit}` }"
        />
      </div>
    </div>

    <!-- Border Width Preview -->
    <div v-else-if="visualType === 'borderWidth'" :class="$style.borderWidthGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.borderWidthItem"
      >
        <div :class="$style.borderWidthLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div :class="$style.borderWidthPreview">
          <div
            :class="$style.borderWidthLine"
            :style="{ borderBottomWidth: `${token.value}${token.unit}` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
/* Spacing Styles */
.spacingGrid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spacingItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spacingLabel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.name {
  font-weight: 600;
  color: #374151;
}

.value {
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.75rem;
}

.spacingBar {
  height: 32px;
  background: #f3f4f6;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.spacingBarFill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 3px;
  max-width: 100%;
}

/* Font Size Styles */
.fontSizeGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.fontSizeItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.fontSizeLabel {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fontSizePreview {
  color: #111827;
  font-weight: 600;
  text-align: center;
  padding: 0.5rem 0;
}

/* Border Radius Styles */
.borderRadiusGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.borderRadiusItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.borderRadiusLabel {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.borderRadiusBox {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border: 2px solid #2563eb;
}

/* Border Width Styles */
.borderWidthGrid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.borderWidthItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.borderWidthLabel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.borderWidthPreview {
  padding: 1rem 0;
}

.borderWidthLine {
  width: 100%;
  border-bottom-style: solid;
  border-bottom-color: #3b82f6;
}
</style>
