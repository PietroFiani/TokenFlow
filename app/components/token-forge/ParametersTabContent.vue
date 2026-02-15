<script setup lang="ts">
import type { BrandColorEntry, FontFamilyEntry, SpacingBase, BreakpointsConfig } from '~/app/types/designTokens';
import BrandColorsSection from './BrandColorsSection.vue';
import TypographySection from './TypographySection.vue';
import SpacingSection from './SpacingSection.vue';
import BreakpointsSection from './BreakpointsSection.vue';

defineProps<{
  brandColors: BrandColorEntry[];
  fonts: FontFamilyEntry[];
  spacingBase: SpacingBase;
  breakpointsConfig: BreakpointsConfig;
}>();

const emit = defineEmits<{
  'update:brandColors': [colors: BrandColorEntry[]];
  'update:fonts': [fonts: FontFamilyEntry[]];
  'update:spacingBase': [base: SpacingBase];
  'update:breakpointsConfig': [config: BreakpointsConfig];
}>();
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.configSections">
      <BrandColorsSection
        :colors="brandColors"
        @update:colors="emit('update:brandColors', $event)"
      />

      <TypographySection
        :fonts="fonts"
        @update:fonts="emit('update:fonts', $event)"
      />

      <SpacingSection
        :spacing-base="spacingBase"
        @update:spacing-base="emit('update:spacingBase', $event)"
      />

      <BreakpointsSection
        :breakpoints-config="breakpointsConfig"
        @update:breakpoints-config="emit('update:breakpointsConfig', $event)"
      />
    </div>
  </div>
</template>

<style module>
.container {
  /* No padding - edge to edge layout */
}

.configSections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
