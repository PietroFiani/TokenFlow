/**
 * Composable for clipboard operations
 */
export const useClipboard = () => {
  /**
   * Copy text to clipboard
   * @param value - Text to copy
   * @returns Promise<boolean> - Success status
   */
  async function copy(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  return { copy }
}
