import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useClickOutside } from './useClickOutside'

/**
 * Composable for managing dropdown state and interactions
 * Handles opening/closing, click outside, and escape key
 */
export function useDropdown() {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement>()
  const dropdownRef = ref<HTMLElement>()

  function toggleDropdown() {
    isOpen.value = !isOpen.value
  }

  function closeDropdown() {
    isOpen.value = false
  }

  // Close on click outside
  useClickOutside(containerRef, closeDropdown)

  // Close on Escape key
  function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen.value) {
      closeDropdown()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape)
  })

  return {
    isOpen,
    containerRef,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  }
}
