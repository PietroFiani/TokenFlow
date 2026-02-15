import { ref, computed } from 'vue'
import type {
  DesignSystemConfig,
  PrimitiveTokens,
  SpacingBase,
  BreakpointsConfig,
  BrandColorEntry,
  FontFamilyEntry,
} from '~/app/types/designTokens'
import { generatePrimitiveTokens, generateSemanticTokens } from '~/app/utils/designTokenGenerator'
import { FONT_FALLBACK_STACKS, DEFAULT_BREAKPOINTS } from '~/app/utils/fixedTokens'

export type TokenTab = 'parameters' | 'primitive' | 'semantic'

/**
 * Composable for Token Forge state management
 * Extracted from TokenForgeView.vue
 */
export const useTokenForgeState = () => {
  // Tab and group state
  const activeTab = ref<TokenTab>('parameters')
  const activeGroup = ref<string>('color')

  // Form state
  const brandColors = ref<BrandColorEntry[]>([
    { role: 'primary', seedColor: '', enabled: true },
    { role: 'secondary', seedColor: '', enabled: false },
    { role: 'tertiary', seedColor: '', enabled: false },
  ])

  const fonts = ref<FontFamilyEntry[]>([
    { role: 'primary', familyName: '', fallbacks: FONT_FALLBACK_STACKS['System Sans'], enabled: true },
    { role: 'secondary', familyName: '', fallbacks: FONT_FALLBACK_STACKS['System Serif'], enabled: false },
  ])

  const spacingBase = ref<SpacingBase>(4)

  const breakpointsConfig = ref<BreakpointsConfig>({
    enabled: false,
    breakpoints: DEFAULT_BREAKPOINTS.map(bp => ({ ...bp })),
  })

  // Can we generate tokens?
  const canGenerate = computed(() => {
    return brandColors.value[0].seedColor.trim() !== ''
      && fonts.value[0].familyName.trim() !== ''
  })

  // Build config for the generator
  const config = computed<DesignSystemConfig>(() => ({
    brandColors: brandColors.value,
    fonts: fonts.value,
    spacingBase: spacingBase.value,
    breakpoints: breakpointsConfig.value,
  }))

  // Generated primitive tokens (reactive)
  const primitiveTokens = computed<PrimitiveTokens | null>(() => {
    if (!canGenerate.value) return null
    try {
      return generatePrimitiveTokens(config.value)
    } catch {
      return null
    }
  })

  // Generated semantic tokens (reactive)
  const semanticTokens = computed<any | null>(() => {
    if (!primitiveTokens.value) return null
    try {
      return generateSemanticTokens(primitiveTokens.value)
    } catch {
      return null
    }
  })

  // Current tokens based on active tab
  const currentTokens = computed(() => {
    if (activeTab.value === 'primitive') return primitiveTokens.value
    if (activeTab.value === 'semantic') return semanticTokens.value
    return null
  })

  // Current group tokens
  const currentGroupTokens = computed(() => {
    if (!currentTokens.value || !activeGroup.value) return null
    return currentTokens.value[activeGroup.value]
  })

  return {
    // State
    activeTab,
    activeGroup,
    brandColors,
    fonts,
    spacingBase,
    breakpointsConfig,

    // Computed
    canGenerate,
    config,
    primitiveTokens,
    semanticTokens,
    currentTokens,
    currentGroupTokens,
  }
}
