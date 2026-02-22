<script setup lang="ts">
import type { FieldWrapperProps } from './types'
import { useFieldWrapperProps } from '~/app/composables/useFieldWrapperProps'

interface FieldTextProps extends FieldWrapperProps {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  prefixText?: string
  suffixText?: string
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

const wrapperProps = useFieldWrapperProps(props)
</script>

<template>
  <FieldWrapper v-bind="wrapperProps">
    <template #input="{ inputId, ariaDescribedBy }">
      <div :class="[$style.inputContainer, { [$style.error]: error, [$style.disabled]: disabled }]">
        <div v-if="prefixText || $slots.prefix" :class="$style.prefix">
          <slot name="prefix">{{ prefixText }}</slot>
        </div>

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
  width: 100%;
  max-width: 100%;
  min-width: 200px;
  border: 1px solid var(--color-border-neutral-base-default);
  border-radius: 12px;
  background: var(--color-white);
  transition: all var(--transition-duration-fast);
  box-sizing: border-box;
}

.inputContainer:hover:not(.disabled):not(.error):not(:focus-within) {
  border-color: var(--color-border-brand-primary-default);
}

.inputContainer:focus-within:not(.error) {
  border-color: var(--color-border-brand-primary-default);
  /* Simulate 2px border using inset box-shadow to avoid dimension changes */
  box-shadow: inset 0 0 0 1px var(--color-border-brand-primary-default);
}

.inputContainer.error {
  border-color: var(--color-border-intent-error-default);
}

.inputContainer.error:focus-within {
  border-color: var(--color-border-intent-error-default);
  box-shadow: none;
}

.inputContainer.disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

.input {
  flex: 1 1 0%;
  min-width: 0;
  width: 0;
  padding: 12px 16px;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-neutral-base-default);
  border: none;
  background: transparent;
  outline: none;
  box-sizing: border-box;
}

.input:disabled {
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--color-text-neutral-subtle-default);
}

.inputContainer.error .input {
  color: var(--color-text-intent-error-default);
}

.prefix,
.suffix {
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-3);
  color: var(--color-text-neutral-muted-default);
  font-size: 14px;
  flex-shrink: 0;
  box-sizing: border-box;
}
</style>
