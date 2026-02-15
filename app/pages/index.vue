<script setup lang="ts">
import { onMounted } from 'vue'
import type { ColorFormat } from '~/app/types/palette'

// Use composables
const { palettes, activeFormat, showJsonPreview, addPalette, removePalette, renamePalette, generateFlatJSON, toggleJsonPreview } = usePaletteState()
const { copy } = useClipboard()
const { downloadJson } = useDownload()
const { loadDefaults } = useDefaultPalettes()

// Load default palettes on mount
onMounted(() => {
  loadDefaults(addPalette)
})

function copyJSON() {
  const jsonString = JSON.stringify(generateFlatJSON(), null, 2)
  copy(jsonString)
}

function downloadJSON() {
  downloadJson(generateFlatJSON(), `palettes-${Date.now()}.json`)
}
</script>

<template>
  <div :class="$style.view">
    <p :class="$style.subtitle">
      Generate professional 12-shade color palettes using OKLCH color space
    </p>

    <div :class="$style.controls">
        <div :class="$style.colorInputSection">
          <ColorInput @add-color="addPalette" />
        </div>

        <div :class="$style.rightControls">
          <div :class="$style.formatTabs">
            <DsButton
              v-for="format in ['hex', 'rgb', 'hsl', 'oklch']"
              :key="format"
              variant="toggle"
              size="sm"
              :active="activeFormat === format"
              @click="activeFormat = format as ColorFormat"
            >
              {{ format.toUpperCase() }}
            </DsButton>
          </div>

          <DsButton
            v-if="palettes.length > 0"
            variant="secondary"
            @click="toggleJsonPreview"
          >
            {{ showJsonPreview ? 'Hide' : 'View' }} JSON
          </DsButton>
      </div>
    </div>

    <!-- JSON Preview -->
    <DsCard v-if="showJsonPreview && palettes.length > 0" :class="$style.jsonPreview">
        <div :class="$style.jsonHeader">
          <h3 :class="$style.jsonTitle">JSON Preview</h3>
          <div :class="$style.jsonActions">
            <DsButton variant="outline" size="sm" @click="copyJSON">
              Copy
            </DsButton>
            <DsButton variant="outline" size="sm" @click="downloadJSON">
              Download
            </DsButton>
          </div>
        </div>
      <pre :class="$style.jsonCode">{{ JSON.stringify(generateFlatJSON(), null, 2) }}</pre>
    </DsCard>

    <PaletteDisplay
        :palettes="palettes"
        :active-format="activeFormat"
      @remove="removePalette"
      @rename="renamePalette"
    />
  </div>
</template>

<style module>
.view {
  width: 100%;
  max-width: none;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.colorInputSection {
  flex: 1;
  min-width: 300px;
}

.rightControls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.formatTabs {
  display: flex;
  gap: 0.5rem;
}

.jsonPreview {
  margin-bottom: 2rem;
}

.jsonHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.jsonTitle {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.jsonActions {
  display: flex;
  gap: 0.5rem;
}

.jsonCode {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .rightControls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
