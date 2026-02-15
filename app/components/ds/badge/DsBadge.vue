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
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-weight: 500;
}

.sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.md {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.text {
  color: #374151;
}
</style>
