<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  label: string;
  value: unknown;
  depth?: number;
  defaultOpen?: boolean;
}>();

const depth = props.depth ?? 0;
const isObject = typeof props.value === 'object' && props.value !== null && !Array.isArray(props.value);
const isArray = Array.isArray(props.value);
const isExpandable = isObject || isArray;
const expanded = ref(props.defaultOpen ?? depth < 1);

const entries = isObject
  ? Object.entries(props.value as Record<string, unknown>)
  : isArray
    ? (props.value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
    : [];

const childCount = entries.length;

function formatPrimitive(val: unknown): string {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  return String(val);
}

function getPreview(val: unknown): string {
  if (isObject) {
    const keys = Object.keys(val as Record<string, unknown>);
    if (keys.length <= 3) return `{ ${keys.join(', ')} }`;
    return `{ ${keys.slice(0, 3).join(', ')}, ... }`;
  }
  if (isArray) {
    return `[${(val as unknown[]).length} items]`;
  }
  return '';
}

// Detect color hex values for inline swatch preview
function getColorHex(): string | null {
  if (!isObject) return null;
  const obj = props.value as Record<string, unknown>;
  if (obj.$type === 'color' && typeof obj.$value === 'object' && obj.$value !== null) {
    const v = obj.$value as Record<string, unknown>;
    if (typeof v.hex === 'string') return v.hex as string;
  }
  if (typeof obj.hex === 'string' && typeof obj.colorSpace === 'string') {
    return obj.hex as string;
  }
  return null;
}

const colorHex = getColorHex();
</script>

<template>
  <div :class="$style.node" :style="{ paddingLeft: depth > 0 ? '1.25rem' : '0' }">
    <!-- Expandable node -->
    <div
      v-if="isExpandable"
      :class="$style.row"
      @click="expanded = !expanded"
    >
      <span :class="[$style.arrow, { [$style.arrowExpanded]: expanded }]">&#9656;</span>
      <span :class="$style.key">{{ label }}</span>
      <span
        v-if="colorHex"
        :class="$style.colorSwatch"
        :style="{ backgroundColor: colorHex }"
      ></span>
      <span :class="$style.badge">{{ childCount }}</span>
      <span v-if="!expanded" :class="$style.preview">{{ getPreview(value) }}</span>
    </div>

    <!-- Expanded children -->
    <div v-if="isExpandable && expanded" :class="$style.children">
      <JsonTreeNode
        v-for="[childKey, childVal] in entries"
        :key="childKey"
        :label="childKey"
        :value="childVal"
        :depth="depth + 1"
        :default-open="depth < 0"
      />
    </div>

    <!-- Primitive value -->
    <div v-if="!isExpandable" :class="$style.row">
      <span :class="$style.leafIndent"></span>
      <span :class="$style.key">{{ label }}:</span>
      <span :class="[$style.value, $style[`type_${typeof value}`]]">{{ formatPrimitive(value) }}</span>
    </div>
  </div>
</template>

<style module>
.node {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  padding: 1px 0.25rem;
  border-radius: 3px;
  white-space: nowrap;
}

.row:hover {
  background: #f0f4ff;
}

.arrow {
  font-size: 0.625rem;
  color: #9ca3af;
  transition: transform 0.15s;
  width: 0.75rem;
  text-align: center;
  flex-shrink: 0;
  user-select: none;
}

.arrowExpanded {
  transform: rotate(90deg);
}

.leafIndent {
  width: 0.75rem;
  flex-shrink: 0;
}

.key {
  color: #7c3aed;
  font-weight: 500;
  flex-shrink: 0;
}

.colorSwatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.badge {
  font-size: 0.625rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0 0.375rem;
  border-radius: 999px;
  font-weight: 600;
  flex-shrink: 0;
}

.preview {
  color: #9ca3af;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value {
  margin-left: 0.25rem;
}

.type_string {
  color: #059669;
}

.type_number {
  color: #2563eb;
}

.type_boolean {
  color: #d97706;
}

.children {
  /* no extra styling, padding handled by child depth */
}
</style>
