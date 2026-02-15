<script setup lang="ts">
import type { BrandColorEntry } from '~/app/types/designTokens';
import { parseColorInput, rgbToHex } from '~/app/utils/colorConversions';
import ColorInput from '~/app/components/palette/ColorInput.vue';

const props = defineProps<{
  colors: BrandColorEntry[];
}>();

const emit = defineEmits<{
  'update:colors': [value: BrandColorEntry[]];
}>();

const roleLabels: Record<string, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
};

function normalizeToHex(color: string): string {
  try {
    const parsed = parseColorInput(color);
    return rgbToHex(parsed.rgb);
  } catch {
    return color;
  }
}

function handleColorSet(index: number, color: string) {
  const hex = normalizeToHex(color);
  const updated = props.colors.map((c, i) => {
    if (i !== index) return { ...c };
    return { ...c, seedColor: hex };
  });
  emit('update:colors', updated);
}

function toggleEnabled(index: number, enabled: boolean) {
  const updated = props.colors.map((c, i) => {
    if (i !== index) return { ...c };
    return { ...c, enabled };
  });
  emit('update:colors', updated);
}

function clearColor(index: number) {
  const updated = props.colors.map((c, i) => {
    if (i !== index) return { ...c };
    return { ...c, seedColor: '' };
  });
  emit('update:colors', updated);
}
</script>

<template>
  <div :class="$style.section">
    <h3 :class="$style.heading">Brand Colors</h3>

    <div
      v-for="(entry, index) in colors"
      :key="entry.role"
      :class="$style.colorRow"
    >
      <div :class="$style.rowHeader">
        <div :class="$style.roleBadge">
          <span
            :class="$style.roleDot"
            :style="entry.seedColor ? { backgroundColor: entry.seedColor } : {}"
          ></span>
          <span :class="$style.roleLabel">{{ roleLabels[entry.role] }}</span>
        </div>

        <label v-if="entry.role !== 'primary'" :class="$style.toggle">
          <input
            type="checkbox"
            :checked="entry.enabled"
            @change="toggleEnabled(index, ($event.target as HTMLInputElement).checked)"
          />
          <span :class="$style.toggleText">Enable</span>
        </label>
      </div>

      <div v-if="entry.enabled" :class="$style.rowContent">
        <div v-if="!entry.seedColor" :class="$style.inputArea">
          <ColorInput @add-color="(color: string) => handleColorSet(index, color)" />
        </div>

        <div v-else :class="$style.colorPreview">
          <div
            :class="$style.swatch"
            :style="{ backgroundColor: entry.seedColor }"
          ></div>
          <span :class="$style.colorValue">{{ entry.seedColor }}</span>
          <button :class="$style.changeBtn" @click="clearColor(index)">
            Change
          </button>
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

.colorRow {
  margin-bottom: 1.25rem;
}

.colorRow:last-child {
  margin-bottom: 0;
}

.rowHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.roleBadge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.roleDot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
  flex-shrink: 0;
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
  margin-top: 0.25rem;
}

.inputArea {
  max-width: 100%;
}

.colorPreview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.swatch {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.colorValue {
  font-family: monospace;
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
}

.changeBtn {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #3b82f6;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.changeBtn:hover {
  background: #eff6ff;
}
</style>
