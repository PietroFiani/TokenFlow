<script setup lang="ts">
/**
 * @deprecated Use FieldText, FieldNumber, or FieldSelect instead.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * - Text inputs: Use FieldText
 * - Number inputs: Use FieldNumber
 * - Dropdowns: Use FieldSelect
 */
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  error?: boolean
  errorMessage?: string
  type?: 'text' | 'number'
}>(), {
  placeholder: '',
  error: false,
  errorMessage: '',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()
</script>

<template>
  <div :class="$style.wrapper">
    <input
      :type="type"
      :class="[$style.input, { [$style.error]: error }]"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <span v-if="error && errorMessage" :class="$style.errorMessage">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-md);
  border: var(--border-width-thin) solid var(--color-border-neutral-base-default);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  color: var(--color-text-neutral-base-default);
  transition: all 0.15s ease;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--color-border-brand-primary-default);
  box-shadow: var(--shadow-10);
}

.input::placeholder {
  color: var(--color-text-neutral-subtle-default);
}

.input.error {
  border-color: var(--color-border-intent-error-default);
}

.input.error:focus {
  border-color: var(--color-border-intent-error-default);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.errorMessage {
  font-size: var(--font-size-sm);
  color: var(--color-text-intent-error-default);
}
</style>
