<script setup lang="ts">
import { computed } from 'vue';
import type { BreakpointsConfig } from '~/app/types/designTokens';
import { DEFAULT_BREAKPOINTS } from '~/app/utils/fixedTokens';

const props = defineProps<{
  breakpointsConfig: BreakpointsConfig;
}>();

const emit = defineEmits<{
  'update:breakpointsConfig': [value: BreakpointsConfig];
}>();

const breakpointLabels: Record<string, string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
  wide: 'Wide',
};

function toggleEnabled(enabled: boolean) {
  emit('update:breakpointsConfig', {
    ...props.breakpointsConfig,
    enabled,
  });
}

function updateBreakpoint(index: number, value: number) {
  const updated = props.breakpointsConfig.breakpoints.map((bp, i) => {
    if (i !== index) return { ...bp };
    return { ...bp, value };
  });
  emit('update:breakpointsConfig', {
    ...props.breakpointsConfig,
    breakpoints: updated,
  });
}

function resetToDefaults() {
  emit('update:breakpointsConfig', {
    ...props.breakpointsConfig,
    breakpoints: DEFAULT_BREAKPOINTS.map(bp => ({ ...bp })),
  });
}

// Validation: Check if values are in ascending order
const hasValidOrder = computed(() => {
  const values = props.breakpointsConfig.breakpoints.map(bp => bp.value);
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) return false;
  }
  return true;
});
</script>

<template>
  <div :class="$style.section">
    <div :class="$style.header">
      <h3 :class="$style.heading">Breakpoints</h3>
      <label :class="$style.toggle">
        <input
          type="checkbox"
          :checked="breakpointsConfig.enabled"
          @change="toggleEnabled(($event.target as HTMLInputElement).checked)"
        />
        <span :class="$style.toggleText">Enable</span>
      </label>
    </div>

    <div v-if="breakpointsConfig.enabled" :class="$style.content">
      <!-- Validation Warning -->
      <div v-if="!hasValidOrder" :class="$style.warning">
        ⚠️ Breakpoint values must be in ascending order
      </div>

      <!-- Breakpoint Inputs -->
      <div :class="$style.grid">
        <div
          v-for="(bp, index) in breakpointsConfig.breakpoints"
          :key="bp.name"
          :class="$style.inputRow"
        >
          <label :class="$style.label">
            {{ breakpointLabels[bp.name] }}
          </label>
          <div :class="$style.inputWrapper">
            <input
              type="number"
              :class="$style.input"
              :value="bp.value"
              min="1"
              max="9999"
              step="1"
              @input="updateBreakpoint(index, parseInt(($event.target as HTMLInputElement).value) || 0)"
            />
            <span :class="$style.unit">px</span>
          </div>
        </div>
      </div>

      <!-- Reset Button -->
      <button :class="$style.resetBtn" @click="resetToDefaults">
        Reset to Defaults
      </button>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
}

.toggleText {
  font-size: 0.8125rem;
  color: #6b7280;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning {
  padding: 0.75rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.inputRow {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.inputWrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  outline: none;
  width: 100%;
}

.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button {
  opacity: 1;
}

.unit {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
}

.resetBtn {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  width: fit-content;
}

.resetBtn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}
</style>
