<script setup lang="ts">
// Use composables
const {
  activeTab,
  activeGroup,
  brandColors,
  fonts,
  spacingBase,
  breakpointsConfig,
  canGenerate,
  primitiveTokens,
  semanticTokens,
  currentTokens,
  currentGroupTokens,
} = useTokenForgeState()

const { downloadJson } = useDownload()

// Download handler
function handleDownload() {
  if (activeTab.value === 'primitive' && primitiveTokens.value) {
    downloadJson(primitiveTokens.value, 'primitive.json')
  } else if (activeTab.value === 'semantic' && semanticTokens.value) {
    downloadJson(semanticTokens.value, 'semantic.json')
  }
}
</script>

<template>
  <SidebarLayout>
    <!-- Sidebar slot -->
    <template #sidebar>
      <TokenForgeSidebar
        :active-tab="activeTab"
        :active-group="activeGroup"
        @update:active-tab="activeTab = $event"
        @update:active-group="activeGroup = $event"
      />
    </template>

    <!-- Main content (default slot) -->
    <ParametersTabContent
      v-if="activeTab === 'parameters'"
      :brand-colors="brandColors"
      :fonts="fonts"
      :spacing-base="spacingBase"
      :breakpoints-config="breakpointsConfig"
      @update:brand-colors="brandColors = $event"
      @update:fonts="fonts = $event"
      @update:spacing-base="spacingBase = $event"
      @update:breakpoints-config="breakpointsConfig = $event"
    />

    <!-- Primitive/Semantic Tab Content -->
    <div v-else>
      <!-- Header with download button -->
      <div :class="$style.header">
        <h3 :class="$style.title">
          {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }} Tokens
        </h3>
        <DsButton
          :disabled="!currentTokens"
          @click="handleDownload"
        >
          Download {{ activeTab }}.json
        </DsButton>
      </div>

      <!-- Empty state -->
      <DsCard v-if="!currentTokens" :class="$style.emptyState">
        <p>Enter at least a primary brand color and a primary font name to generate tokens.</p>
      </DsCard>

      <!-- Content when tokens exist -->
      <div v-else-if="currentGroupTokens" :class="$style.previewContainer">
        <!-- Group Title -->
        <h4 :class="$style.groupTitle">{{ activeGroup }}</h4>

        <!-- Visual Preview Card (Primitive Tab Only) -->
        <DsCard v-if="activeTab === 'primitive'" :class="$style.visualCard" padding="sm">
          <TokenGroupPreview
            :group-name="activeGroup"
            :group-tokens="currentGroupTokens"
          />
        </DsCard>

        <!-- JSON Tree Card (Always Shown) -->
        <DsCard :class="$style.treeCard">
          <TokenTreePreview
            :group-name="activeGroup"
            :group-tokens="currentGroupTokens"
          />
        </DsCard>
      </div>

      <!-- No tokens for group -->
      <DsCard v-else :class="$style.emptyState">
        <p>No tokens available for this group.</p>
      </DsCard>
    </div>
  </SidebarLayout>
</template>

<style module>
/* Layout styles moved to SidebarLayout component */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.previewContainer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.groupTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  text-transform: capitalize;
}

.emptyState {
  text-align: center;
  padding: 3rem 1.5rem;
}

.emptyState p {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}
</style>
