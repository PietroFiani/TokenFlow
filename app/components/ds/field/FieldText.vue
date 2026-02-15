<script setup lang="ts">
import { computed } from 'vue'

interface FieldTextProps {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  prefixText?: string
  suffixText?: string
  // FieldWrapper props
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  showOptional?: boolean
}

const props = withDefaults(defineProps<FieldTextProps>(), {
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
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
</script>

<template>
  <FieldWrapper v-bind="wrapperProps">
    <template #input="{ inputId, ariaDescribedBy }">
      <div :class="[$style.inputContainer, { [$style.error]: error, [$style.disabled]: disabled }]">
        <span v-if="prefixText || $slots.prefix" :class="$style.prefix">
          <slot name="prefix">{{ prefixText }}</slot>
        </span>

        <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="error"
          :class="$style.input"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @blur="emit('blur')"
          @focus="emit('focus')"
        />

        <span v-if="suffixText || $slots.suffix" :class="$style.suffix">
          <slot name="suffix">{{ suffixText }}</slot>
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
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  transition: all var(--transition-duration-fast);
}

.inputContainer:hover:not(.disabled):not(.error) {
  border-color: var(--color-border-brand-primary-default);
}

.inputContainer:focus-within {
  border: var(--border-width-medium) solid var(--color-border-brand-primary-default);
  box-shadow: none;
}

.inputContainer.error {
  border-color: var(--color-border-intent-error-default);
}

.inputContainer.error:focus-within {
  border: var(--border-width-thin) solid var(--color-border-intent-error-default);
}

.inputContainer.disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

.input {
  flex: 1;
  min-width: 0;
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--typography-body-sm-default);
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

.prefix,
.suffix {
  padding: 0 var(--spacing-3);
  color: var(--color-text-neutral-muted-default);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}
</style>
