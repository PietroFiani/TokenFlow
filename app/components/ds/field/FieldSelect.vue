<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
// useDropdown is auto-imported by Nuxt from ~/composables/useDropdown.ts

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface FieldSelectProps {
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  clearable?: boolean
  // FieldWrapper props
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  showOptional?: boolean
}

const props = withDefaults(defineProps<FieldSelectProps>(), {
  disabled: false,
  searchable: true,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'blur': []
  'focus': []
}>()

// Dropdown state management
const { isOpen, containerRef, dropdownRef, toggleDropdown, closeDropdown } = useDropdown()

// Search state
const searchQuery = ref('')
const highlightedValue = ref<string | number | null>(null)

// Computed selected option
const selectedOption = computed(() =>
  props.options.find(opt => opt.value === props.modelValue)
)

// Filtered options based on search
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

// Wrapper props to pass to FieldWrapper
const wrapperProps = computed(() => ({
  label: props.label,
  hint: props.hint,
  error: props.error,
  errorMessage: props.errorMessage,
  required: props.required,
  showOptional: props.showOptional,
}))

function selectOption(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  closeDropdown()
  searchQuery.value = ''
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  const currentIndex = filteredOptions.value.findIndex(
    opt => opt.value === highlightedValue.value
  )

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % filteredOptions.value.length
      highlightedValue.value = filteredOptions.value[nextIndex]?.value
      break
    case 'ArrowUp':
      e.preventDefault()
      const prevIndex = currentIndex <= 0
        ? filteredOptions.value.length - 1
        : currentIndex - 1
      highlightedValue.value = filteredOptions.value[prevIndex]?.value
      break
    case 'Enter':
      e.preventDefault()
      const highlighted = filteredOptions.value.find(
        o => o.value === highlightedValue.value
      )
      if (highlighted) selectOption(highlighted)
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <FieldWrapper v-bind="wrapperProps">
    <template #input="{ inputId, ariaDescribedBy }">
      <div :class="$style.selectContainer" ref="containerRef">
        <button
          :id="inputId"
          type="button"
          :class="[$style.trigger, { [$style.open]: isOpen, [$style.error]: error }]"
          :disabled="disabled"
          :aria-expanded="isOpen"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="error"
          @click="toggleDropdown"
        >
          <span :class="[$style.value, { [$style.placeholder]: !selectedOption }]">
            {{ selectedOption?.label || placeholder || 'Select...' }}
          </span>

          <!-- Chevron Icon -->
          <svg :class="[$style.chevron, { [$style.open]: isOpen }]" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div v-if="isOpen" :class="$style.dropdown" ref="dropdownRef">
          <input
            v-if="searchable"
            v-model="searchQuery"
            :class="$style.searchInput"
            placeholder="Search..."
            @click.stop
            @keydown.stop
          />

          <div :class="$style.optionsList">
            <button
              v-for="option in filteredOptions"
              :key="option.value"
              :class="[
                $style.option,
                {
                  [$style.selected]: option.value === modelValue,
                  [$style.highlighted]: option.value === highlightedValue
                }
              ]"
              :disabled="option.disabled"
              @click="selectOption(option)"
              @mouseenter="highlightedValue = option.value"
            >
              {{ option.label }}
            </button>

            <div v-if="filteredOptions.length === 0" :class="$style.empty">
              No options found
            </div>
          </div>
        </div>
      </div>
    </template>
  </FieldWrapper>
</template>

<style module>
.selectContainer {
  position: relative;
}

.trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-gap-sm);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--typography-body-sm-default);
  color: var(--color-text-neutral-base-default);
  text-align: left;
  border: var(--border-width-thin) solid var(--color-border-neutral-base-default);
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  cursor: pointer;
  transition: all var(--transition-duration-fast);
}

.trigger:hover:not(:disabled):not(.error):not(.open) {
  border-color: var(--color-border-brand-primary-default);
}

.trigger:focus,
.trigger.open {
  outline: none;
  border: var(--border-width-medium) solid var(--color-border-brand-primary-default);
  box-shadow: none;
}

.trigger.error {
  border-color: var(--color-border-intent-error-default);
}

.trigger.error:focus,
.trigger.error.open {
  border: var(--border-width-thin) solid var(--color-border-intent-error-default);
}

.trigger:disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

.value {
  flex: 1;
  text-align: left;
}

.value.placeholder {
  color: var(--color-text-neutral-subtle-default);
}

.chevron {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  transition: transform var(--transition-duration-fast);
  color: var(--color-text-neutral-muted-default);
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-1));
  left: 0;
  right: 0;
  max-height: 320px;
  background: var(--color-white);
  border: var(--border-width-thin) solid var(--color-border-neutral-base-default);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-20);
  overflow: hidden;
  z-index: var(--z-index-high);
}

.searchInput {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-bottom: var(--border-width-thin) solid var(--color-border-neutral-muted-default);
  font: var(--typography-body-sm-default);
  outline: none;
}

.searchInput::placeholder {
  color: var(--color-text-neutral-subtle-default);
}

.optionsList {
  max-height: 260px;
  overflow-y: auto;
}

.option {
  display: block;
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  font: var(--typography-body-sm-default);
  color: var(--color-text-neutral-base-default);
  transition: background-color var(--transition-duration-fast);
}

.option:hover:not(:disabled),
.option.highlighted {
  background: var(--color-background-neutral-muted-default);
}

.option.selected {
  background: var(--color-background-brand-primary-default);
  color: var(--color-text-brand-primary-default);
  font-weight: var(--font-weight-medium);
}

.option:disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

.empty {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-neutral-subtle-default);
  font: var(--typography-body-sm-default);
}
</style>
