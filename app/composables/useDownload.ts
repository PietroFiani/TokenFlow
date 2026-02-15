/**
 * Composable for file download operations
 * Extracted from designTokenGenerator.ts downloadJson function
 */
export const useDownload = () => {
  /**
   * Download data as JSON file
   * @param data - Data to download
   * @param filename - Name of the file
   */
  function downloadJson(data: any, filename: string = 'download.json'): void {
    const jsonString = JSON.stringify(data, null, 4)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return { downloadJson }
}
