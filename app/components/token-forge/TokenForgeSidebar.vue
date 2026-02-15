<script setup lang="ts">
import { computed } from 'vue';

type TokenTab = 'parameters' | 'primitive' | 'semantic';

const props = defineProps<{
  activeTab: TokenTab;
  activeGroup: string;
}>();

const emit = defineEmits<{
  'update:activeTab': [tab: TokenTab];
  'update:activeGroup': [group: string];
}>();

const groups = computed(() => {
  if (props.activeTab === 'parameters') return [];
  if (props.activeTab === 'primitive') {
    return ['color', 'opacity', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'spacing', 'borderRadius', 'borderWidth', 'breakpoint'];
  }
  // Semantic tab
  return ['color', 'spacing', 'border', 'typography', 'transition', 'zIndex', 'shadow', 'iconSize'];
});

// Auto-select first group when tab changes
function handleTabChange(tab: TokenTab) {
  emit('update:activeTab', tab);
  if (tab !== 'parameters' && groups.value.length > 0) {
    emit('update:activeGroup', groups.value[0]);
  }
}
</script>

<template>
  <div :class="$style.sidebar">
    <!-- Tab Bar -->
    <div :class="$style.tabBar">
      <button
        v-for="tab in ['parameters', 'primitive', 'semantic']"
        :key="tab"
        :class="[$style.tab, { [$style.tabActive]: activeTab === tab }]"
        @click="handleTabChange(tab as TokenTab)"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Preset Section (only for Parameters tab) -->
    <div v-if="activeTab === 'parameters'" :class="$style.presetSection">
      <div :class="$style.presetTitle">Presets</div>
      <div :class="$style.presetCard">
        <div :class="$style.presetName">Default</div>
        <div :class="$style.presetDescription">Preset description</div>
      </div>
    </div>

    <!-- Groups Section (only for Primitive and Semantic tabs) -->
    <div v-if="activeTab !== 'parameters'" :class="$style.groupsSection">
      <div :class="$style.groupsTitle">
        <p>Groups</p>
      </div>
      <div :class="$style.groupList">
        <button
          v-for="group in groups"
          :key="group"
          :class="[$style.groupItem, { [$style.groupItemActive]: activeGroup === group }]"
          @click="emit('update:activeGroup', group)"
        >
          {{ group }}
        </button>
      </div>
    </div>
  </div>
</template>

<style module>
.sidebar {
  width: 355px;
  background: white;
  border-right: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  height: 100%;
}

.tabBar {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #dcdcdc;
}

.tab {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 400;
  color: #5a5a5a;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.tab:hover {
  background: #f9fafb;
}

.tabActive {
  background: #f5f5f5;
  font-weight: 600;
  color: black;
}

.groupsSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px;
}

.groupsTitle {
  padding: 0 12px;
}

.groupsTitle p {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin: 0;
}

.groupList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.groupItem {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 400;
  color: black;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.groupItem:hover {
  background: #f9fafb;
}

.groupItemActive {
  background: #f5f5f5;
  font-weight: 600;
}

.presetSection {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.presetTitle {
  font-size: 16px;
  font-weight: 600;
  color: black;
  padding: 0 12px;
}

.presetCard {
  padding: 12px;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.presetCard:hover {
  background: #f9fafb;
}

.presetName {
  font-size: 14px;
  font-weight: 600;
  color: black;
  margin-bottom: 4px;
}

.presetDescription {
  font-size: 12px;
  color: #6b7280;
}
</style>
