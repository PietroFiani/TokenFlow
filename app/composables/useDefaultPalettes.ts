/**
 * Composable for default palette colors
 */
export const useDefaultPalettes = () => {
  const DEFAULT_COLORS = ['#49B6FF', '#FF499E', '#7DCE82', '#F59E0B', '#8B5CF6']

  /**
   * Load default palettes by calling addPalette for each color
   * @param addPaletteFn - Function to add a palette (takes color string)
   */
  function loadDefaults(addPaletteFn: (color: string) => void): void {
    DEFAULT_COLORS.forEach(color => addPaletteFn(color))
  }

  return {
    DEFAULT_COLORS,
    loadDefaults,
  }
}
