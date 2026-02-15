import { type Ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable for detecting clicks outside an element
 * @param elementRef - Ref to the element to detect clicks outside of
 * @param callback - Function to call when click outside is detected
 */
export function useClickOutside(
  elementRef: Ref<HTMLElement | undefined>,
  callback: () => void
) {
  function handleClick(event: MouseEvent) {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick)
  })
}
