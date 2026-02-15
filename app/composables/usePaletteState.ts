import { ref } from 'vue'
import type { PaletteData, ColorFormat } from '~/app/types/palette'
import { generatePalette } from '~/app/utils/paletteGenerator'

/**
 * Composable for Palette Creator state management
 * Extracted from PaletteView.vue
 */
export const usePaletteState = () => {
  const palettes = ref<PaletteData[]>([])
  const activeFormat = ref<ColorFormat>('hex')
  const showJsonPreview = ref(false)

  /**
   * Add a new palette from a color input
   */
  function addPalette(color: string): void {
    try {
      const result = generatePalette(color)

      const paletteData: PaletteData = {
        id: `palette-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        seedColor: color,
        shades: result,
      }

      palettes.value.push(paletteData)
    } catch (error) {
      console.error('Failed to generate palette:', error)
    }
  }

  /**
   * Remove a palette by ID
   */
  function removePalette(paletteId: string): void {
    palettes.value = palettes.value.filter(p => p.id !== paletteId)
  }

  /**
   * Rename a palette
   */
  function renamePalette(paletteId: string, newName: string): void {
    palettes.value = palettes.value.map(p =>
      p.id === paletteId ? { ...p, name: newName || undefined } : p
    )
  }

  /**
   * Generate flat JSON structure for all palettes
   */
  function generateFlatJSON(): Record<string, Record<string, string>> {
    const flatJSON: Record<string, Record<string, string>> = {}

    palettes.value.forEach((palette, index) => {
      const paletteName = palette.name || `color-${index + 1}`
      flatJSON[paletteName] = {}

      palette.shades.forEach(shade => {
        flatJSON[paletteName][shade.shade.toString()] = shade.hex
      })
    })

    return flatJSON
  }

  /**
   * Toggle JSON preview panel
   */
  function toggleJsonPreview(): void {
    showJsonPreview.value = !showJsonPreview.value
  }

  return {
    // State
    palettes,
    activeFormat,
    showJsonPreview,

    // Actions
    addPalette,
    removePalette,
    renamePalette,
    generateFlatJSON,
    toggleJsonPreview,
  }
}
