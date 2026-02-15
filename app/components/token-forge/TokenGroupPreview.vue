<script setup lang="ts">
import ColorGridPreview from '~/app/components/token-forge/previews/ColorGridPreview.vue'
import OpacityPreview from '~/app/components/token-forge/previews/OpacityPreview.vue'
import FontFamilyPreview from '~/app/components/token-forge/previews/FontFamilyPreview.vue'
import DimensionPreview from '~/app/components/token-forge/previews/DimensionPreview.vue'
import TypographyScalePreview from '~/app/components/token-forge/previews/TypographyScalePreview.vue'

interface Props {
  groupName: string
  groupTokens: Record<string, any>
}

const props = defineProps<Props>()

// Map group names to preview components
const previewComponents: Record<string, any> = {
  color: ColorGridPreview,
  opacity: OpacityPreview,
  fontFamily: FontFamilyPreview,
  fontSize: DimensionPreview,
  spacing: DimensionPreview,
  borderRadius: DimensionPreview,
  borderWidth: DimensionPreview,
  fontWeight: TypographyScalePreview,
  lineHeight: TypographyScalePreview,
  letterSpacing: TypographyScalePreview,
}

const currentPreview = computed(() => previewComponents[props.groupName])

const previewProps = computed(() => {
  // Build appropriate props for each preview type
  switch (props.groupName) {
    case 'color':
      return { colorTokens: props.groupTokens }
    case 'opacity':
      return { opacityTokens: props.groupTokens }
    case 'fontFamily':
      return { fontFamilyTokens: props.groupTokens }
    case 'fontSize':
    case 'spacing':
    case 'borderRadius':
    case 'borderWidth':
      return { dimensionTokens: props.groupTokens, visualType: props.groupName }
    case 'fontWeight':
    case 'lineHeight':
    case 'letterSpacing':
      return { tokens: props.groupTokens, scaleType: props.groupName }
    default:
      return {}
  }
})
</script>

<template>
  <component
    v-if="currentPreview"
    :is="currentPreview"
    v-bind="previewProps"
  />
  <div v-else :class="$style.noPreview">
    <p>No visual preview available for this token group.</p>
  </div>
</template>

<style module>
.noPreview {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}
</style>
