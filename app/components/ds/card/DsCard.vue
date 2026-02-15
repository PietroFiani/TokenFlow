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
  background: white;
  border-radius: 0.75rem;
}

.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
}

.paddingNone { padding: 0; }
.paddingSm { padding: 1rem; }
.paddingMd { padding: 1.5rem; }
.paddingLg { padding: 2rem; }
</style>