<script setup lang="ts">
import { computed } from 'vue'

interface FieldNumberProps {
  modelValue: number | null
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  unitText?: string
  // FieldWrapper props
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  showOptional?: boolean
}

const props = withDefaults(defineProps<FieldNumberProps>(), {
  disabled: false,
  step: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'blur': []
  'focus': []
}>()

// Wrapper props to pass to FieldWrapper
const wrapperProps = computed(() => ({
  label: props.label,
  hint: props.hint,
  error: props.error,
  errorMessage: props.errorMessage,
  required: props.required,
  showOptional: props.showOptional,
}))

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  const numValue = value === '' ? null : parseFloat(value)
  emit('update:modelValue', numValue)
}
</script>

<template>
  <FieldWrapper v-bind="wrapperProps">
    <template #input="{ inputId, ariaDescribedBy }">
      <div :class="[$style.inputContainer, { [$style.error]: error, [$style.disabled]: disabled }]">
        <input
          :id="inputId"
          type="number"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :min="min"
          :max="max"
          :step="step"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="error"
          :class="$style.input"
          @input="handleInput"
          @blur="emit('blur')"
          @focus="emit('focus')"
        />

        <span v-if="unitText" :class="$style.unit">
          {{ unitText }}
        </span>
      </div>
    </template>
  </FieldWrapper>
</template>

<style module>
.inputContainer {
  display: flex;
  align-items: center;
  border: var(--border-width-thin) solid var(--color-border-neutral-base-default);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  transition: all var(--transition-duration-fast);
}

.inputContainer:focus-within {
  border-color: var(--color-border-brand-primary-default);
  box-shadow: var(--shadow-10);
}

.inputContainer.error {
  border-color: var(--color-border-intent-error-default);
}

.inputContainer.disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

.input {
  flex: 1;
  min-width: 0;
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--typography-body-md-default);
  color: var(--color-text-neutral-base-default);
  border: none;
  background: transparent;
  outline: none;
}

.input:disabled {
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--color-text-neutral-subtle-default);
}

.unit {
  padding: 0 var(--spacing-3);
  color: var(--color-text-neutral-muted-default);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}
</style>
