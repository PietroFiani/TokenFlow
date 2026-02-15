<script setup lang="ts">
interface Props {
  groupName: string
  groupTokens: Record<string, any>
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <div :class="$style.header">
      <h4 :class="$style.title">JSON Preview</h4>
      <span :class="$style.subtitle">Technical token structure</span>
    </div>
    <div :class="$style.treeContainer">
      <JsonTreeNode
        v-for="[key, val] in Object.entries(groupTokens)"
        :key="key"
        :label="key"
        :value="val"
        :depth="0"
        :default-open="true"
      />
    </div>
  </div>
</template>

<style module>
.header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

.treeContainer {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
