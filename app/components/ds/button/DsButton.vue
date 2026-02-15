<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'toggle'
  size?: 'md' | 'sm' | 'lg'
  disabled?: boolean
  active?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  active: false,
})
</script>

<template>
  <button
    :class="[
      $style.button,
      $style[variant],
      $style[size],
      { [$style.active]: active }
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style module>
/* Base button styles */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  white-space: nowrap;
}

.button:disabled {
  opacity: var(--opacity-40);
  cursor: not-allowed;
}

/* Sizes */
.sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.md {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-md);
}

.lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
}

/* Variants */
.primary {
  background-color: var(--color-background-brand-primary-inverse-default);
  color: var(--color-text-neutral-inverse-default);
}

.primary:hover:not(:disabled) {
  background-color: var(--color-background-brand-primary-inverse-hover);
}

.secondary {
  background-color: var(--color-white);
  color: var(--color-text-neutral-muted-default);
  border: var(--border-width-thin) solid var(--color-border-neutral-base-default);
}

.secondary:hover:not(:disabled) {
  background-color: var(--color-background-neutral-base-hover);
  border-color: var(--color-border-neutral-base-hover);
}

.outline {
  background-color: transparent;
  color: var(--color-text-brand-primary-default);
  border: var(--border-width-thin) solid var(--color-border-brand-primary-default);
}

.outline:hover:not(:disabled) {
  background-color: var(--color-background-brand-primary-default);
}

.ghost {
  background-color: transparent;
  color: var(--color-text-neutral-subtle-default);
  border: none;
}

.ghost:hover:not(:disabled) {
  background-color: var(--color-background-neutral-muted-default);
  color: var(--color-text-neutral-muted-default);
}

.toggle {
  background-color: var(--color-background-neutral-muted-default);
  color: var(--color-text-neutral-subtle-default);
  border: none;
}

.toggle:hover:not(:disabled) {
  background-color: var(--color-background-neutral-muted-hover);
  color: var(--color-text-neutral-muted-default);
}

.toggle.active {
  background-color: var(--color-background-brand-primary-inverse-default);
  color: var(--color-text-neutral-inverse-default);
  font-weight: var(--font-weight-semibold);
}
</style>
