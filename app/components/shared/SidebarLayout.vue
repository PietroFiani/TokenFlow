<script setup lang="ts">
// Reusable sidebar + main content layout component
</script>

<template>
  <div :class="$style.layout">
    <!-- Sidebar (left) -->
    <aside :class="$style.sidebar">
      <slot name="sidebar" />
    </aside>

    <!-- Main content area (right) -->
    <main :class="$style.content">
      <slot />
    </main>
  </div>
</template>

<style module>
.layout {
  display: flex;
  height: calc(100vh - 64px); /* Subtract header height */
  background: #f5f5f5;
}

.sidebar {
  flex-shrink: 0;
  overflow-y: auto;
  background: white;
  border-right: 1px solid #e5e7eb;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>
