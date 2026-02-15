<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  label: string
  size?: 'sm' | 'md'
}>(), {
  color: '',
  size: 'md',
})
</script>

<template>
  <div :class="[$style.badge, $style[size]]">
    <span
      v-if="color"
      :class="$style.swatch"
      :style="{ backgroundColor: color }"
    />
    <span :class="$style.text">{{ label }}</span>
  </div>
</template>

<style module>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--color-background-neutral-muted-default);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

.sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
}

.md {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-full);
  border: var(--border-width-thin) solid rgba(0, 0, 0, var(--opacity-10));
}

.text {
  color: var(--color-text-neutral-muted-default);
}
</style>
