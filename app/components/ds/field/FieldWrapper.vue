<script setup lang="ts">
import { computed, useId } from 'vue'

interface FieldWrapperProps {
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  showOptional?: boolean
}

const props = withDefaults(defineProps<FieldWrapperProps>(), {
  showOptional: false,
})

// Generate unique ID for this field
const inputId = `field-${useId()}`

// Compute aria-describedby from hint/error
const ariaDescribedBy = computed(() => {
  const parts = []
  if (props.hint && !props.error) {
    parts.push(`${inputId}-hint`)
  }
  if (props.error && props.errorMessage) {
    parts.push(`${inputId}-error`)
  }
  return parts.length > 0 ? parts.join(' ') : undefined
})
</script>

<template>
  <div :class="$style.fieldWrapper">
    <label v-if="label" :for="inputId" :class="$style.label">
      {{ label }}
      <span v-if="required" :class="$style.requiredIndicator">*</span>
      <span v-else-if="showOptional" :class="$style.optionalIndicator">Optional</span>
    </label>

    <slot name="input" :inputId="inputId" :ariaDescribedBy="ariaDescribedBy" />

    <div v-if="hint && !error" :id="`${inputId}-hint`" :class="$style.hint">
      {{ hint }}
    </div>

    <div v-if="error && errorMessage" :id="`${inputId}-error`" :class="$style.errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style module>
.fieldWrapper {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font: var(--typography-label-md);
  color: var(--color-text-neutral-base-default);
  margin-bottom: var(--spacing-1);
}

.requiredIndicator {
  color: var(--color-text-intent-error-default);
  margin-left: var(--spacing-1);
}

.optionalIndicator {
  font-size: var(--font-size-sm);
  color: var(--color-text-neutral-subtle-default);
  margin-left: var(--spacing-1);
}

.hint {
  font: var(--typography-body-sm-default);
  color: var(--color-text-neutral-muted-default);
  margin-top: var(--spacing-1);
}

.errorMessage {
  font: var(--typography-body-sm-default);
  color: var(--color-text-intent-error-default);
  margin-top: var(--spacing-1);
}
</style>
