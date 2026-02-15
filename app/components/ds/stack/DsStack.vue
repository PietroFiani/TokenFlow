<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'row' | 'column'
  gap?: '0' | '0.25' | '0.5' | '0.75' | '1' | '1.5' | '2' | '3'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}>(), {
  direction: 'column',
  gap: '1',
  align: 'stretch',
  justify: 'start',
})
</script>

<template>
  <div
    :class="$style.stack"
    :style="{
      flexDirection: direction,
      gap: `${gap}rem`,
      alignItems: align,
      justifyContent: justify === 'between' ? 'space-between' : justify === 'around' ? 'space-around' : justify,
    }"
  >
    <slot />
  </div>
</template>

<style module>
.stack {
  display: flex;
}
</style>
