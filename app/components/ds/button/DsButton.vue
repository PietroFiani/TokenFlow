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
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  white-space: nowrap;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

.lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Variants */
.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.outline {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.outline:hover:not(:disabled) {
  background-color: #eff6ff;
}

.ghost {
  background-color: transparent;
  color: #6b7280;
  border: none;
}

.ghost:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #374151;
}

.toggle {
  background-color: #f3f4f6;
  color: #6b7280;
  border: none;
}

.toggle:hover:not(:disabled) {
  background-color: #e5e7eb;
  color: #374151;
}

.toggle.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}
</style>
