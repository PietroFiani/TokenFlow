<script setup lang="ts">
import { computed } from 'vue';
import type { FontFamilyEntry } from '~/app/types/designTokens';
import { FONT_FALLBACK_STACKS, LETTER_SPACING_TOKENS } from '~/app/utils/fixedTokens';

const props = defineProps<{
  fonts: FontFamilyEntry[];
}>();

const emit = defineEmits<{
  'update:fonts': [value: FontFamilyEntry[]];
}>();

const fallbackOptions = Object.keys(FONT_FALLBACK_STACKS);

function updateFont(index: number, field: keyof FontFamilyEntry, value: string | boolean | string[]) {
  const updated = props.fonts.map((f, i) => {
    if (i !== index) return { ...f };
    return { ...f, [field]: value };
  });
  emit('update:fonts', updated);
}

function updateFallback(index: number, stackName: string) {
  const fallbacks = FONT_FALLBACK_STACKS[stackName] || [];
  updateFont(index, 'fallbacks', fallbacks);
}

function getActiveFallbackName(index: number): string {
  const current = props.fonts[index].fallbacks;
  for (const [name, stack] of Object.entries(FONT_FALLBACK_STACKS)) {
    if (JSON.stringify(stack) === JSON.stringify(current)) return name;
  }
  return fallbackOptions[0];
}

const fontPreview = computed(() => {
  return props.fonts.map(f => {
    if (!f.familyName) return '';
    return [f.familyName, ...f.fallbacks].join(', ');
  });
});
</script>

<template>
  <div :class="$style.section">
    <h3 :class="$style.heading">Typography</h3>

    <div
      v-for="(font, index) in fonts"
      :key="font.role"
      :class="$style.fontRow"
    >
      <div :class="$style.rowHeader">
        <span :class="$style.roleLabel">{{ font.role === 'primary' ? 'Primary Font' : 'Secondary Font' }}</span>
        <label v-if="font.role === 'secondary'" :class="$style.toggle">
          <input
            type="checkbox"
            :checked="font.enabled"
            @change="updateFont(index, 'enabled', ($event.target as HTMLInputElement).checked)"
          />
          <span :class="$style.toggleText">Enable</span>
        </label>
      </div>

      <div v-if="font.enabled" :class="$style.rowContent">
        <div :class="$style.inputGroup">
          <input
            type="text"
            :class="$style.input"
            :value="font.familyName"
            placeholder="e.g. DM Sans, PP Neue Montreal"
            @input="updateFont(index, 'familyName', ($event.target as HTMLInputElement).value)"
          />
          <select
            :class="$style.select"
            :value="getActiveFallbackName(index)"
            @change="updateFallback(index, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in fallbackOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>

        <div v-if="fontPreview[index]" :class="$style.preview">
          {{ fontPreview[index] }}
        </div>
      </div>
    </div>

    <!-- Letter Spacing Preview -->
    <div :class="$style.divider"></div>
    <div :class="$style.infoSection">
      <span :class="$style.infoLabel">Letter Spacing</span>
      <div :class="$style.tokenPreview">
        <div v-for="(token, key) in LETTER_SPACING_TOKENS" :key="key" :class="$style.tokenItem">
          <span :class="$style.tokenKey">{{ key }}</span>
          <span :class="$style.tokenValue">{{ token.$value.value }}{{ token.$value.unit }}</span>
        </div>
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

.fontRow {
  margin-bottom: 1.25rem;
}

.fontRow:last-child {
  margin-bottom: 0;
}

.rowHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.roleLabel {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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

.rowContent {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inputGroup {
  display: flex;
  gap: 0.5rem;
}

.input {
  flex: 1;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
}

.select {
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  min-width: 140px;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
}

.preview {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  word-break: break-all;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1.25rem 0;
}

.infoSection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.infoLabel {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.tokenPreview {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.tokenItem {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.tokenKey {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.tokenValue {
  font-family: monospace;
  font-size: 0.875rem;
  color: #111827;
}
</style>
