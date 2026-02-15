<script setup lang="ts">
import type { NumberToken, DimensionToken } from '~/app/types/designTokens'

interface Props {
  tokens: Record<string, NumberToken | DimensionToken>
  scaleType: 'fontWeight' | 'lineHeight' | 'letterSpacing'
}

const props = defineProps<Props>()

// Sort and process tokens
const sortedTokens = computed(() => {
  return Object.entries(props.tokens)
    .sort(([, a], [, b]) => {
      const aVal = '$value' in a && typeof a.$value === 'number' ? a.$value : (a.$value as any).value
      const bVal = '$value' in b && typeof b.$value === 'number' ? b.$value : (b.$value as any).value
      return aVal - bVal
    })
    .map(([name, token]) => {
      const isNumber = typeof token.$value === 'number'
      return {
        name,
        value: isNumber ? token.$value : (token.$value as any).value,
        unit: isNumber ? '' : (token.$value as any).unit,
        displayValue: isNumber ? token.$value : `${(token.$value as any).value}${(token.$value as any).unit}`,
        description: token.$description
      }
    })
})

const sampleText = 'The quick brown fox jumps over the lazy dog'
const multilineText = 'Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values in order to maintain a scalable and consistent visual system.'
</script>

<template>
  <div>
    <!-- Font Weight Preview -->
    <div v-if="scaleType === 'fontWeight'" :class="$style.fontWeightGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.fontWeightItem"
      >
        <div :class="$style.tokenLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div
          :class="$style.fontWeightText"
          :style="{ fontWeight: token.value }"
        >
          {{ sampleText }}
        </div>
      </div>
    </div>

    <!-- Line Height Preview -->
    <div v-else-if="scaleType === 'lineHeight'" :class="$style.lineHeightGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.lineHeightItem"
      >
        <div :class="$style.tokenLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div
          :class="$style.lineHeightText"
          :style="{ lineHeight: token.value }"
        >
          {{ multilineText }}
        </div>
      </div>
    </div>

    <!-- Letter Spacing Preview -->
    <div v-else-if="scaleType === 'letterSpacing'" :class="$style.letterSpacingGrid">
      <div
        v-for="token in sortedTokens"
        :key="token.name"
        :class="$style.letterSpacingItem"
      >
        <div :class="$style.tokenLabel">
          <span :class="$style.name">{{ token.name }}</span>
          <span :class="$style.value">{{ token.displayValue }}</span>
        </div>
        <div
          :class="$style.letterSpacingText"
          :style="{ letterSpacing: `${token.value}${token.unit}` }"
        >
          {{ sampleText }}
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.tokenLabel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
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

/* Font Weight Styles */
.fontWeightGrid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fontWeightItem {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.fontWeightText {
  font-size: 1.125rem;
  color: #111827;
}

/* Line Height Styles */
.lineHeightGrid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lineHeightItem {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.lineHeightText {
  font-size: 1rem;
  color: #374151;
}

/* Letter Spacing Styles */
.letterSpacingGrid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.letterSpacingItem {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.letterSpacingText {
  font-size: 1rem;
  color: #374151;
}
</style>
