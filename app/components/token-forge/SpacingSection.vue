<script setup lang="ts">
import type { SpacingBase } from '~/app/types/designTokens';
import { SPACING_SCALE_4PX, SPACING_SCALE_8PX } from '~/app/utils/fixedTokens';
import { computed } from 'vue';

const props = defineProps<{
  spacingBase: SpacingBase;
}>();

const emit = defineEmits<{
  'update:spacingBase': [value: SpacingBase];
}>();

const previewScale = computed(() => {
  return props.spacingBase === 4 ? SPACING_SCALE_4PX : SPACING_SCALE_8PX;
});

const previewKeys = ['1', '2', '3', '4', '6', '8', '12'];
</script>

<template>
  <div :class="$style.section">
    <h3 :class="$style.heading">Spacing Grid</h3>

    <div :class="$style.toggleGroup">
      <button
        :class="[$style.toggleBtn, { [$style.toggleBtnActive]: spacingBase === 4 }]"
        @click="emit('update:spacingBase', 4)"
      >
        4px
      </button>
      <button
        :class="[$style.toggleBtn, { [$style.toggleBtnActive]: spacingBase === 8 }]"
        @click="emit('update:spacingBase', 8)"
      >
        8px
      </button>
    </div>

    <div :class="$style.preview">
      <div
        v-for="key in previewKeys"
        :key="key"
        :class="$style.previewItem"
      >
        <div
          :class="$style.previewBar"
          :style="{ width: previewScale[key].$value.value + 'px' }"
        ></div>
        <span :class="$style.previewLabel">{{ key }}: {{ previewScale[key].$value.value }}px</span>
      </div>
    </div>
  </div>
</template>

<style module>
.section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.toggleGroup {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  width: fit-content;
  margin-bottom: 1rem;
}

.toggleBtn {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.toggleBtn:hover {
  color: #3b82f6;
}

.toggleBtnActive {
  color: white;
  background-color: #3b82f6;
}

.preview {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.previewItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.previewBar {
  height: 8px;
  min-width: 2px;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.2s;
}

.previewLabel {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
}
</style>
