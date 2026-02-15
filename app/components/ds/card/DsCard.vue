<script setup lang="ts">
const props = withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  title?: string
}>(), {
  padding: 'md',
  shadow: true,
})

const paddingClasses: Record<string, string> = {
  none: 'paddingNone',
  sm: 'paddingSm',
  md: 'paddingMd',
  lg: 'paddingLg',
}
</script>

<template>
  <div
    :class="[
      $style.card,
      $style[paddingClasses[padding]],
      { [$style.shadow]: shadow }
    ]"
  >
    <h5 v-if="title" :class="$style.title">{{ title }}</h5>
    <slot />
  </div>
</template>

<style module>
.card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
}

.shadow {
  box-shadow: var(--shadow-5);
}

.title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-neutral-subtle-default);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--spacing-4) 0;
}

.paddingNone { padding: 0; }
.paddingSm { padding: var(--spacing-4); }
.paddingMd { padding: var(--spacing-6); }
.paddingLg { padding: var(--spacing-8); }
</style>