<script setup lang="ts">
import type { ColorShade, ColorFormat, PaletteData } from '~/app/types/palette';
import OKLCHCurves from './OKLCHCurves.vue';

const props = withDefaults(defineProps<{
  palettes: PaletteData[];
  activeFormat: ColorFormat;
  showControls?: boolean;
  showCurves?: boolean;
  roleLabels?: Record<string, string>;
}>(), {
  showControls: true,
  showCurves: true,
});

const emit = defineEmits<{
  remove: [paletteId: string];
  rename: [paletteId: string, newName: string];
}>();

function handleRename(paletteId: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const newName = input.value.trim();
  emit('rename', paletteId, newName);
}

function getDisplayValue(shade: ColorShade, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return shade.hex;
    case 'rgb':
      return `rgb(${shade.rgb.r}, ${shade.rgb.g}, ${shade.rgb.b})`;
    case 'hsl':
      return `hsl(${shade.hsl.h}, ${shade.hsl.s}%, ${shade.hsl.l}%)`;
    case 'oklch':
      return `oklch(${shade.oklch.l.toFixed(2)} ${shade.oklch.c.toFixed(2)} ${shade.oklch.h.toFixed(0)})`;
    default:
      return shade.hex;
  }
}

async function copyColor(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('Failed to copy color:', error);
  }
}
</script>

<template>
  <div v-if="palettes.length > 0" :class="$style.container">
    <!-- Palettes Grid -->
    <div :class="$style.palettesGrid">
      <div
        v-for="palette in palettes"
        :key="palette.id"
        :class="$style.paletteRow"
      >
        <!-- Palette Header -->
        <div :class="$style.paletteHeader">
          <div :class="$style.paletteInfo">
            <input
              v-if="showControls"
              type="text"
              :class="$style.paletteNameInput"
              :value="palette.name || ''"
              :placeholder="roleLabels?.[palette.id] || `Color ${palettes.indexOf(palette) + 1}`"
              @blur="handleRename(palette.id, $event)"
              @keyup.enter="($event.target as HTMLInputElement).blur()"
            />
            <span v-else :class="$style.paletteName">
              {{ palette.name || roleLabels?.[palette.id] || `Color ${palettes.indexOf(palette) + 1}` }}
            </span>
            <div :class="$style.seedColorInfo">
              <div
                :class="$style.seedSwatch"
                :style="{ backgroundColor: palette.seedColor }"
              ></div>
              <span :class="$style.seedColor">{{ palette.seedColor }}</span>
            </div>
          </div>
          <button
            v-if="showControls"
            :class="$style.removeBtn"
            @click="emit('remove', palette.id)"
            title="Delete palette"
          >
            ✕
          </button>
        </div>

        <!-- Shades Row -->
        <div :class="$style.shadesRow">
          <div
            v-for="shade in palette.shades"
            :key="shade.shade"
            :class="$style.shadeItem"
          >
            <div
              :class="$style.shadeColor"
              :style="{ backgroundColor: shade.hex }"
              @click="copyColor(getDisplayValue(shade, props.activeFormat))"
              :title="`Click to copy: ${getDisplayValue(shade, props.activeFormat)}`"
            ></div>
            <div :class="$style.shadeInfo">
              <span :class="$style.shadeNumber">{{ shade.shade }}</span>
              <span :class="$style.shadeValue">{{ getDisplayValue(shade, props.activeFormat) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OKLCH Curves for all palettes -->
    <OKLCHCurves v-if="showCurves" :palettes="palettes" />
  </div>

  <!-- Empty State -->
  <div v-else :class="$style.emptyState">
    <div :class="$style.emptyIcon">🎨</div>
    <h3 :class="$style.emptyTitle">No Palettes Yet</h3>
    <p :class="$style.emptyText">
      Enter a color above to generate your first palette
    </p>
  </div>
</template>

<style module>
.container {
  width: 100%;
  margin-top: 2rem;
}

/* Palettes Grid */
.palettesGrid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.paletteRow {
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.paletteRow:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* Palette Header */
.paletteHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.paletteInfo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.paletteNameInput {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  outline: none;
  transition: all 0.15s;
  max-width: 300px;
}

.paletteNameInput:hover {
  border-color: #e5e7eb;
  background: #f9fafb;
}

.paletteNameInput:focus {
  border-color: #3b82f6;
  background: white;
}

.paletteName {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  padding: 0.25rem 0.5rem;
}

.seedColorInfo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.seedLabel {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.seedSwatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.seedColor {
  font-family: monospace;
  font-size: 0.875rem;
  color: #6b7280;
}

.removeBtn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  transition: all 0.15s;
  border-radius: 0.25rem;
}

.removeBtn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

/* Shades Row */
.shadesRow {
  display: flex;
  gap: 0;
  overflow-x: auto;
}

.shadeItem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.shadeColor {
  height: 100px;
  cursor: pointer;
}

.shadeInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.shadeNumber {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

.shadeValue {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
}

/* Empty State */
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.emptyIcon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.emptyTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.emptyText {
  font-size: 1rem;
  color: #6b7280;
  max-width: 400px;
}

.curvesSection {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
